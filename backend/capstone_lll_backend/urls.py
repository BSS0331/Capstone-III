from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from mainApp.views import (
    SignupView, LoginView, google_login, google_callback, naver_login, naver_callback,
    PostListView, PostDetailView, CommentListView, CommentDetailView, CategoryListCreateView, IngredientListCreateView, IngredientDetailView, upload_image
)

# URL 패턴 설정
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', SignupView.as_view(), name='signup'),  # 사용자 회원가입 API
    path('api/login/', LoginView.as_view(), name='login'),  # 사용자 로그인 API
    path('users/', include('allauth.urls')),  # Allauth URL 포함
    path('google/login/', google_login, name='google_login'),  # 구글 로그인 URL
    path('google/callback/', google_callback, name='google_callback'),  # 구글 콜백 URL
    path('accounts/naver/login/', naver_login, name='naver_login'),  # 네이버 로그인 URL
    path('accounts/naver/login/callback/', naver_callback, name='naver_callback'),  # 네이버 콜백 URL
    path("posts/", PostListView.as_view(), name="list_posts"),  # 게시물 리스트 조회 및 생성 URL
    path("posts/<int:pk>/", PostDetailView.as_view(), name="detail_post"),  # 게시물 상세 조회, 업데이트, 삭제 URL
    path("posts/<int:post_id>/comments/", CommentListView.as_view(), name="list_comments"),  # 특정 게시물의 댓글 조회 및 생성 URL
    path("comments/<int:pk>/", CommentDetailView.as_view(), name="detail_comment"),  # 댓글 상세 조회, 업데이트, 삭제 URL
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('ingredients/', IngredientListCreateView.as_view(), name='ingredient_list_create'),
    path('ingredients/<int:pk>/', IngredientDetailView.as_view(), name='ingredient_detail'),
    path('upload/', upload_image, name='upload_image'),  # 이미지 업로드 URL
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
