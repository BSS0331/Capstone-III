import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { API } from '@env';
console.log('API:', API); // URL 확인을 위한 로그

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');  // 성공 메시지 상태 추가

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    if (!name) {
      newErrors.name = "사용할 닉네임을 입력해 주세요.";
      isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    console.log('가입하기 버튼 클릭됨');  // 버튼 클릭 로그 추가
    if (validateInput()) {
      try {
        console.log('유효성 검사 통과');
        console.log('API 요청 보냄: ', `${API}/accounts/signup/`);  // 요청 URL 로그
        const response = await fetch(`${API}/accounts/signup/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: name,
            email: email,
            password: password,
          }),
        });
        console.log('API 요청 보냄: ', `${API}/accounts/signup/`);  // 요청 URL 로그
        const data = await response.json();
        console.log('API 응답 받음: ', data);  // 응답 로그
        if (response.status === 201) {
          console.log('가입 성공');  // 가입 성공 로그 추가
          setSuccessMessage('로그인 성공');
          // navigation.navigate('LoginScreen');
        } else {
          console.log('가입 실패: ', data.message);  // 가입 실패 로그 추가
          setErrors({ general: data.message });
        }
      } catch (error) {
        console.log('가입 요청 중 오류 발생: ', error);  // 오류 발생 로그 추가
        setErrors({ general: 'An error occurred. Please try again.' });
      } 
    } else {
      console.log('유효성 검사 실패');  // 유효성 검사 실패 로그 추가
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="닉네임"
        value={name}
        onChangeText={text => { setName(text); setErrors(prev => ({ ...prev, name: null })); }}
        style={styles.input}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={text => { setEmail(text); setErrors(prev => ({ ...prev, email: null })); }}
        style={styles.input}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={text => { setPassword(text); setErrors(prev => ({ ...prev, password: null })); }}
        style={styles.input}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={text => { setConfirmPassword(text); setErrors(prev => ({ ...prev, confirmPassword: null })); }}
        style={styles.input}
        secureTextEntry
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>
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
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    width: '100%',
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  successText: {  // 성공 메시지 스타일
    width: '100%',
    color: 'green',
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#EEE8F4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4E348B',
  }
});

export default SignUpScreen;
