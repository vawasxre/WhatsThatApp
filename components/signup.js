import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import EmailValidator from 'email-validator';


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmedPassword: '',
      error: '',
      submitted: false,
      success: ''
    };

    this.signup = this.signup.bind(this)
  }

  signup(){
    this.setState({submitted: true})
    this.setState({error: ""})

    if(!(this.state.first_name && this.state.last_name && this.state.email && this.state.password && this.state.password && this.state.confirmedPassword)){
        this.setState({error: "Must enter all details!"})
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

    if( this.state.password !== this.state.confirmedPassword){
      this.setState({error: 'Passwords do not match!'})
      return;
    }

    console.log("Button clicked: " + this.state.email + " " + this.state.password)
    console.log("Validated and ready to send to the API")
    

  
      return fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "first_name": this.state.first_name,
          "last_name": this.state.last_name,
          "email": this.state.email,
          "password": this.state.password
          })
      })
        .then((response) => {
          if(response.status === 201){
            return response.json()
          }else if (response.status === 400){
            throw "Email already exists or password isn't strong enough!";
          }else {
            throw "Something went wrong!";
          }
        })
        .then((responseJson) => {
          console.log('User created with ID: ',responseJson);
          this.setState({"error": "User added successfully"})
          this.setState({"submitted": false});
          this.props.navigation.navigate("Login");
        })
        .catch((error) => {
          this.setState({"error": error})
          this.setState({"submitted": false});
        })


    }


  render(){
    return(
      <View style={styles.container}>

         <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#a9a9a9"
        onChangeText={first_name => this.setState({first_name})}
        value={this.state.first_name}

      />

       <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#a9a9a9"
        onChangeText={last_name => this.setState({last_name})}
        value={this.state.last_name}

      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#a9a9a9"
        onChangeText={confirmedPassword => this.setState({confirmedPassword})}
        secureTextEntry={true}
        value={this.state.confirmedPassword}
      />

      <TouchableOpacity style={styles.signupButton} onPress={this.signup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={()=> this.props.navigation.navigate('Login')}>
        <Text style={styles.submitButtonText}>Login</Text> 
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
