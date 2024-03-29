/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
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
    };

    this.signup = this.signup.bind(this);
  }

  signup() {
    this.setState({ error: '' });

    if (!(this.state.first_name
      && this.state.last_name
      && this.state.email
      && this.state.password
      && this.state.password
      && this.state.confirmedPassword)) {
      this.setState({ error: 'Must enter all details!' });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Must enter valid email!' });
      return;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
      return;
    }

    if (this.state.password !== this.state.confirmedPassword) {
      this.setState({ error: 'Passwords do not match!' });
      return;
    }

    console.log(`Button clicked: ${this.state.email} ${this.state.password}`);
    console.log('Validated and ready to send to the API');

    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          throw alert("400: This page isn't working. If the problem continues, contact the site owner");
        } else if (response.status === 500) {
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
        } else {
          throw alert('Something went wrong!');
        }
      })
      .then((responseJson) => {
        console.log('User created with ID: ', responseJson);
        this.setState({ error: 'User added successfully' });
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#a9a9a9"
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#a9a9a9"
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
        />

        <TextInput
          style={styles.input}
          placeholder="Email ID"
          placeholderTextColor="#a9a9a9"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a9a9a9"
          onChangeText={(password) => this.setState({ password })}
          secureTextEntry
          value={this.state.password}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#a9a9a9"
          onChangeText={(confirmedPassword) => this.setState({ confirmedPassword })}
          secureTextEntry
          value={this.state.confirmedPassword}
        />

        <TouchableOpacity style={styles.signupButton} onPress={this.signup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>

        {this.state.error ? (
          <Text style={styles.error}>{this.state.error}</Text>
        ) : null}

      </View>

    );
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
    paddingHorizontal: 35,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#f0f8ff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',

  },
  signupButton: {
    backgroundColor: '#a9a9a9',
    margin: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#f0f8ff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

});
