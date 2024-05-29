import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';      // 스택 네비게이터 생성 함수를 불러옴

import HomeScreen from '../screens/HomeScreen';                      // 로컬 HomeScreen 컴포넌트를 불러옴
import ManualEntryScreen from '../screens/ManualEntryScreen';        // 로컬 ManualEntryScreen 컴포넌트를 불러옴
import BarcodeScreen from '../screens/BarcodeScreen';                // 로컬 BarcodeScreen 컴포넌트를 불러옴
import ReceiptCaptureScreen from '../screens/ReceiptCaptureScreen';  // 로컬 ReceiptCaptureScreen 컴포넌트를 불러옴
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();  // 스택 네비게이터 생성

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeStack"
      component={HomeScreen}
      options={{ title: '메인메뉴', headerShown: false }}
      />
      <Stack.Screen name="ManualEntry"
      component={ManualEntryScreen}
      options={{ title: '수동 입력' }}
      />
      <Stack.Screen name="Barcode"
      component={BarcodeScreen}
      options={{ title: '바코드' }}
      />
      <Stack.Screen name="ReceiptCapture"
      component={ReceiptCaptureScreen}
      options={{ title: '영수증' }}
      />
      <Stack.Screen name="SearchScreen" 
      component={SearchScreen} 
      options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;