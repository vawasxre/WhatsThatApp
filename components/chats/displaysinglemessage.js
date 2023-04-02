import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';


export default class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messages: [],
    }
  }
    
    componentDidMount() {
        console.log("mounted");
        this.getData();
       
    }
      getStyle = (from) => {
        if (from == "whatsthat_user_id"){
          return styles.left;
        }else{
          return styles.right;
        }
      }

    getData = async() => {
      const chat_id = this.props.route.params.chat_id
      return fetch (`http://localhost:3333/api/1.0.0/chat/` + chat_id , {
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
          messages: responseJson.messages
        })
    
      })
      .catch((error) => {
        console.log(error)
      })



    }

    render() {
      if (this.state.isLoading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );

      }
      return (
        <View style={styles.container}>
            <View style={styles.chatWindow}>

            <FlatList

                data={this.state.messages}

                renderItem={({ item }) => (
                  <View style={this.getStyle(item.from)}>
                    <Text style={styles.message}>{item.message}</Text>
                  </View>
                )}
      
      keyExtractor={({ message_id }) => {
        if (!message_id) {
          console.warn('missing "chat_id" property for item in data array');
          return '';
        }
        return message_id.toString();
      }}
        />

            </View>
            <View style={styles.typeBox}>
                <TextInput
                placeholder='type something..'
                />
            </View>

        </View>
      );
    }

    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    chatWindow: {
      flex: 1,
      padding: 10,
    },
    left: {
      alignSelf: 'flex-start',
      backgroundColor: '#f0f0f0',
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      maxWidth: '70%',
    },
    right: {
      alignSelf: 'flex-end',
      backgroundColor: '#0084ff',
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      maxWidth: '70%',
    },
    message: {
      fontSize: 16,
      color: '#000',
    },
    typeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
      padding: 10,
    },
    input: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginRight: 10,
    },
    
  });