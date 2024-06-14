import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const FridgeScreen = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        headerShown: false,
      });

      return () => parent.setOptions({
        tabBarStyle: { display: 'flex' },
        headerShown: false,
      });
    }, [navigation])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>냉장고 화면</Text>
    </View>
  );
};

export default FridgeScreen;
