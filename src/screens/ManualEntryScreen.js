import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import DropDownPicker from 'react-native-dropdown-picker';

const ManualEntryScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();

      parent.setOptions({
        tabBarStyle: { display: 'none' },
        headerShown: false,
      });

      return () => parent.setOptions({
        tabBarStyle: undefined,
      });
    }, [navigation])
  );

  const [foodName, setFoodName] = useState(''); // 음식 이름 상태
  const [category, setCategory] = useState(null); // 카테고리 상태
  const [quantity, setQuantity] = useState(''); // 수량 상태
  const [purchaseDate, setPurchaseDate] = useState(new Date()); // 구매 날짜 상태
  const [expirationDate, setExpirationDate] = useState(new Date()); // 유통기한 상태
  const [storageCondition, setStorageCondition] = useState(null); // 보관 조건 상태
  const [notes, setNotes] = useState(''); // 메모 상태
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false); // 구매 날짜 선택기 상태
  const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false); // 유통기한 선택기 상태
  const [openCategory, setOpenCategory] = useState(false); // 카테고리 드롭다운 상태
  const [openStorage, setOpenStorage] = useState(false); // 보관 조건 드롭다운 상태
  const [categoryItems, setCategoryItems] = useState([ // 카테고리 드롭다운 항목들
    { label: '과일', value: '과일' },
    { label: '채소', value: '채소' },
    { label: '유제품 및 우유', value: '유제품 및 우유' },
    { label: '육류 및 계란', value: '육류 및 계란' },
    { label: '가공식품', value: '가공식품' }
  ]);
  const [storageItems, setStorageItems] = useState([ // 보관 조건 드롭다운 항목들
    { label: '냉장', value: '냉장' },
    { label: '냉동', value: '냉동' },
    { label: '상온', value: '상온' }
  ]);

  // 날짜 변경 핸들러
  const onChangePurchaseDate = (event, selectedDate) => {
    setShowPurchaseDatePicker(false);
    if (selectedDate !== undefined) {
      setPurchaseDate(selectedDate);
    }
  };

  const onChangeExpirationDate = (event, selectedDate) => {
    setShowExpirationDatePicker(false);
    if (selectedDate !== undefined) {
      setExpirationDate(selectedDate);
    }
  };

  // 확인 버튼 클릭 시 실행될 함수
  const handleConfirm = async () => {
    if (!foodName || !quantity || !storageCondition) { // 필수 입력 필드 확인
      Alert.alert('오류', '음식 이름, 수량, 보관 조건은 필수 입력 필드입니다.');
      return;
    }

    const foodData = {
      food_name: foodName, // 음식 이름
      category: category, // 카테고리
      quantity: parseInt(quantity), // 수량 (정수형 변환)
      purchase_date: format(purchaseDate, 'yyyy-MM-dd'), // 구매 날짜 포맷
      expiration_date: format(expirationDate, 'yyyy-MM-dd'), // 유통기한 포맷
      storage_condition: storageCondition, // 보관 조건
      notes: notes // 메모
    };

    try {
      const token = await AsyncStorage.getItem('accessToken'); // 저장된 인증 토큰 가져오기
      console.log('accessToken:', token); // 토큰 값 확인 로그
      if (!token) {
        Alert.alert('오류', '인증 토큰이 없습니다. 로그인 후 다시 시도하십시오.');
        return;
      }

      const response = await fetch(`${API}/food/`, { // API 요청 보내기
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON 형식의 데이터를 보냄
          'Authorization': `Bearer ${token}`, // 인증 토큰을 헤더에 포함
        },
        body: JSON.stringify(foodData), // 음식 데이터를 JSON 문자열로 변환하여 보냄
      });

      if (response.ok) {
        await AsyncStorage.setItem('foodData', JSON.stringify(foodData)); // 입력 데이터를 AsyncStorage에 저장
        Alert.alert('확인', '데이터가 저장되었습니다.'); // 데이터 저장 성공 알림

        // 입력 필드 초기화
        setFoodName('');
        setCategory(null);
        setQuantity('');
        setPurchaseDate(new Date());
        setExpirationDate(new Date());
        setStorageCondition(null);
        setNotes('');

      } else {
        const errorData = await response.json();
        console.error('데이터 저장 중 오류 발생: ', errorData); // 에러 콘솔 출력
        Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.'); // 데이터 저장 실패 알림
      }
    } catch (error) {
      console.error('데이터 저장 중 오류 발생: ', error); // 에러 콘솔 출력
      Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.'); // 데이터 저장 실패 알림
    }
  };

  // 취소 버튼 클릭 시 실행될 함수
  const handleCancel = () => {
    setFoodName(''); // 음식 이름 초기화
    setCategory(null); // 카테고리 초기화
    setQuantity(''); // 수량 초기화
    setPurchaseDate(new Date()); // 구매 날짜 초기화
    setExpirationDate(new Date()); // 유통기한 초기화
    setStorageCondition(null); // 보관 조건 초기화
    setNotes(''); // 메모 초기화
    navigation.goBack(); // 이전 화면으로 이동
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={!openCategory && !openStorage}>
        <Text style={styles.label}>음식 이름 <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="음식 이름"
          value={foodName}
          onChangeText={setFoodName}
        />
        <Text style={styles.label}>카테고리</Text>
        <DropDownPicker
          open={openCategory}
          value={category}
          items={categoryItems}
          setOpen={setOpenCategory}
          setValue={setCategory}
          setItems={setCategoryItems}
          placeholder="카테고리 선택"
          style={styles.input}
          dropDownContainerStyle={{ backgroundColor: '#fff' }}
          onOpen={() => setOpenStorage(false)}
        />
        <Text style={styles.label}>수량 <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="수량"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <Text style={styles.label}>구매 날짜</Text>
        <TouchableOpacity onPress={() => setShowPurchaseDatePicker(true)}>
          <TextInput
            style={[styles.input, styles.dateInput]}
            placeholder="구매 날짜"
            value={format(purchaseDate, 'yyyy-MM-dd')}
            editable={false}
          />
        </TouchableOpacity>
        {showPurchaseDatePicker && (
          <DateTimePicker
            value={purchaseDate}
            mode="date"
            // display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangePurchaseDate}
          />
        )}
        <Text style={styles.label}>유통기한</Text>
        <TouchableOpacity onPress={() => setShowExpirationDatePicker(true)}>
          <TextInput
            style={[styles.input, styles.dateInput]}
            placeholder="유통기한"
            value={format(expirationDate, 'yyyy-MM-dd')}
            editable={false}
          />
        </TouchableOpacity>
        {showExpirationDatePicker && (
          <DateTimePicker
            value={expirationDate}
            mode="date"
            // display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeExpirationDate}
          />
        )}
        <Text style={styles.label}>보관 조건 <Text style={styles.required}>*</Text></Text>
        <DropDownPicker
          open={openStorage}
          value={storageCondition}
          items={storageItems}
          setOpen={setOpenStorage}
          setValue={setStorageCondition}
          setItems={setStorageItems}
          placeholder="보관 조건 선택"
          style={styles.input}
          dropDownContainerStyle={{ backgroundColor: '#fff' }}
          onOpen={() => setOpenCategory(false)}
        />
        <Text style={styles.label}>메모</Text>
        <TextInput
          style={styles.input}
          placeholder="메모"
          value={notes}
          onChangeText={setNotes}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>취소</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // 컨테이너가 가득 차도록 설정
    padding: 20, // 패딩 20 설정
    justifyContent: 'center', // 중앙 정렬
    backgroundColor: '#fff', // 배경 흰색 설정
  },
  label: {
    fontSize: 16, // 글씨 크기 16 설정
    marginBottom: 8, // 아래 여백 8 설정
    color: '#333', // 글씨 색상 설정
  },
  required: {
    color: 'red', // 필수 입력 표시 빨간색 설정
  },
  input: {
    height: 40, // 높이 40 설정
    borderColor: '#ccc', // 테두리 색상 설정
    borderWidth: 1, // 테두리 두께 1 설정
    marginBottom: 20, // 아래 여백 20 설정
    paddingHorizontal: 10, // 수평 패딩 10 설정
    borderRadius: 5, // 모서리 둥글게 설정
  },
  dateInput: {
    color: '#000', // 검정색 글씨로 보이도록 설정
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼들을 가로로 배치
    justifyContent: 'space-between', // 버튼들 사이에 공간을 균등하게 배분
  },
  button: {
    flex: 1, // 버튼이 가로로 균등하게 차지하도록 설정
    backgroundColor: '#4CAF50', // 배경 색상 설정
    padding: 10, // 패딩 10 설정
    margin: 5, // 여백 5 설정
    alignItems: 'center', // 중앙 정렬
    borderRadius: 5, // 모서리 둥글게 설정
  },
  buttonText: {
    color: '#fff', // 글씨 색상 설정
    fontSize: 16, // 글씨 크기 16 설정
  },
  cancelButton: {
    backgroundColor: '#f44336', // 배경 색상 설정
  },
  cancelButtonText: {
    color: '#fff', // 글씨 색상 설정
  },
});

export default ManualEntryScreen;