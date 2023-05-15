import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import MainChatStack from './chats/chatStack';
import MainContactsStack from './contacts/contactsStack';
import MainProfileStack from './profile/profileStack';

const MainAppTabs = createBottomTabNavigator();

export default class MainAppNav extends Component {
    
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    };

    render() {
        return (
                <MainAppTabs.Navigator
                screenOptions={{
                    headerStyle: {
                      backgroundColor: '#708090',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                      headerShown: false,
                    },
                  }}>
                    <MainAppTabs.Screen name="Chats" 
                    component={MainChatStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <Icon name="chatbox-ellipses-outline" size={size} color={color} />
                        ),
                      }}/>
                    <MainAppTabs.Screen name="Contacts" 
                    component={MainContactsStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <Icon name="people-outline" size={size} color={color} />
                        ),
                      }}/>
                    <MainAppTabs.Screen name="Profile" 
                    component={MainProfileStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <Icon name="settings-outline" size={size} color={color} />
                        ),
                      }} />
                </MainAppTabs.Navigator>
        );
    }
}