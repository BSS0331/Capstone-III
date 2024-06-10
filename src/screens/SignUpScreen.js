import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { API } from '@env';

// API URL을 확인하기 위한 콘솔 로그
console.log('API:', API);

const SignUpScreen = ({ navigation }) => {
  // 상태 변수들 선언
  const [name, setName] = useState(''); // 닉네임 상태
  const [emailLocalPart, setEmailLocalPart] = useState(''); // 이메일의 로컬 파트 상태
  const [emailDomain, setEmailDomain] = useState(null); // 이메일 도메인 상태
  const [customDomain, setCustomDomain] = useState(''); // 사용자 정의 도메인 상태
  const [showCustomDomainInput, setShowCustomDomainInput] = useState(false); // 사용자 정의 도메인 입력 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태
  const [errors, setErrors] = useState({}); // 오류 메시지 상태
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지 상태
  const [open, setOpen] = useState(false); // DropDownPicker 열림 상태
  const [items, setItems] = useState([ // DropDownPicker 아이템들
    { label: 'hanmail.net', value: 'hanmail.net' },
    { label: 'daum.net', value: 'daum.net' },
    { label: 'naver.com', value: 'naver.com' },
    { label: 'gmail.com', value: 'gmail.com' },
    { label: '직접 입력', value: 'custom' }
  ]);

  // 입력 유효성 검사를 수행하는 함수
  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    // 닉네임 유효성 검사
    if (!name) {
      newErrors.name = "사용할 닉네임을 입력해 주세요.";
      isValid = false;
    }

    // 이메일 유효성 검사
    const email = `${emailLocalPart}@${emailDomain || customDomain}`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
      isValid = false;
    }

    // 비밀번호 유효성 검사
    if (!password) {
      newErrors.password = "사용할 비밀번호를 입력해 주세요.";
      isValid = false;
    } else if (/[^a-zA-Z0-9]/.test(password)) {
      newErrors.password = "비밀번호에는 특수 문자를 포함할 수 없습니다.";
      isValid = false;
    }

    // 비밀번호 확인 유효성 검사
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    // 오류 상태 업데이트
    setErrors(newErrors);
    return isValid;
  };

  // 회원가입을 처리하는 함수
  const handleSubmit = async () => {
    console.log('가입하기 버튼 클릭됨'); // 버튼 클릭 로그 추가
    if (validateInput()) { // 입력 유효성 검사 통과 여부 확인
      try {
        console.log('유효성 검사 통과');
        console.log('API 요청 보냄: ', `${API}/accounts/signup/`); // API 요청 로그

        // 회원가입 API 요청
        const response = await fetch(`${API}/accounts/signup/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: name,
            email: `${emailLocalPart}@${emailDomain || customDomain}`,
            password: password,
          }),
        });

        // API 응답 처리
        const data = await response.json();
        console.log('API 응답 받음: ', data); // 응답 로그

        if (response.status === 201) {
          console.log('가입 성공'); // 가입 성공 로그 추가
          setSuccessMessage('가입 성공! 설정 화면으로 이동합니다.');
          navigation.navigate('Setting'); // 설정 화면으로 이동
        } else if (response.status === 400 && data.email) {
          // 이메일 중복 오류 처리
          console.log('가입 실패: 이메일 중복'); // 이메일 중복 로그 추가
          setErrors(prevErrors => ({ ...prevErrors, email: "사용 중인 이메일입니다." }));
        } else {
          // 기타 오류 처리
          console.log('가입 실패: ', data.message); // 기타 가입 실패 로그 추가
          setErrors({ general: data.message });
        }
      } catch (error) {
        console.log('가입 요청 중 오류 발생: ', error); // 오류 발생 로그 추가
        setErrors({ general: 'An error occurred. Please try again.' });
      } 
    } else {
      console.log('유효성 검사 실패'); // 유효성 검사 실패 로그 추가
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="닉네임"
        value={name}
        onChangeText={text => { setName(text); setErrors(prev => ({ ...prev, name: null })); }} // 닉네임 입력 처리
        style={styles.input}
      />
      {/* 닉네임 오류 메시지 표시 */}
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <View style={styles.emailContainer}>
        <TextInput
          placeholder="이메일"
          value={emailLocalPart}
          onChangeText={text => { setEmailLocalPart(text); setErrors(prev => ({ ...prev, email: null })); }} // 이메일 로컬 파트 입력 처리
          style={[styles.input, showCustomDomainInput ? styles.emailInputWithCustom : styles.emailInput]}
        />
        <Text style={styles.atSymbol}>@</Text>
        {showCustomDomainInput ? (
          <>
            <TextInput
              placeholder="직접 입력"
              value={customDomain}
              onChangeText={text => { setCustomDomain(text); setErrors(prev => ({ ...prev, email: null })); }} // 사용자 정의 도메인 입력 처리
              style={[styles.input, styles.selfInput]}
            />
            <TouchableOpacity onPress={() => setShowCustomDomainInput(false)} style={styles.switchButton}>
              <Text style={styles.switchButtonText}>도메인 선택</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
          <DropDownPicker
              open={open}
              value={emailDomain}
              items={items}
              setOpen={setOpen}
              setValue={setEmailDomain}
              setItems={setItems}
              style={styles.picker}
              placeholder="도메인 선택"
              onChangeValue={(itemValue) => {
                setEmailDomain(itemValue);
                setCustomDomain('');
                setErrors(prev => ({ ...prev, email: null }));
                if (itemValue === 'custom') {
                  setShowCustomDomainInput(true);
                }
              }}
            />
          </>
        )}
      </View>
      {/* 이메일 오류 메시지 표시 */}
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={text => { setPassword(text); setErrors(prev => ({ ...prev, password: null })); }} // 비밀번호 입력 처리
        style={styles.input}
        secureTextEntry
      />
      {/* 비밀번호 오류 메시지 표시 */}
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={text => { setConfirmPassword(text); setErrors(prev => ({ ...prev, confirmPassword: null })); }} // 비밀번호 확인 입력 처리
        style={styles.input}
        secureTextEntry
      />
      {/* 비밀번호 확인 오류 메시지 표시 */}
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {/* 가입하기 버튼 */}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>

      {/* 성공 메시지 표시 */}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      {/* 일반 오류 메시지 표시 */}
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  emailInput: {
    width: '50%',
  },
  emailInputWithCustom: {
    width: '30%',
  },
  selfInput: {
    width: '34%',
  },
  switchButton: {
    backgroundColor: '#EEE8F4',
    padding: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  atSymbol: {
    marginHorizontal: 5,
    fontSize: 16,
  },
  picker: {
    flex: 2,
    height: 50,
    marginVertical: 8,
    width: '43%'
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
  successText: { // 성공 메시지 스타일
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
