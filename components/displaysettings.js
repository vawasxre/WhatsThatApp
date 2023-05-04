import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        error: '',
        submitted: false
      }
  
      this.logout = this.logout.bind(this)
    }
  
    logout = async() => {
      
      console.log("Logout")

        return fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'post',
            headers: {
              'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
            }
              })
          .then(async(response) => {
            if(response.status === 200){
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }else if (response.status === 401){
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
              
            }else {
              throw 'Something went wrong!';
            }
          })
          .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
      }
  
  
    render(){
      return(
        <View style={styles.container}>
  
        
  
        <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
  
      </View>
  
      )
    }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191970',
        alignItems: 'center',
        justifyContent: 'center',
       },
       logoutButton: {
        backgroundColor: '#a9a9a9',
        margin: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        height: 40,
        justifyContent: 'center'
     },
     logoutButtonText: {
        color: '#f0f8ff',
        textAlign: 'center',
        fontWeight: 'bold'
       }

})

