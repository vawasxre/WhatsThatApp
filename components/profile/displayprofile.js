import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profileData: [],
      photo: " ",
      email: '',
      password: '',
      error: '',
      submitted: false
      
    }
    this.logout = this.logout.bind(this)
  }

    componentDidMount() {
      console.log("mounted");
      this.unsubscribe = this.props.navigation.addListener('focus', () => {

        this.getData(() => {
          this.getPhoto()
        });

      });
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }

    getPhoto = async() => {
      return fetch (`http://localhost:3333/api/1.0.0/user/${this.state.profileData.user_id}/photo`, {
        method: 'GET',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
          },
          
      })
      .then((response) => {
        if(response.status === 200){
          return response.blob();
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to access the profile photo');
        }else if (response.status === 404){
          throw alert('404: Page not found!')
        }else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
        }
      })
      .then((responseBlob) => {
        let data = URL.createObjectURL(responseBlob);

    
        this.setState({
          photo: data,
          isLoading: false,
        })
      })
      .catch((error) => {
        console.log(error)
      })
       
    }

    getData = async(done) => {
      return fetch ("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthat_user_id"), {
        method: 'GET',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
          },
          
      })
      .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to access profile details');
        } else if (response.status === 404){
          throw alert('404: Page not found!')
        } else if(response.status === 500){
          throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
        } else {
          throw alert("Something went wrong!")
        }
      })
      .then((responseJson) => {
        this.setState({
          profileData: responseJson
        }, () => {
          done()
        })
      })
      .catch((error) => {
        console.log(error)
      })

    }

    logout = async() => {
      
      console.log("Logout")

        return fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'post',
            headers: {
              'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")
            }
              })
          .then(async(response) => {
            if(response.status === 200){
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }else if (response.status === 401){
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                throw alert('401: Authentication failed! you are not authorized to logout');
            }else if(response.status === 500){
              throw alert('500: Oops. Something went wrong. This server encountered an error and was unable to complete your request.')
            } else {
              throw alert("Something went wrong!")
            }
          })
          .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
      }

    
    render() {
      
        return(
          <View style = {styles.container}>

            <Image
            source={{
              uri: this.state.photo
            }}
            style={{
              width: 100,
              height: 100
            }}
            /> 
            
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{this.state.profileData.email}</Text>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.value}>{this.state.profileData.first_name}</Text>
            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.value}>{this.state.profileData.last_name}</Text>

            <TouchableOpacity
            style={styles.updateProfileButton}
            onPress={() => this.props.navigation.navigate('UpdateProfile', {
            data: this.state.profileData
          })
          }
          >
          <Text style={styles.updateProfileButtonText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.updatePhotoButton}
            onPress={() => this.props.navigation.navigate('CameraScreen', {
            data: this.state.profileData
          })
          }
          >
          <Text style={styles.updatePhotoButtonText}>Update Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>


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
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 16
  },
  error: {
    color: 'red',
    marginTop: 10
  },
  updateProfileButton: {
    backgroundColor: '#a9a9a9',
    margin: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  updateProfileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  updatePhotoButton: {
    backgroundColor: '#a9a9a9',
    margin: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  updatePhotoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#a9a9a9',
    margin: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center'
 },
 logoutButtonText: {
    color: '#f0f8ff',
    textAlign: 'center',
    fontWeight: 'bold'
   }
});

