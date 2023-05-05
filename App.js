import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './components/login';
import Signup from './components/signup';
import MainAppTabs from './components/mainAppTabs';


const AuthStack = createStackNavigator();


export default class App extends Component {
  render() {
    return (
        <NavigationContainer>
        <AuthStack.Navigator
         screenOptions={{
          headerShown: false, // Add this line to remove headers from all screens
        }}>
          <AuthStack.Screen name="Login" component={Login} />
          <AuthStack.Screen name="SignUp" component={Signup} />
          <AuthStack.Screen name="MainAppTabs" component={MainAppTabs} />
        </AuthStack.Navigator>
      </NavigationContainer>
      
    );
  }
}

