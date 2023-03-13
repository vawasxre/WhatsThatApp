import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from './components/login';
import SignUp from './components/signup';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#191970',
        },
        headerTintColor: '#fff',
      }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
