import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});


  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

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
    } else if (password.length < 8) {
       newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
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
  button: {
    marginTop: 20,
    backgroundColor: '#EEE8F4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#4E348B',
  }
});

export default SignUpScreen;
