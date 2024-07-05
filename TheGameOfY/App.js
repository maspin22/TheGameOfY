import * as React from 'react';
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
      <NavigationContainer >
        <Stack.Navigator>
          <Stack.Screen name="FrontPage" component={FrontPage} options={{ title: 'Home' }}/>
          <Stack.Screen name="GameLobby" component={GameLobby} options={{ title: 'Lobby' }}/>
          <Stack.Screen name="YGame" component={YGame} options={{ title: 'YGame' }}/>
          <Stack.Screen name="YGameLocal" component={YGameLocal} options={{ title: 'YGame Local' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

export default App;

// import React from 'react';
// import { SafeAreaView, Text } from 'react-native'; // Make sure to import View and Text

// const App = () => {
//   return (
//     <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Game Lobby</Text>
//     </SafeAreaView>
//   );
// }

// export default App;