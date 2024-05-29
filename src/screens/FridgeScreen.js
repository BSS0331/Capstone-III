import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FridgeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>냉장고 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FridgeScreen;