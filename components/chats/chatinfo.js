/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
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
    console.log('mounted');
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getChatInfoData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  editConvoName = async () => {
    const { chat_id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: this.state.chat_name }),

    })
      .then((response) => {
        if (response.status === 200) {
          alert('Chat name changed!');
          return response.json();
        } if (response.status === 400) {
          throw alert("400: This page isn't working. If the problem continues, contact the site owner");
        } else if (response.status === 401) {
          throw alert('401: Authentication failed! you are not authorized to edit this chat name');
        } else if (response.status === 403) {
          throw alert('403: Forbidden! you do not have the permissions to change this chat name');
        } else if (response.status === 404) {
          throw alert('404: Page not found!');
        } else if (response.status === 500) {
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
        } else {
          throw alert('Something went wrong!');
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.searchQuery}search_in=contacts&limit=20&offset=0`, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });

      if (response.status === 200) {
        const searchResults = await response.json();
        this.props.navigation.navigate('SearchedUser', { searchResults });
        this.setState({ searchQuery: '' });
        console.log(searchResults);
      } else if (response.status === 400) {
        throw alert("400: This page isn't working. If the problem continues, contact the site owner");
      } else if (response.status === 401) {
        throw alert('401: Authentication failed! you are not authorized to search for contacts');
      } else if (response.status === 500) {
        throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
      } else {
        throw alert('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  addUser = async (user_id) => {
    const { chat_id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
      method: 'POST',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getChatInfoData();
          return response.json();
        } if (response.status === 400) {
          throw alert("400: This page isn't working. If the problem continues, contact the site owner");
        } else if (response.status === 401) {
          throw alert('401: Authentication failed! you are not authorized to add a user to the chat');
        } else if (response.status === 403) {
          throw alert('403: Forbidden! you do not have the permissions to add a user to the chat');
        } else if (response.status === 404) {
          throw alert('404: no input for contact detected!');
        } else if (response.status === 500) {
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
        } else {
          throw alert('Something went wrong!');
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          user_id: '',
          isLoading: false,
          chatInfoData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteUser = async (user_id) => {
    const { chat_id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
      method: 'DELETE',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getChatInfoData();
          return response.json();
        } if (response.status === 401) {
          throw alert('401: Authentication failed! you are not authorized to delete a user from the chat');
        } else if (response.status === 403) {
          throw alert('403: Forbidden! you do not have the permissions to delete a user from the chat');
        } else if (response.status === 404) {
          throw alert('404: Page not found!');
        } else if (response.status === 500) {
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
        } else {
          throw alert('Something went wrong!');
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          chatInfoData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getChatInfoData = async () => {
    const { chat_id } = this.props.route.params;
    const session_token = await AsyncStorage.getItem('whatsthat_session_token');

    return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw alert("400: This page isn't working. If the problem continues, contact the site owner");
        } else if (response.status === 401) {
          throw alert('401: Authentication failed! you are not authorized to access chat details');
        } else if (response.status === 403) {
          this.props.navigation.navigate('AllChats');
          throw alert('You are no longer a member of this chat.');
        } else if (response.status === 404) {
          this.props.navigation.navigate('AllChats');
        } else if (response.status === 500) {
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
        } else {
          throw alert('Something went wrong!');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chatInfoData: responseJson,
          chat_name: responseJson.name,
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

    const { chatInfoData } = this.state;

    return (
      <View style={styles.container}>

        <TextInput
          style={styles.chatNameInput}
          value={this.state.chat_name}
          onChangeText={(text) => this.setState({ chat_name: text })}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            this.editConvoName();
          }}
        >
          <Text style={styles.addButtonText}>Save Name</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="User ID"
          placeholderTextColor="#fff"
          value={this.state.user_id}
          onChangeText={(text) => this.setState({ user_id: text })}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            this.addUser(this.state.user_id);
            this.setState({ user_id: '' });
          }}
        >
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>

        <Text style={styles.chatCreator}>
          {' '}
          Created by:
          {' '}
          {chatInfoData.creator.first_name}
          {' '}
          {chatInfoData.creator.last_name}
        </Text>

        <View style={styles.membersContainer}>
          <Text style={styles.membersTitle}>Members:</Text>
          {chatInfoData.members.map((member) => (
            <View style={styles.memberItem} key={member.user_id}>
              <Text style={styles.memberName}>
                {member.first_name}
                {' '}
                {member.last_name}
              </Text>
              <Text style={styles.memberEmail}>{member.email}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  this.deleteUser(member.user_id);
                }}
              >
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
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#a9a9a9',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#f0f8ff',
    textAlign: 'center',
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
    marginBottom: 10,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  membersTitle: {
    marginBottom: 10,
    color: '#fff',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  memberName: {
    color: '#fff',

  },
  memberEmail: {
    color: '#fff',

  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },

  deleteButtonText: {
    color: '#ffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
