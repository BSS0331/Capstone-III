import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // 임시

import SocialLoginButton from '../components/common/SocialLoginButton';

const SettingScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();

      parent.setOptions({
        tabBarStyle: { display: 'none' },
        headerShown: false,
      });

      checkLogin();

      return () => parent.setOptions({
        tabBarStyle: undefined,
      });
    }, [navigation])
  );

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 확인
  const checkLogin = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 로그인 처리 함수
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
        <>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            onChangeText={setId}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>

          <View style={styles.socialLoginContainer}>
            <SocialLoginButton
              iconSource={require('../assets/images/naver.png')}
              onPress={() => handleSocialLogin('Naver')}
            />
            <SocialLoginButton
              iconSource={require('../assets/images/kakao.png')}
              onPress={() => handleSocialLogin('KakaoTalk')}
            />
            <SocialLoginButton
              iconSource={require('../assets/images/google.png')}
              onPress={() => handleSocialLogin('Google')}
            />
          </View>
        </>
      ) : (  // 로그인 상태일 때의 UI
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#EEE8F4', // 로그인 버튼 배경 색
    paddingVertical: 15, // 로그인 버튼의 세로 패딩
    paddingHorizontal: 20, // 로그인 버튼의 가로 패딩
    borderRadius: 10, // 로그인 버튼의 모서리 둥글기
    marginTop: 20, // 로그인 버튼 상단 여백
    width: '100%', // 로그인 버튼 너비
    alignItems: 'center', // 로그인 버튼 내 텍스트 중앙 정렬
  },
  loginButtonText: {
    color: '#4E348B', // 로그인 버튼 텍스트 색
    fontSize: 18, // 로그인 버튼 텍스트 크기
  },
  signupButton: {
    position: 'absolute', // 회원가입 버튼을 절대 위치로 설정
    right: 10, // 오른쪽에서 10의 위치
    top: 10, // 상단에서 10의 위치
    padding: 10, // 패딩
  },
  signupButtonText: {
    color: '#4E348B', // 회원가입 버튼 텍스트 색
    fontSize: 16, // 회원가입 버튼 텍스트 크기
  },
  profileButton: {
    // 프로필 수정 버튼 스타일 (필요에 따라 조정)
  },
  logoutButton: {
    // 로그아웃 버튼 스타일 (필요에 따라 조정)
  },
  socialLoginContainer: {
    flexDirection: 'row', // 방향 수정
    marginTop: 20,
    alignItems: 'center', // 가운데 정렬로 수정
    justifyContent: 'space-evenly',
    width: '78%',
  },
});

export default SettingScreen;
