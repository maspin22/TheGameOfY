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
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0a0a0a',
              borderBottomWidth: 4,
              borderBottomColor: '#00ff00',
            },
            headerTintColor: '#00ffff',
            headerTitleStyle: {
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: 18,
              letterSpacing: 3,
              textTransform: 'uppercase',
            },
            headerBackTitle: '◄',
            headerBackTitleStyle: {
              fontFamily: 'monospace',
              fontSize: 20,
            },
            contentStyle: {
              backgroundColor: '#0a0a0a',
            },
          }}
        >
          <Stack.Screen 
            name="FrontPage" 
            component={FrontPage} 
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="GameLobby" 
            component={GameLobby} 
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="YGame" 
            component={YGame} 
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="YGameLocal" 
            component={YGameLocal} 
            options={{ 
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

export default App;
