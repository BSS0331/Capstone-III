import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import RecipesScreen from '../screens/RecipesScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

const RecipesStack = () => {
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
      <Stack.Screen name="Recipes" component={RecipesScreen}options={{headerShown: false}} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: '검색' }} />
    </Stack.Navigator>
  );
};

export default RecipesStack;