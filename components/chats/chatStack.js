import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AllChats from './displaychat';
import SingleChat from './displaysinglemessage';

const ChatStack = createStackNavigator();

export default class MainChatStack extends Component {
    
    render() {
        return (
                <ChatStack.Navigator
                screenOptions={{
                    headerShown: false, // Add this line to remove headers from all screens
                  }}>
                    <ChatStack.Screen name= "AllChats" component={AllChats} />
                    <ChatStack.Screen name= "SingleChat" component={SingleChat}/>
                </ChatStack.Navigator>
        );
    }
}