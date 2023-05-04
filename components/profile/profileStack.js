import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from './displayprofile';
import UpdateProfile from './updateprofile';
import CameraScreen from './camera';

const ProfileStack = createStackNavigator();

export default class MainProfileStack extends Component {
    
    render() {
        return (
                <ProfileStack.Navigator
                screenOptions={{
                    headerShown: false,
                  }}>
                    <ProfileStack.Screen name= "ProfileScreen" component={ProfileScreen} />
                    <ProfileStack.Screen name= "UpdateProfile" component={UpdateProfile}/>
                    <ProfileStack.Screen name= "CameraScreen" component={CameraScreen}/>


                </ProfileStack.Navigator>
        );
    }
}