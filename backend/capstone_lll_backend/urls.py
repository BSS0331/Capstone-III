"""
URL configuration for capstone_lll_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for caps3 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from mainApp.views import hello_rest_api, naver_login, naver_callback
from mainApp.views import LoginView
from mainApp.views import SignupView
from django.contrib import admin
from django.urls import path,include
from mainApp.views import google_login,google_callback,get_user_model
from mainApp.views import (
    DetailPost,  # 포스트 상세 페이지를 보여주는 뷰
    PostSearchView,  # 포스트를 검색하는 뷰
    PostListView,  # 모든 포스트를 리스트하는 뷰
    CommentListView,  # 특정 포스트에 대한 댓글을 리스트하는 뷰
    # api_posts,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hello/', hello_rest_api, name='hello_rest_api'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    # path('users/', include('<app_with_User_model>.urls')),
    path('users/', include('allauth.urls')),
    path('google/login/', google_login, name='google_login'),
    path('google/callback/', google_callback, name='google_callback'),
    path('accounts/naver/login/', naver_login, name='naver_login'),
    path('accounts/naver/login/callback/', naver_callback, name='naver_callback'),
    # 모든 포스트를 나열하는 뷰로 연결되는 URL 패턴입니다.
    path("posts/", PostListView.as_view(), name="list_posts"),
    # 특정 포스트의 상세 페이지를 보여주는 뷰로 연결되는 URL 패턴입니다.
    path("posts/<int:pk>/", DetailPost.as_view(), name="detail_post"),
    # 포스트를 검색하는 뷰로 연결되는 URL 패턴입니다.
    path("posts/search/", PostSearchView.as_view(), name="search_posts"),
    # 특정 포스트에 대한 댓글을 리스트하는 뷰로 연결되는 URL 패턴입니다.
    path("comments/<int:post_id>/", CommentListView.as_view(), name="list_comments"),
    # path("api/posts", api_posts, name="api-posts"),


]

