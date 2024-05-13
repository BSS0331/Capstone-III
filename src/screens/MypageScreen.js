import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dimensions를 사용해 현재 윈도우의 너비를 가져옴
const { width } = Dimensions.get('window');

const MypageScreen = () => {
  
  // 네비게이션 훅을 사용하여 앱 내의 네비게이션 기능 접근
  const navigation = useNavigation();

  // 버튼이 눌렸을 때의 동작을 정의하는 함수
  const handlePress = (btnName) => console.log(`${btnName} pressed`); // 콘솔에 어떤 버튼이 눌렸는지 출력

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <TouchableOpacity  // 첫 번째 터치 가능 버튼: '설정' 이동
          style={styles.button}
          onPress={() => navigation.navigate('SettingStack')}>
          <Text style={styles.buttonText}>설정</Text>
        </TouchableOpacity>

        <TouchableOpacity  // 두 번째 터치 가능 버튼
          style={styles.button}
          onPress={() => handlePress('Button 2')}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>

        <TouchableOpacity  // 세 번째 터치 가능 버튼
          style={styles.button}
          onPress={() => handlePress('Button 3')}>
          <Text style={styles.buttonText}>Button 3</Text>
        </TouchableOpacity>
        
        <TouchableOpacity  // 네 번째 터치 가능 버튼
          style={styles.button}
          onPress={() => handlePress('Button 4')}>
          <Text style={styles.buttonText}>Button 4</Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF', // 버튼 배경색 설정
    width: width, // 화면 너비와 같은 너비 설정
    padding: 10, // 내부 패딩 설정
    borderColor: '#000000', // 테두리 색상 설정
    borderWidth: 0.3, // 테두리 두께 설정
  },
  buttonText: {
    fontSize: 24, // 텍스트 크기 설정
  },
});

export default MypageScreen;
