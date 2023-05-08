import {Camera, CameraType, onCameraReady, CameraPictureOptions} from 'expo-camera'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';


export default function CameraScreen({route, navigation}) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);

    function toggleCameraType(){
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        console.log("Camera: ", type)
    }

    async function takePhoto(){
        if(camera){
            const options = {quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data)}
            const data = await camera.takePictureAsync(options)
        }
    }

    async function sendToServer(data){
        console.log("HERE", data.uri)

        let id = route.params.data.user_id;

        let res = await fetch(data.uri);
        let blob = await res.blob()

        return fetch (`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
        method: 'POST',
          headers: {
            'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token"),
            "Content-Type" : "image/png"
          },
          body: blob
      })
      .then((response) => {
        if(response.status === 200){
            console.log("Image Updated")
            navigation.navigate("ProfileScreen")
        }else if (response.status === 400){
          throw alert("400: This page isn't working. If the problem continues, contact the site owner" );
        }else if (response.status === 401){
          throw alert('401: Authentication failed! you are not authorized to access camera features');
        } else if (response.status === 403){
          throw alert('403: Forbidden! you do not have the permissions to access camera feautures')
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

    return (
      <View style={styles.container}>
          <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
              <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                      <Text style={styles.text}>Flip Camera</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={takePhoto}>
                      <Text style={styles.text}>Take Photo</Text>
                  </TouchableOpacity>
              </View>
          </Camera>
      </View>
  );
}  


const styles = StyleSheet.create({
container: {
  flex: 1
},
buttonContainer: {
  alignSelf: 'flex-end',
  padding: 5,
  margin: 5,
  backgroundColor: 'steelblue'
},
button: {
  width: '100%',
  height: '100%'
},
text: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#ddd'
}
})

   

    
