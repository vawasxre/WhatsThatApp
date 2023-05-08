import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';


export default class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messages: [],
      new_message: "",
      session_token: null, //
    }
  }
    
  componentDidMount() {
    console.log("mounted");
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({session_token: await AsyncStorage.getItem("whatsthat_user_id")}, () => {
        this.getData();
        this.interval = setInterval(() => {
          this.getData(); // fetch new messages every 5 seconds (or any other interval)
        }, 5000);
      })
     
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval); // clear interval when component unmounts
    this.unsubscribe();
  }


  getStyle = (author) => {
    const loggedInUserId = parseInt(this.state.session_token);
    if (author.user_id === loggedInUserId){
      return styles.right;
    }else{
      return styles.left;
    }
  }

    addMessage = async() =>{

      if (this.state.new_message === ""){
        console.log("cannot send empty message")
        return;
      }

      const chat_id = this.props.route.params.chat_id

      return fetch (`http://localhost:3333/api/1.0.0/chat/${chat_id}/message`, {
        method: 'POST',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token"),
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({message: this.state.new_message})
          
      })
      .then((response) => {
        if(response.status === 200){
            console.log("Added message")
            this.setState({new_message: ""})
            this.getData();
        }else if (response.status === 400){
          throw alert("400: This page isn't working. If the problem continues, contact the site owner" );
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to send this message');
        } else if (response.status === 403){
          throw alert('403: Forbidden! you do not have the permissions to send a message')
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

    getData = async() => {
      const chat_id = this.props.route.params.chat_id
      return fetch (`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        method: 'GET',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
          },
          
      })
      .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to access this page');
        } else if (response.status === 403){
          throw alert('403: Forbidden! you do not have the permissions to view this page')
        } else if (response.status === 404){
          throw alert('404: Page not found!')
        }else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
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

                  <View style={this.getStyle(item.author)}>

                    <Text style={styles.message}>{item.message}</Text>

                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        this.props.navigation.navigate('EditMessage', {
                          message_id : item.message_id,
                          message : item.message,
                          chat_id : this.props.route.params.chat_id,
                        });
                      }}
                    >
                      <Text style={styles.editButtonText}>o</Text>
                    </TouchableOpacity>
                  </View>
                )}
      
      keyExtractor={({ message_id }) => {
        if (!message_id) {
          console.warn('missing "chat_id" property for item in data array');
          return '';
        }
        return message_id.toString();
      }}
      inverted
        />

            </View>
            <View style={styles.typeBox}>
                <TextInput
                value={this.state.new_message}
                onChangeText={(val) => this.setState({new_message: val})}
                placeholder='type something..'
                />

                <TouchableOpacity 
                style={styles.sendButton}
                onPress={() => this.addMessage()}
                >
                  <Text style={styles.sendButtonText}>Send</Text>

                </TouchableOpacity>
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
      color: 'red',
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      maxWidth: '70%',
    },
    right: {
      alignSelf: 'flex-end',
      backgroundColor: '#0084ff',
      color: 'green',
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
    sendButton: {
      backgroundColor: '#0084ff',
      borderRadius: 10,
      padding: 10,
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    editButton: {
      backgroundColor: '#0084ff',
      borderRadius: 15,
      padding: 5,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButtonText: {
      color: '#fff',
      fontSize: 20,
    },
    
  });