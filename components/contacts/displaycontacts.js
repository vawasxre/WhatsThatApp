/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator,
} from 'react-native';

export default class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsListData: [],
      ContactID: '',
      searchQuery: '',
    };
  }

  componentDidMount() {
    console.log('mounted');
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  deleteContact = async (user_id) => fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
    method: 'DELETE',
    headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
  })
    .then((response) => {
      if (response.status === 200) {
        this.getData();
        return response.json();
      } if (response.status === 400) {
        throw alert("404: you can't remove yourself as a contact!");
      } else if (response.status === 401) {
        throw alert('401: Authentication failed! you are not authorized to delete a contact');
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
        contactsListData: responseJson,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  blockContact = async (user_id) => fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
    method: 'POST',
    headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
  })
    .then((response) => {
      if (response.status === 200) {
        this.getData();
        return response.json();
      } if (response.status === 400) {
        throw alert("you can't block yourself!");
      } else if (response.status === 401) {
        throw alert('401: Authentication failed! you are not authorized to block a contact');
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
        contactsListData: responseJson,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  getData = async () => fetch('http://localhost:3333/api/1.0.0/contacts', {
    method: 'GET',
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },

  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        throw alert('401: Authentication failed! you are not authorized to access contacts');
      } else if (response.status === 500) {
        throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
      } else {
        throw alert('Something went wrong!');
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        contactsListData: responseJson,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  searchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.searchQuery}`, {
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

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator
            size="large"
            color="#00ff00"
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.searchBox}
          onChangeText={(searchQuery) => this.setState({ searchQuery })}
          value={this.state.searchQuery}
          placeholder="Search users..."
          placeholderTextColor="#fff"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={this.searchContacts}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.contactsListData}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => this.deleteContact(item.user_id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blockButton}
                onPress={() => this.blockContact(item.user_id)}
              >
                <Text style={styles.blockButtonText}>Block</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={({ user_id }) => {
            if (!user_id) {
              console.warn('missing "user_id" property for item in data array');
              return '';
            }
            return user_id.toString();
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.viewBlockedContactsButton}
            onPress={() => this.props.navigation.navigate('BlockedContacts')}
          >
            <Text style={styles.viewBlockedContactsButtonText}>View Blocked List</Text>
          </TouchableOpacity>
        </View>
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
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#f00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addContactButton: {
    backgroundColor: '#f00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  blockButton: {
    backgroundColor: '#f00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  blockButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewBlockedContactsButton: {
    backgroundColor: '#a9a9a9',
    margin: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  viewBlockedContactsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});
