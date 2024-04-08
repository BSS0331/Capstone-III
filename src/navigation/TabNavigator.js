import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStack from './HomeStack';
import FridgeScreen from '../screens/FridgeScreen';
import MypageScreen from '../screens/MypageScreen';
import RecipesScreen from './RecipeStack';

const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recipes') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Fridge') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: '메인메뉴', headerShown: false }} />
      <Tab.Screen name="Recipes" component={RecipesScreen} options={{ title: '레시피',headerShown: false}} />
      <Tab.Screen name="Fridge" component={FridgeScreen} options={{ title: '냉장고' }} />
      <Tab.Screen name="Mypage" component={MypageScreen} options={{ headerShown: false}}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;