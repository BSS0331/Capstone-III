# 식품 관리와 레시피 추천 모바일 앱

## 소개

이 프로젝트는 가정의 냉장, 냉동, 상온 식품에 대한 정보를 저장하고 관리 및 레시피 추천을 제공하는 모바일 앱입니다.

## 설치

### 필요 조건

- npm (버전 10.8.1 이상)
- expo (버전 51.0.9 이상)
- react (버전 18.2.0 이상)

### 설치 방법

1. 저장소를 클론합니다:
    ```bash
    git clone https://github.com/BSS0331/Capstone-III.git Capstone-III
    ```
2. 프로젝트 디렉토리로 이동합니다:
    ```bash
    cd Capstone-III
    ```
3. 필요한 의존성을 설치합니다:
    ```bash
    npm install
    ```

## 사용법

1. .env 파일을 루트 디렉토리에 추가합니다.
<img src="https://github.com/BSS0331/Capstone-III/assets/147461797/0d6c8da9-e5da-47af-bd02-8f73f9a2310b" width="350" height="700"/>

2. 모바일(안드로이드)에서 Expo Go 앱을 설치합니다.
<img src="https://github.com/BSS0331/Capstone-III/assets/147461797/d98babc6-1b00-4b17-b338-21a7f6237301" width="300" height="300"/>

3. 프로젝트를 실행합니다:
    ```bash
    npm start
    ```
4. Expo Go 앱으로 프로젝트 QR코드를 스캔합니다.
<img src="https://github.com/BSS0331/Capstone-III/assets/147461797/0be545be-1b7f-4ab4-ba3b-98c22493bd70" width="350" height="700"/>

## 구성

### 환경 변수
- 구글 소셜 로그인 API
```
GOOGLE_CLIENT_ID=insert-your-google-client-id-here
```
- 네이버 소셜 로그인 API
```
NAVER_CLIENT_ID=insert-your-naver-client-id-here
```
- 외부 API
```
API=insert-your-api-url-here
```
- 식품안전나라 공공데이터 API
```
Recipes_Data=insert-your-api-url-here
```

### 디렉토리 구조

프로젝트의 전체 디렉토리 구조는 다음과 같습니다:

```
Capstone-III/
├── .env
├── .env.example
├── .gitignore
├── App.js
├── app.json
├── babel.config.js
├── package-lock.json
├── package.json
├── README.md
├── [기타 소스 파일]
└── src/
    ├── components/common/
    │   └── SocialLoginButton.js
    ├── screens/
    │   ├── BarcodeScreen.js
    │   ├── FridgeScreen.js
    │   ├── HomeScreen.js
    │   ├── ManualEntryScreen.js
    │   ├── MypageScreen.js
    │   ├── ReceiptCaptureScreen.js
    │   ├── RecipeDetailScreen.js
    │   ├── RecipesListScreen.js
    │   ├── RecipesScreen.js
    │   ├── SearchScreen.js
    │   ├── SettingScreen.js
    │   ├── SignUpScreen.js
    │   └── TagsScreen.js
    ├── navigation/
    │   ├── HomeStack.js
    │   ├── MypageStack.js
    │   ├── RecipeStack.js
    │   ├── SettingStack.js
    │   └── TabNavigator.js
    └── assets/images/
        └── [이미지 파일]
```

## 기능

- 기능 1: 냉장, 냉동, 상온 식품 관리
- 기능 2: 레시피 추천
- 기능 3: 바코드 스캔 및 영수증 인식(구현X)
