import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@env';
import { WebView } from 'react-native-webview';

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
  const [socialLoginUrl, setSocialLoginUrl] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const [socialType, setSocialType] = useState('');
  const [loading, setLoading] = useState(true); // 웹뷰 로드 상태 확인을 위한 상태

  const checkLogin = async () => {
    try {
      console.log('로그인 상태 확인 중...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('accessToken:', accessToken); // 토큰 값 확인 로그
      if (accessToken) {
        setIsLoggedIn(true);
        console.log('로그인 상태입니다.');
      } else {
        console.log('로그인 상태가 아닙니다.');
      }
    } catch (e) {
      console.error('로그인 상태 확인 중 오류 발생: ', e);
      console.error('로그인 상태 확인 중 오류 발생: ', e);
    }
  };

  const handleLogin = async () => {
    console.log('로그인 버튼 클릭됨');
    try {
      const response = await fetch(`${API}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: id,
          password: password,
        }),
      });
      console.log('API 요청 보냄: ', `${API}/accounts/login/`);
      const data = await response.json();
      console.log('API 응답 받음: ', data);
      if (response.status === 200) {
        await AsyncStorage.setItem('accessToken', data.access); // accessToken 저장
        await AsyncStorage.setItem('refreshToken', data.refresh); // refreshToken 저장
        console.log('accessToken 저장:', data.access); // 토큰 저장 확인 로그
        console.log('refreshToken 저장:', data.refresh); // 토큰 저장 확인 로그
        setIsLoggedIn(true);
        console.log('로그인 성공');
        navigation.navigate('MypageScreen'); // 로그인 성공 시 MypageScreen으로 이동
      } else {
        console.log('로그인 실패: ', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생: ', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSocialLogin = (socialType) => {
    console.log(`${socialType} 로그인 실행`);
    const loginUrl = `${API}/accounts/${socialType.toLowerCase()}/login/`;
    setSocialType(socialType);
    setSocialLoginUrl(loginUrl);
    setShowWebView(true);
    setLoading(true); // 웹뷰 로드 상태 초기화
  };

  const handleWebViewNavigationStateChange = async (navState) => {
    const { url } = navState;
    console.log('WebView Navigation State Change: ', url);

    if (url.includes('/callback') && !navState.loading) {
      setLoading(true);
      const code = new URL(url).searchParams.get('code');
      const state = new URL(url).searchParams.get('state');
      const tokenUrl = `${API}/accounts/${socialType.toLowerCase()}/callback/?code=${code}&state=${state}`;

      try {
        const response = await fetch(tokenUrl, {
          method: 'GET',
        });
        const data = await response.json();
        console.log(`${socialType} 콜백 응답 받음: `, data);
        if (response.status === 200 && data.access_token) {
          await AsyncStorage.setItem('accessToken', data.access); // accessToken 저장
          await AsyncStorage.setItem('refreshToken', data.refresh); // refreshToken 저장
          console.log('accessToken 저장:', data.access); // 토큰 저장 확인 로그
          console.log('refreshToken 저장:', data.refresh); // 토큰 저장 확인 로그
          setIsLoggedIn(true);
          console.log(`${socialType}User 로그인 성공`);
        } else {
          console.log(`${socialType} 로그인 실패: `, data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error(`${socialType} 로그인 요청 중 오류 발생: `, error);
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false);
        setShowWebView(false);
      }
    }
  };


  return (
    <View style={styles.container}>
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


      <Modal visible={showWebView} transparent={true} animationType="slide">
        <View style={styles.webViewContainer}>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }}
            />
          )}
          <WebView
            source={{ uri: socialLoginUrl }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onLoadEnd={() => setLoading(false)} // 로드 완료 시 로딩 상태 해제
            startInLoadingState
            scalesPageToFit
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWebView(false)}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    backgroundColor: '#EEE8F4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#4E348B',
    fontSize: 18,
  },
  signupButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
  },
  signupButtonText: {
    color: '#4E348B',
    fontSize: 16,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '78%',
  },
  loggedInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  editProfileButton: {
    backgroundColor: '#EEE8F4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#4E348B',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#EEE8F4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#4E348B',
    fontSize: 18,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default SettingScreen;
