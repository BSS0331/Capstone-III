import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './src/navigation/TabNavigator';  // 로컬 TabNavigator 컴포넌트를 불러옴

const App = () => {
  return ( 
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default App;
