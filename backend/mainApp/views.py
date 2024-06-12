from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from .models import Post, Comment, Category, Ingredient, User
from .serializers import PostSerializer, PostCreateUpdateSerializer, CommentSerializer, CommentCreateUpdateSerializer, CategorySerializer, IngredientSerializer, UserRegistrationSerializer, UserLoginSerializer
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.shortcuts import redirect
import requests
import secrets
from django.conf import settings

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=200)
            return Response({'message': 'Invalid credentials'}, status=401)
        return Response(serializer.errors, status=400)

# Google 로그인 및 콜백 처리
def google_login(request):
    params = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'email profile'
    }
    auth_url = 'https://accounts.google.com/o/oauth2/auth?' + '&'.join(f'{k}={v}' for k, v in params.items())
    return redirect(auth_url)

@api_view(['GET'])
def initiate_auth(request):
    state = secrets.token_urlsafe()
    request.session['oauth_state'] = state
    params = {
        'client_id': os.getenv('GOOGLE_CLIENT_ID'),
        'response_type': 'code',
        'scope': 'email profile',
        'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI'),
        'state': state
    }
    auth_url = 'https://accounts.google.com/o/oauth2/auth?' + '&'.join(f'{k}={v}' for k, v in params.items())
    return redirect(auth_url)

@api_view(['GET'])
def google_callback(request):
    received_state = request.GET.get('state')
    code = request.GET.get('code')
    expected_state = request.session.get('oauth_state')

    if received_state != expected_state:
        return Response({'error': 'Invalid state parameter'}, status=400)

    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code',
        'code': code,
    }
    token_response = requests.post(token_url, data=data)

    access_token = token_response.json().get('access_token')
    user_info_url = 'https://www.googleapis.com/oauth2/v1/userinfo'

    headers = {'Authorization': f'Bearer {access_token}'}
    user_info_response = requests.get(user_info_url, headers=headers)
    user_info = user_info_response.json()

    email = user_info.get('email')
    redirect_url = f"{os.getenv('FRONTEND_URL')}/login-success/?email={email}"
    return Response({'redirect_url': redirect_url})

# 네이버 로그인 및 콜백 처리
@api_view(['GET'])
def naver_login(request):
    url = f'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id={settings.NAVER_CLIENT_ID}&redirect_uri={settings.NAVER_REDIRECT_URI}'
    return redirect(url)

def naver_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')

    if not code:
        return JsonResponse({'error': 'Code is missing'}, status=400)

    token_response = requests.post(
        "https://nid.naver.com/oauth2.0/token",
        data={
            'grant_type': 'authorization_code',
            'client_id': settings.NAVER_CLIENT_ID,
            'client_secret': settings.NAVER_SECRET_KEY,
            'code': code,
            'state': state
        }
    )
    access_token = token_response.json().get('access_token')

    profile_response = requests.get(
        "https://openapi.naver.com/v1/nid/me",
        headers={'Authorization': f'Bearer {access_token}'}
    )
    profile_data = profile_response.json()

    email = profile_data.get('response', {}).get('email')
    name = profile_data.get('response', {}).get('name')

    return JsonResponse({
        'message': 'Naver login success',
        'name': name,
        'email': email
    })

class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by("-creation_date")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        serializer.save(member=self.request.user, content=content)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateUpdateSerializer
        return PostSerializer

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id, parent__isnull=True)

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CommentCreateUpdateSerializer
        return CommentSerializer

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class IngredientListCreateView(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
def upload_image(request):
    file = request.FILES['file']
    file_name = default_storage.save(file.name, file)
    file_url = default_storage.url(file_name)
    return Response({'file_url': file_url}, status=201)
