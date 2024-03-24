import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Button, Text, Image, Modal, Alert, Linking } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabTwoScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef(null);

  // Define handlePermissionRequest before using it
  const handlePermissionRequest = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    if (status !== 'granted') {
      // If permissions are denied, guide the user to enable them from settings
      showAlertToOpenSettings();
    }
  };

  useEffect(() => {
    // Optionally check permissions when the app starts
    handlePermissionRequest(); // Now calling handlePermissionRequest correctly after its definition
  }, []);

  const showAlertToOpenSettings = () => {
    Alert.alert(
      "Camera Permission",
      "Camera permission is needed to take pictures. Please go to your device's settings to enable it.",
      [
        { text: "Don't Allow", style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
      ]
    );
  };

  if (!permission) {
    // Permissions still loading
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!permission.granted) {
    // Permissions not granted
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <Button onPress={handlePermissionRequest} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((currentType) => (currentType === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.scanner} 
        type={type} 
        ref={cameraRef}>
        {/* Camera UI here */}
      </Camera>
      <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
        <Text style={styles.text}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanner: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: "#ffffff90",
    padding: 10,
    borderRadius: 20,
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
});
