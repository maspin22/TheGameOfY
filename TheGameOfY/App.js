import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FrontPage from './pages/FrontPage';
import GameLobby from './pages/GameLobby';
import YGame from './gameComponents/YGame';
import YGameLocal from './gameComponents/YGameLocal';
import ErrorBoundary from './pages/ErrorBoundary';

const Stack = createNativeStackNavigator();

function App() {
  return (
    // <NavigationContainer linking={linkingConfig}>
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="FrontPage" component={FrontPage} options={{ title: 'Home' }}/>
          <Stack.Screen name="GameLobby" component={GameLobby} options={{ title: 'Lobby' }}/>
          <Stack.Screen name="YGame" component={YGame} options={{ title: 'Y Game' }}/>
          <Stack.Screen name="YGameLocal" component={YGameLocal} options={{ title: 'Y Game Local' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

export default App;
