
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Button } from 'react-native';



export default class AllChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatListData: [],
      chat_name: "",
      
    }
    this.startConvo = this.startConvo.bind(this);
  }
    
  componentDidMount() {
    console.log("mounted");
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  startConvo = async() =>{
    return fetch (`http://localhost:3333/api/1.0.0/chat/`, {
      method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token"),
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({name: this.state.chat_name})
        
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }else if (response.status === 400){
        throw alert("400: This page isn't working. If the problem continues, contact the site owner" );
      }else if (response.status === 401){
        throw alert('401: Authentication failed! you are not authorized to start a chat');
      } else if(response.status === 500){
        throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
      } else {
        throw alert("Something went wrong!")
      }
    })
    .then((responseJson) => {
      console.log(responseJson)
      this.getData()
    })
    .catch((error) => {
      console.log(error)
    })
  }


    getData = async() => {
      return fetch ("http://localhost:3333/api/1.0.0/chat", {
        method: 'GET',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
          },
      })
      .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to access chats');
        }else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
        }
      })
      .then(async(responseJson) => {
        this.setState({
          isLoading: false,
          chatListData: responseJson
        });
        try{
          await AsyncStorage.getItem("whatsthat_chat_id", responseJson.chat_id)

        }catch{
          throw "Something went wrong!"
        }
          
    
      })
      .catch((error) => {
        console.log(error)
      })

    }

    render() {
      return (
        <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="Enter chat name..."
          placeholderTextColor="#fff"
          onChangeText={(text) => this.setState({ chat_name: text })}
        />

        <TouchableOpacity style={styles.button} onPress={this.startConvo}>
          <Text style={styles.buttonText}>Create Chat</Text>
        </TouchableOpacity>


     <FlatList 
      data={this.state.chatListData}
      renderItem={({ item }) => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('SingleChat', { chat_id : item.chat_id })}>
      <View style={styles.chatItem}>
        <View styles={styles.chatImage}>
          <Text>Image</Text>
        </View>
        <View>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatSnippet}>{item.last_message.message}</Text>
          <Button
          title="..."
          onPress={() => this.props.navigation.navigate('ChatInfo', { chat_id: item.chat_id })}
          />
        </View>
      </View>
    </TouchableOpacity>
  )}
  keyExtractor={({ chat_id }) => {
    if (!chat_id) {
      console.warn('missing "chat_id" property for item in data array');
      return '';
    }
    return chat_id.toString();
  }}
/>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#191970',
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#a9a9a9',
      padding: 12,
      borderRadius: 4,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    chatImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    chatName: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    chatSnippet: {
      fontSize: 16,
      color: '#666',
    },
  });