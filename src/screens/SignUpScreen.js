import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// SignUpScreen 컴포넌트: 사용자 등록 입력 및 유효성 검사 관리
const SignUpScreen = () => {
  // 폼 입력값과 에러 메시지 관리를 위한 상태 설정
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // 제출 전 입력값 유효성 검사
  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    // 각 입력 필드에 대한 검증 규칙
    if (!name) {
      newErrors.general = "사용할 닉네임을 입력해 주세요.";
      isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) {
      newErrors.userId = "올바른 이메일 형식이 아닙니다.";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "사용할 비밀번호를 입력해 주세요.";
      isValid = false;
    } else if (/[^a-zA-Z0-9]/.test(password)) {
      newErrors.password = "비밀번호에는 특수 문자를 포함할 수 없습니다.";
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }
    
    setErrors(newErrors); // 새로운 에러로 에러 상태 업데이트
    return isValid; // 유효성 검사 결과 반환
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    if (validateInput()) {
      // 회원가입 성공 처리 로직 (예: API 호출)
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="닉네임"
        value={name}
        onChangeText={text => { setName(text); setErrors(prev => ({ ...prev, general: null })); }}
        style={styles.input}
      />
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
      <TextInput 
        placeholder="이메일"
        value={userId}
        onChangeText={text => { setUserId(text); setErrors(prev => ({ ...prev, userId: null })); }}
        style={styles.input}
      />
      {errors.userId && <Text style={styles.errorText}>{errors.userId}</Text>}
      <TextInput 
        placeholder="비밀번호"
        value={password}
        onChangeText={text => { setPassword(text); setErrors(prev => ({ ...prev, password: null })); }}
        style={styles.input}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TextInput 
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={text => { setConfirmPassword(text); setErrors(prev => ({ ...prev, confirmPassword: null })); }}
        style={styles.input}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>
    </View>
  );
};

// 컴포넌트 스타일 시트: UI 요소의 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1, // 가능한 모든 공간을 차지
    justifyContent: 'center', // 자식 요소를 수직 방향 중앙에 배치
    alignItems: 'center', // 자식 요소를 수평 방향 중앙에 배치
    padding: 20, // 컨테이너의 모든 측면에 20의 패딩 적용
  },
  input: {
    width: '100%', // 컨테이너의 전체 너비 사용
    marginVertical: 8, // 입력 필드 간 수직 마진
    borderWidth: 1, // 테두리 두께
    borderColor: '#ccc', // 테두리 색상
    padding: 10, // 입력 필드 내부 패딩
    borderRadius: 5, // 입력 필드 모서리 둥글기
  },
  errorText: {
    width: '100%', // 에러 텍스트는 입력 필드의 전체 너비를 차지
    color: 'red', // 에러 메시지의 색상
    fontSize: 12, // 에러 메시지의 폰트 크기
    marginBottom: 5, // 에러 텍스트 아래 여백
  },
  button: {
    marginTop: 20, // 버튼 위 여백
    backgroundColor: '#EEE8F4', // 버튼의 배경 색상
    padding: 15, // 버튼 내부 패딩
    borderRadius: 5, // 버튼 모서리 둥글기
    alignItems: 'center', // 버튼 내 텍스트 수평 중앙 정렬
  },
  buttonText: {
    color: '#4E348B', // 버튼 텍스트 색상
  }
});

export default SignUpScreen;
