import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default class SearchedUser extends Component {
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