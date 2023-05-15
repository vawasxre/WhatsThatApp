import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import EmailValidator from 'email-validator';


export default class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      originalData: {},

      first_name: '',
      last_name: '',
      email: '',
      password: '',
      
    }
  }
    
    componentDidMount() {
        this.setState({
            originalData: this.props.route.params.data,
            first_name: this.props.route.params.data.first_name,
            last_name: this.props.route.params.data.last_name,
            email: this.props.route.params.data.email,
        }, () => {
            console.log(this.state)
        })
        
    }


    updateProfile = async() => {
        this.setState({error: ""})
        console.log( this.state)


        if(!EmailValidator.validate(this.state.email)){
            this.setState({error: "Must enter valid email"})
            return;
        }

        let data = {}

        if(this.state.first_name != this.state.originalData.first_name){
            data["first_name"] = this.state.first_name
        }

        if(this.state.last_name != this.state.originalData.last_name){
            data["last_name"] = this.state.last_name
        }

        if(this.state.email != this.state.originalData.email){
            data["email"] = this.state.email
        }

        if(this.state.password !=""){

            const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
            if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return data["password"] = this.state.password;
        }
        }

        console.log( data)


      return fetch (`http://localhost:3333/api/1.0.0/user/${this.state.originalData.user_id}`, {
        method: 'PATCH',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token"),
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(data)
          
      })
      .then((response) => {
        if(response.status === 200){
            alert("Details updated!")

          return response.json()
        }else if (response.status === 400){
          throw alert("400: This page isn't working. If the problem continues, contact the site owner" );
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to change profile details');
        } else if (response.status === 403){
          throw alert('403: Forbidden! you do not have the permissions to access profile details')
        } else if (response.status === 404){
          throw alert('404: Page not found!')
        }else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
        }
      })
      .catch((error) => {
        console.log(error)
      })

    }


    render() {
      
        return(
            <View style={styles.container}>
            <Text style={styles.profileText}>First Name:</Text>
            <TextInput
              style={styles.input}
              value={this.state.first_name}
              onChangeText={(val) => this.setState({"first_name" : val})}
            />
          
            <Text style={styles.profileText}>Last Name:</Text>
            <TextInput
              style={styles.input}
              value={this.state.last_name}
              onChangeText={(val) => this.setState({"last_name" : val})}
            />
          
            <Text style={styles.profileText}>Email:</Text>
            <TextInput
              style={styles.input}
              value={this.state.email}
              onChangeText={(val) => this.setState({"email" : val})}
            />
          
            <Text style={styles.profileText}>Password:</Text>
            <TextInput
              style={styles.input}
              value={this.state.password}
              onChangeText={(val) => this.setState({"password" : val})}
            />
          
            {this.state.error ? <Text style={styles.errorText}>{this.state.error}</Text> : null}
          
            <TouchableOpacity
              style={styles.updateProfileButton}
              onPress={() => this.updateProfile()}
            >
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.returnButton}
              onPress={() => this.props.navigation.navigate("ProfileScreen")}
            >
              <Text style={styles.returnbuttonText}>Return</Text>
            </TouchableOpacity>


            
          </View>

        );
      }
    }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: '#191970',
        },
        input: {
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
          color: '#fff'
        },
        updateProfileButton: {
          backgroundColor: '#a9a9a9',
          margin: 5,
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        },
        buttonText: {
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
        },
        returnButton: {
          backgroundColor: '#a9a9a9',
            padding: 10,
            margin: 5,
            borderRadius: 5,
            alignItems: 'center',
          },
          profileText: {
            color:'#fff'

          },
        returnbuttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
          },
        errorText: {
          color: 'red',
          marginBottom: 10,
        },
      });