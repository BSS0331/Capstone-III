import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // 로컬 저장소를 다루기 위한 모듈

import SocialLoginButton from '../components/common/SocialLoginButton';

// 설정 화면 구성 컴포넌트
const SettingScreen = ({ navigation }) => {
  // 화면 포커스 시 수행할 작업을 설정
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();

      // 현재 화면의 탭 바와 헤더를 숨기는 옵션 설정
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        headerShown: false,
      });

      // 로그인 상태 확인
      checkLogin();

      // 컴포넌트 언마운트 시 탭 바 원래대로 복구
      return () => parent.setOptions({
        tabBarStyle: undefined,
      });
    }, [navigation])
  );

  // 상태 관리: 사용자 ID, 비밀번호 및 로그인 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 사용자 로그인 상태 확인
  const checkLogin = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error(e); // 오류 발생 시 콘솔에 출력
    }
  };

  // 일반 로그인 처리 함수
  const handleLogin = async () => {
    await AsyncStorage.setItem('userId', id);
    setIsLoggedIn(true);
  };

  // 소셜 로그인 처리 함수
  const handleSocialLogin = async (socialType) => {
    console.log(`${socialType} 로그인 실행`);
    await AsyncStorage.setItem('userId', `${socialType}User`);
    setIsLoggedIn(true);
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        // 로그인이 되어 있지 않은 상태의 UI 구성
        <>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            onChangeText={setId}  // 입력 시 ID 상태 업데이트
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry  // 비밀번호 입력 필드 보안
            onChangeText={setPassword}  // 입력 시 비밀번호 상태 업데이트
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>

          <View style={styles.socialLoginContainer}>
            <SocialLoginButton  // 소셜 로그인 버튼 컴포넌트 Naver
              iconSource={require('../assets/images/naver.png')}
              onPress={() => handleSocialLogin('Naver')}
            />
            <SocialLoginButton  // 소셜 로그인 버튼 컴포넌트 KaKaoTalk
              iconSource={require('../assets/images/kakao.png')}
              onPress={() => handleSocialLogin('KakaoTalk')}
            />
            <SocialLoginButton  // 소셜 로그인 버튼 컴포넌트 Google
              iconSource={require('../assets/images/google.png')}
              onPress={() => handleSocialLogin('Google')}
            />
          </View>
        </>
      ) : (  // 로그인이 되어 있는 상태의 UI
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>환영합니다, {id}님!</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('ProfileEdit')}>
            <Text style={styles.editProfileButtonText}>프로필 수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // 전체 화면 사용
    justifyContent: 'center',  // 중앙 정렬
    alignItems: 'center',  // 아이템을 가로 축 중앙에 배치
    padding: 20,  // 모든 방향에 20의 패딩 적용
  },
  input: {
    width: '100%',  // 너비를 부모 컨테이너의 100%로 설정
    paddingVertical: 8,  // 수직 패딩
    paddingHorizontal: 10,  // 수평 패딩
    marginVertical: 5,  // 수직 마진
    borderWidth: 1,  // 테두리 두께
    borderColor: '#ccc',  // 테두리 색상
    borderRadius: 5,  // 테두리 둥글기
  },
  loginButton: {
    backgroundColor: '#EEE8F4',  // 버튼 배경색
    paddingVertical: 15,  // 세로 패딩
    paddingHorizontal: 20,  // 가로 패딩
    borderRadius: 10,  // 모서리 둥글기
    marginTop: 20,  // 상단 여백
    width: '100%',  // 너비
    alignItems: 'center',  // 텍스트 중앙 정렬
  },
  loginButtonText: {
    color: '#4E348B',  // 텍스트 색상
    fontSize: 18,  // 텍스트 크기
  },
  signupButton: {
    position: 'absolute',  // 절대 위치
    right: 10,  // 오른쪽에서 10
    top: 10,  // 상단에서 10
    padding: 10,  // 전체 패딩
  },
  signupButtonText: {
    color: '#4E348B',  // 텍스트 색상
    fontSize: 16,  // 텍스트 크기
  },
  socialLoginContainer: {
    flexDirection: 'row',  // 가로 배치
    marginTop: 20,  // 상단 여백
    alignItems: 'center',  // 중앙 정렬
    justifyContent: 'space-evenly',  // 아이템 간격 균등 배치
    width: '78%',  // 너비
  },
  loggedInContainer: {
    // 로그인 상태일 때의 스타일 설정 (추가 필요)
  },
  editProfileButton: {
    // 프로필 수정 버튼 스타일 (추가 필요)
  },
  logoutButton: {
    // 로그아웃 버튼 스타일 (추가 필요)
  },
});

export default SettingScreen;
