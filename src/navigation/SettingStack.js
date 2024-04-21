import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import SettingScreen from '../screens/SettingScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const SettingStack = () => {
  const navigation = useNavigation(); // useNavigation 훅으로 navigation 객체 가져오기

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) { // parent가 존재하는지 확인
        parent.setOptions({
          tabBarStyle: { display: 'none' },
          headerShown: false,
        });

        return () => parent.setOptions({
          tabBarStyle: undefined,
          headerShown: true,
        });
      }
    }, [navigation]) // 의존성 배열에 navigation 추가
  );
  return (
    <Stack.Navigator>
      <Stack.Screen name="Setting" component={SettingScreen} options={{ title: '설정' }}/>
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: true, title: '회원가입' }}/>
    </Stack.Navigator>
  );
};

export default SettingStack;
