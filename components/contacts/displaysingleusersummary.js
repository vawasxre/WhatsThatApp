import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SearchedUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsListData: [],
      ContactID: ''
    }
  }


  addContact = async (user_id) => {
    
        return fetch (`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
          method: "POST",
          headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")

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
          console.log(responseJson)
          this.setState({
            isLoading: false,
            contactsListData: responseJson
          });
        })
        .catch((error) => {
          console.log(error)
        })
      }



  render() {
    const { route } = this.props;
    const { searchResults } = route.params;

    

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search Results:</Text>

        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultName}>{item.given_name} {item.family_name}</Text>

                <TouchableOpacity
                  style={styles.addContactButton}
                  onPress={() => this.addContact(item.user_id)}
                >
                  <Text style={styles.addContactButtonText}>Add Contact</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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