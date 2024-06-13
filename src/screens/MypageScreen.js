import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리 임포트
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트

// Dimensions를 사용해 현재 윈도우의 너비를 가져옴
const { width } = Dimensions.get('window');

const MypageScreen = () => {
  // 네비게이션 훅을 사용하여 앱 내의 네비게이션 기능 접근
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태 변수

  // 로그인 상태를 확인하는 함수
  const checkLogin = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error('로그인 상태 확인 중 오류 발생: ', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, [])
  );

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      console.log('로그아웃 성공');
    } catch (e) {
      console.error('로그아웃 중 오류 발생: ', e);
    }
  };

  // 버튼이 눌렸을 때의 동작을 정의하는 함수
  const handlePress = (btnName) => console.log(`${btnName} pressed`); // 콘솔에 어떤 버튼이 눌렸는지 출력

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <TouchableOpacity  // 첫 번째 터치 가능 버튼: '알림' 이동
          style={styles.button}
          onPress={() => handlePress('Notification')}>
          <Icon name="notifications-outline" size={24} style={styles.icon} />
          <Text style={styles.buttonText}>알림</Text>
        </TouchableOpacity>

        <TouchableOpacity  // 두 번째 터치 가능 버튼: '문의하기' 이동
          style={styles.button}
          onPress={() => handlePress('Inquiry')}>
          <Icon name="chatbox-ellipses-outline" size={24} style={styles.icon} />
          <Text style={styles.buttonText}>문의하기</Text>
        </TouchableOpacity>

        {isLoggedIn ? (
          <TouchableOpacity  // 로그인된 경우 로그아웃 버튼
            style={styles.button}
            onPress={handleLogout}>
            <Icon name="log-out-outline" size={24} style={styles.icon} />
            <Text style={styles.buttonText}>로그아웃</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity  // 로그인되지 않은 경우 로그인 버튼
            style={styles.button}
            onPress={() => navigation.navigate('SettingStack')}>
            <Icon name="log-in-outline" size={24} style={styles.icon} />
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );  
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // 플랫폼별 상단 여백 설정
    backgroundColor: '#FFFFFF', // 배경 색상 설정
  },
  container: {
    flex: 1,
    alignItems: 'center', // 요소들을 중앙에 배치
  },
  button: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배치
    alignItems: 'center', // 세로축 중앙 정렬
    backgroundColor: '#FFFFFF', // 버튼 배경색 설정
    width: width, // 화면 너비와 같은 너비 설정
    padding: 10, // 내부 패딩 설정
    borderColor: '#000000', // 테두리 색상 설정
    borderWidth: 0.3, // 테두리 두께 설정
  },
  icon: {
    marginRight: 10, // 아이콘과 텍스트 사이의 간격 설정
  },
  buttonText: {
    fontSize: 24, // 텍스트 크기 설정
  },
});

export default MypageScreen;