import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './frontend/src/Src/Navigation/AppNavigator';

function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

// Registrar apenas se não for web
if (Platform.OS !== 'web') {
  AppRegistry.registerComponent('main', () => App);
}

export default App;