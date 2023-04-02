import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';


export default class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsListData: [],
      searchQuery: '',
    }
  }
    
    componentDidMount() {
        console.log("mounted");
        this.getData();
    }


    getData = async() => {
      return fetch ("http://localhost:3333/api/1.0.0/contacts", {
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
          contactsListData: responseJson
        });
          
    
      })
      .catch((error) => {
        console.log(error)
      })

    }

    searchContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.searchQuery}`, {
          method: 'GET',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
          },
        });
  
        if (response.status === 200) {
          const searchResults = await response.json();
          this.props.navigation.navigate('SearchedUser', { searchResults });
          this.setState({ searchQuery: '' });
          console.log(searchResults)
        } else if (response.status === 400) {
          throw 'Something went wrong!';
        }
      } catch (error) {
        console.log(error);
      }
    }
  

    render() {
      return (
        <View style={styles.container}>

<TextInput
          style={styles.searchBox}
          onChangeText={searchQuery => this.setState({searchQuery})}
          value={this.state.searchQuery}
          placeholder="Search contacts..."
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
                <Text style={styles.itemName}>{item.first_name} {item.last_name}</Text>
    
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => console.log('deleted')}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
    
                <TouchableOpacity
                  style={styles.blockButton}
                  onPress={() => console.log('blocked')}
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

      itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#000',
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