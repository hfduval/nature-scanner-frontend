import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Scanner() {
    const [type, setType] = useState(CameraType.back);
  
    function toggleCameraType() {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
  
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} autoFocus={AutoFocus.on}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <FontAwesome name="retweet" size={30} color="#000"/>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: 'transparent',
      top: 30,
      left: 330,
      width: 50,
      height: 50,
    },
    button: {
      flex: 1,
      alignItems: 'center',
    },
});
