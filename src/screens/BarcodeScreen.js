import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const BarcodeScreen = ({ navigation }) => {
  useFocusEffect(  // useFocusEffect 훅을 사용하여 화면이 포커스를 받을 때 실행될 콜백 함수를 등록
    useCallback(() => {
      const parent = navigation.getParent(); // 바텀 탭 네비게이터(상위)를 가져옴

      // 화면이 포커스를 받으면 탭 바와 헤더를 숨김
      parent.setOptions({
        tabBarStyle: { display: 'none' }, // 탭 바 숨기기
        headerShown: false,               // 헤더 숨기기
      });

      // 화면에서 벗어날 때 탭 바를 다시 표시
      return () => parent.setOptions({
        tabBarStyle: undefined, // 탭 바 다시 표시
      });
    }, [navigation])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>바코드 입력 화면</Text>
    </View>
  );
};

export default BarcodeScreen;
