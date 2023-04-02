
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';



export default class AllChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatListData: [],
      
    }
  }
    
    componentDidMount() {
        console.log("mounted");
        this.getData();
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
        }else if (response.status === 400){
          throw 'Something went wrong!';
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
      fontSize: 18,
      fontWeight: 'bold',
    },
    chatSnippet: {
      fontSize: 16,
      color: '#666',
    },
  });