from django.shortcuts import render

# Create your views here.
import os
import secrets
import requests
from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings
from rest_framework import status
from django.contrib.auth import authenticate, login
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, views
from .models import Post, Comment, User
from .serializers import PostSerializer, CommentSerializer
from django.contrib.auth import get_user_model


# REST API 기본 테스트 함수
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def hello_rest_api(request):
    data = {'message': 'Hello, REST API!'}
    return Response(data)

# 사용자 로그인 API


class SignupView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
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

# 게시물 및 댓글 관련 API 뷰
class PostListView(generics.ListAPIView):
    queryset = Post.objects.all().order_by("-creation_date")
    serializer_class = PostSerializer

class DetailPost(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostSearchView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", None)
        if query is not None:
            return Post.objects.filter(title__icontains=query) | Post.objects.filter(content__icontains=query)
        return Post.objects.none()

class CommentListView(views.APIView):
    def get(self, request, post_id, format=None):
        comments = Comment.objects.filter(post_id=post_id, parent__isnull=True)
        serializer = CommentSerializer(comments, many=True, context={"request": request})
        return Response(serializer.data)
def api_posts(request):
    data = {"message": "This is a response from api/posts."}
    return JsonResponse(data)