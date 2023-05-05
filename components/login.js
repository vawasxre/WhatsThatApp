import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ToastAndroid } from 'react-native';
import EmailValidator from 'email-validator';
import Toast from 'react-native-root-toast';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      submitted: false
    }

    this.login = this.login.bind(this)
  }

  login = async() => {
    this.setState({submitted: true})
    this.setState({error: ""})

    if(!(this.state.email && this.state.password)){
        this.setState({error: "Must enter email and password"})
        return;
    }

    if(!EmailValidator.validate(this.state.email)){
        this.setState({error: "Must enter valid email"})
        return;
    }

      const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }

    console.log("Button clicked: " + this.state.email + " " + this.state.password)
    console.log("Validated and ready to send to the API")



  
      return fetch('http://localhost:3333/api/1.0.0/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "email": this.state.email,
            "password": this.state.password
            })
        })
        .then((response) => {
          if(response.status === 200){
            return response.json()
          }else if (response.status === 400){
            throw alert("400: This page isn't working. If the problem continues, contact the site owner" );
          }else if(response.status === 500){
            throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
          } else {
            throw alert("Something went wrong!")
          }
        })
        .then(async(responseJson) => {
          console.log(responseJson);
          try{
            await AsyncStorage.setItem("whatsthat_user_id", responseJson.id)
            await AsyncStorage.setItem('whatsthat_session_token', responseJson.token);

            this.setState({"submitted": false});

            this.props.navigation.navigate('MainAppTabs');
          }catch{
            throw "Something went wrong!"
          }
        })
        .catch(error => {
          console.log(error);
        });


    }


  render(){
    return(
      <View style={styles.container}>


      <Text style={styles.title}>
        WhatsThat
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email ID"
        placeholderTextColor="#a9a9a9"
        onChangeText={email => this.setState({email})}
        value={this.state.email}

      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a9a9a9"
        onChangeText={password => this.setState({password})}
        secureTextEntry={true}
        value={this.state.password}
      />

      <TouchableOpacity style={styles.submitButton} onPress={this.login}>
        <Text style={styles.submitButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={()=> this.props.navigation.navigate('SignUp')}>
        <Text style={styles.signupButtonText}>Sign Up</Text> 
      </TouchableOpacity>

      {this.state.error ? (
        <Text style={styles.error}>{this.state.error}</Text>
      ) : null}

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

   title:{
    color: "#f0f8ff",
    fontSize: 50,
    height: 100,

   },
   
   input: {
      margin: 10,
      height: 40,
      borderColor: '#a9a9a9',
      borderWidth: 1,
      color: '#f0f8ff',
      paddingHorizontal: 10,
      borderRadius: 5,
   },
   submitButton: {
      backgroundColor: '#a9a9a9',
      margin: 10,
      paddingHorizontal: 25,
      borderRadius: 5,
      height: 40,
      justifyContent: 'center'
   },
   submitButtonText:{
    color: '#f0f8ff',
    textAlign: 'center',
    fontWeight: 'bold'
   },
   error: {
    color: 'red',
    textAlign: 'center'
    
  },
   signupButton:{
      backgroundColor: '#a9a9a9',
      margin: 5,
      paddingHorizontal: 25,
      borderRadius: 5,
      height: 40,
      justifyContent: 'center'
   },
   signupButtonText: {
    color: '#f0f8ff',
    textAlign: 'center',
    fontWeight: 'bold'
   }


})
