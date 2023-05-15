import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.route.params.message,
    };
  }

  editMessage = async () => {
    const message_id = this.props.route.params.message_id;
    const chat_id = this.props.route.params.chat_id;
    const message = this.state.message;

    return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Message edited');
          this.props.navigation.goBack();
        }else if (response.status === 400){
          throw alert("400: This page isn't working. If the problem continues, contact the site owner" );
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to edit this message');
        } else if (response.status === 403){
          throw alert('403: Forbidden! you do not have the permissions to edit the message')
        } else if (response.status === 404){
          throw alert('404: Page not found!')
        }else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteMessage = async () => {
    const message_id = this.props.route.params.message_id;
    const chat_id = this.props.route.params.chat_id;

    return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Message deleted');
          this.props.navigation.goBack();
        } else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to delete this message');
        } else if (response.status === 403){
          throw alert('403: Forbidden! you do not have the permissions to delete this message')
        } else if (response.status === 404){
          throw alert('404: Page not found!')
        }else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          multiline
          value={this.state.message}
          onChangeText={(val) => this.setState({ message: val })}
        />
        <TouchableOpacity style={styles.editButton} onPress={this.editMessage}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={this.deleteMessage}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>

        </View>
    );
}

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#191970',
      padding: 10,
    },
    input: {
      height: 200,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      color: '#fff'
    },
    editButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#2196F3',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    deleteButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FF0000',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    deleteButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  
  
  
  
  
  