import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';

export default class BlockedContacts extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        blockedListData: [],
        
      }
    }
      
      componentDidMount() {
          console.log("mounted");
          this.getData();
      }
  
      getData = async() => {
        return fetch ("http://localhost:3333/api/1.0.0/blocked", {
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
            blockedListData: responseJson
          });
            
      
        })
        .catch((error) => {
          console.log(error)
        })
  
        
  
      }

      render() {
        return (
          <View style={styles.container}>
            <FlatList
              data={this.state.blockedListData}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemName}>{item.first_name} {item.last_name}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => console.log('unblocked')}
                  >
                    <Text style={styles.deleteButtonText}>Unblock</Text>
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
      backgroundColor: '#fff',
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
    },
    deleteButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
    },
    deleteButtonText: {
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