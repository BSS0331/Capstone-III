import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';      // 스택 네비게이터 생성 함수를 불러옴

import SettingStack from './SettingStack';                           // 로컬 SettingStack 컴포넌트를 불러옴
import MypageScreen from '../screens/MypageScreen';



const Stack = createStackNavigator();  // 스택 네비게이터 생성

const MypageStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MypageScreen"
      component={MypageScreen}
      />
      <Stack.Screen name="SettingStack"
      component={SettingStack}
      />
    </Stack.Navigator>
  );
};

export default MypageStack