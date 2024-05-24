from django.shortcuts import render, redirect
import os
import secrets
import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework import status, generics, permissions, views
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserLoginSerializer, PostSerializer, PostCreateUpdateSerializer, CommentSerializer, CommentCreateUpdateSerializer
from .models import Post, Comment
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Category, Ingredient
from .serializers import CategorySerializer, IngredientSerializer


# 사용자 회원가입 API
class SignupView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 사용자 로그인 API
class LoginView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                login(request, user)
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

@api_view(['GET'])
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

# 게시물 리스트 조회 및 생성 뷰
class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by("-creation_date")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)

# 게시물 상세 조회, 업데이트, 삭제 뷰
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateUpdateSerializer
        return PostSerializer

# 댓글 리스트 조회 및 생성 뷰
class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id, parent__isnull=True)

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)

# 댓글 상세 조회, 업데이트, 삭제 뷰
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
