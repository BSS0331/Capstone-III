import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import RecipesScreen from '../screens/RecipesScreen';
import SearchScreen from '../screens/SearchScreen';
import TagsScreen from '../screens/TagsScreen';
import RecipesListScreen from '../screens/RecipesListScreen';
import FridgeScreen from '../screens/FridgeScreen';

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
        
        return () => parent.setOptions ({
          // 네비게이터 정리 시 탭 바를 복구합니다.
            tabBarStyle: undefined,
            headerShown: false,
        });
        
      }
    }, [navigation])
  );

  return (
    <Stack.Navigator>
      <Stack.Screen name="RecipesHome" 
      component={RecipesScreen} 
      options={{ headerShown: false }} />
      <Stack.Screen name="SearchScreen" 
      component={SearchScreen} 
      options={{ headerShown: false }} />
      <Stack.Screen name="RecipeDetailScreen" 
      component={RecipeDetailScreen} 
      options={{ headerShown: true, title: '조리방법' }} />
      <Stack.Screen name="TagsScreen" 
      component={TagsScreen} 
      options={{ title: '태그 검색' }} />
      <Stack.Screen name="RecipesListScreen" 
      component={RecipesListScreen} 
      options={{ title: '요리 리스트', headerShown: true }} />
      <Stack.Screen name="FridgeScreen" 
      component={FridgeScreen} 
      options={{ title: '내 냉장고', headerShown: true }} />
    </Stack.Navigator>
  );
};

export default RecipesStack;
