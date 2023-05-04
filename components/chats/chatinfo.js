import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatInfo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        chatInfoData: {},
        chat_name: '',
        user_id: '',
      };
    }
  
    componentDidMount() {
      console.log("mounted");
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getChatInfoData();
      });
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }
  
    
    editConvoName = async() =>{
      const chat_id = this.props.route.params.chat_id;
      return fetch (`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        method: 'PATCH',
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
          throw 'Something went wrong!';
        }
      })
      .then((responseJson) => {
        console.log(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
    }


    addUser = async (user_id) => {
      const chat_id = this.props.route.params.chat_id;
      return fetch (`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
        method: "POST",
        headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")},
      })
      .then((response) => {
        if(response.status === 200){
          this.getChatInfoData();
          return response.json()
        }else if (response.status === 400){
          throw 'Something went wrong!';
        }
      })
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({ 
          user_id: '',
          isLoading: false,
          chatInfoData: responseJson
         }); // clear input after adding user
      })
      .catch((error) => {
        console.log(error)
      })
    }
    
    deleteUser = async (user_id) => {
      const chat_id = this.props.route.params.chat_id;
      return fetch (`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
        method: "DELETE",
        headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")},
      })
      .then((response) => {
        if(response.status === 200){
          this.getChatInfoData();
          return response.json()
        }else if (response.status === 400){
          throw 'Something went wrong!';
        }
      })
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false,
          chatInfoData: responseJson
        });
      })
      .catch((error) => {
        console.log(error)
      })
    }
    
  getChatInfoData = async () => {
      const chat_id = this.props.route.params.chat_id;
      const session_token = await AsyncStorage.getItem('whatsthat_session_token');

      return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        method: 'GET',
        headers: {
          'X-Authorization': session_token
        }
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400){
            throw 'Something went wrong!',
            this.props.navigation.navigate("AllChats")
          }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            chatInfoData: responseJson,
            chat_name: responseJson.name
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    render() {
      if (this.state.isLoading) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }
  
      const chatInfoData = this.state.chatInfoData;
  
      return (
        <View style={styles.container}>

        <TextInput
        style={styles.chatNameInput}
        value={this.state.chat_name}
        onChangeText={(text) => this.setState({chat_name: text})}
      />

        <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          this.editConvoName();
        }}>
        <Text style={styles.saveButtonText}>Save Name</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="User ID"
          value={this.state.user_id}
          onChangeText={(text) => this.setState({ user_id: text })}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            this.addUser(this.state.user_id);
            this.setState({ user_id: '' }); // clear input after adding user
          }}
        >
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>

          <Text style={styles.chatCreator}> Created by: {chatInfoData.creator.first_name} {chatInfoData.creator.last_name}</Text>

          <View style={styles.membersContainer}>
            <Text style={styles.membersTitle}>Members:</Text>
            {chatInfoData.members.map((member) => (
              <View style={styles.memberItem} key={member.user_id}>
                <Text style={styles.memberName}>{member.first_name} {member.last_name}</Text>
                <Text style={styles.memberEmail}>{member.email}</Text>
                <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          this.deleteUser(member.user_id);
        }}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
              </View>
            ))}
          </View>

          
          
          
          </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#191970',
      alignItems: 'center'
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    addButton: {
      backgroundColor: '#2196F3',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    chatNameInput: {
      margin: 10,
      height: 40,
      borderColor: '#a9a9a9',
      borderWidth: 1,
      color: '#f0f8ff',
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    addUserInput: {
      margin: 10,
      height: 40,
      borderColor: '#a9a9a9',
      borderWidth: 1,
      color: '#f0f8ff',
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    chatCreator: {
      fontSize: 18,
      marginBottom: 10
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10
    },
    membersTitle: {
      marginBottom: 10
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      paddingRight: 10, // Add padding to the right to make room for the delete button
      justifyContent: 'space-between', // Add this to make the delete button go to the right side
    },
  
    // Add styles for the delete button
    deleteButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
    },
  
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });