/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, TouchableOpacity, Text, StyleSheet, FlatList,
} from 'react-native';

export default class BlockedContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      blockedListData: [],
      ContactID: '',

    };
  }

  componentDidMount() {
    console.log('mounted');
    this.getData();
  }

  unblockContact = async (user_id) => fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
    method: 'DELETE',
    headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
  })
    .then((response) => {
      if (response.status === 200) {
        this.getData();
        return response.json();
      } if (response.status === 400) {
        throw alert("400: you can't block yourself!");
      } else if (response.status === 401) {
        throw alert('401: Authentication failed! you are not authorized to unblock a contact');
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
        isLoading: true,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  getData = async () => fetch('http://localhost:3333/api/1.0.0/blocked', {
    method: 'GET',
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },

  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        throw alert('401: Authentication failed! you are not authorized to access blocked contacts');
      } else if (response.status === 500) {
        throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.');
      } else {
        throw alert('Something went wrong!');
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        blockedListData: responseJson,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.blockedListData}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>

              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => this.unblockContact(item.user_id)}
              >
                <Text style={styles.unblockButtonText}>Unblock</Text>
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
            style={styles.returnButton}
            onPress={() => this.props.navigation.navigate('ContactsList')}
          >
            <Text style={styles.returnButtonText}>Return</Text>
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
    padding: 20,
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
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  unblockButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  unblockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#a9a9a9',
    margin: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  returnButtonText: {
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
