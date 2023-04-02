import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profileData: [],
      
    }
  }
    
    componentDidMount() {
        console.log("mounted");
        this.getData();
    }

    getData = async() => {
      return fetch ("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthat_user_id"), {
        method: 'GET',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
          },
          
      })
      .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if (response.status === 400){
          throw 'Something went wrong!';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          profileData: responseJson
        })
      })
      .catch((error) => {
        console.log(error)
      })

    }


    render() {
      
        return(
          <View style = {styles.container}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{this.state.profileData.email}</Text>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.value}>{this.state.profileData.first_name}</Text>
            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.value}>{this.state.profileData.last_name}</Text>


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
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 16
  },
  error: {
    color: 'red',
    marginTop: 10
  }
});

