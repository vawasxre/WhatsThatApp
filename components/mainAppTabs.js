import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainChatStack from './chats/chatStack';
import MainContactsStack from './contacts/contactsStack';
import Profile from './displayprofile';
import Settings from './displaysettings';

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
                    },
                  }}>
                    <MainAppTabs.Screen name="Chats" component={MainChatStack}/>
                    <MainAppTabs.Screen name="Contacts" component={MainContactsStack}/>
                    <MainAppTabs.Screen name="Profile" component={Profile}/>
                    <MainAppTabs.Screen name="Settings" component={Settings}/>
                </MainAppTabs.Navigator>
        );
    }
}