import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ContactsList from './displaycontacts';
import BlockedContacts from './displayblocked';
import SearchedUser from '../displaysingleusersummary';

const ContactsStack = createStackNavigator();

export default class MainContactsStack extends Component {
    
    render() {
        return (
                <ContactsStack.Navigator
                screenOptions={{
                    headerShown: false,
                  }}>
                    <ContactsStack.Screen name= "ContactsList" component={ContactsList} />
                    <ContactsStack.Screen name= "BlockedContacts" component={BlockedContacts}/>
                    <ContactsStack.Screen name= "SearchedUser" component={SearchedUser}/>

                </ContactsStack.Navigator>
        );
    }
}