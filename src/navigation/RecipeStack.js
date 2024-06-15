import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import RecipesScreen from '../screens/RecipesScreen';
import SearchScreen from '../screens/SearchScreen';
import TagsScreen from '../screens/TagsScreen';
import RecipesListScreen from '../screens/RecipesListScreen';
import FridgeScreen from '../screens/FridgeScreen';

// Stack Navigator를 생성합니다.
const Stack = createStackNavigator();

const RecipesStack = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        // 화면에 포커스가 있을 때 탭 바를 숨깁니다.
        parent.setOptions({
          tabBarStyle: { display: 'none' },
          headerShown: true,
        });

        // 네비게이터 정리 시 탭 바를 복구합니다.
        return () => parent.setOptions({
          tabBarStyle: undefined,
          headerShown: false,
        });
      }
    }, [navigation])
  );

  return (
    <Stack.Navigator>
      {/* RecipeScreen을 설정, 헤더를 숨깁니다. */}
      <Stack.Screen 
        name="RecipesHome" 
        component={RecipesScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* SearchScreen을 설정, 헤더를 숨깁니다. */}
      <Stack.Screen 
        name="SearchScreen" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* RecipeDetailScreen을 설정, 헤더를 보이고 제목을 '조리방법'으로 설정합니다. */}
      <Stack.Screen 
        name="RecipeDetailScreen" 
        component={RecipeDetailScreen} 
        options={{ headerShown: true, title: '조리방법' }} 
      />
      
      {/* TagsScreen을 설정, 제목을 '태그 검색'으로 설정합니다. */}
      <Stack.Screen 
        name="TagsScreen" 
        component={TagsScreen} 
        options={{ title: '태그 검색' }} 
      />
      
      {/* RecipesListScreen을 설정, 헤더를 보이고 제목을 '요리 리스트'로 설정합니다. */}
      <Stack.Screen 
        name="RecipesListScreen" 
        component={RecipesListScreen} 
        options={{ title: '요리 리스트', headerShown: true }} 
      />
      
      {/* FridgeScreen을 설정, 헤더를 보이고 제목을 '내 냉장고'로 설정합니다. */}
      <Stack.Screen 
        name="FridgeScreen" 
        component={FridgeScreen} 
        options={{ title: '내 냉장고', headerShown: true }} 
      />
    </Stack.Navigator>
  );
};

export default RecipesStack;