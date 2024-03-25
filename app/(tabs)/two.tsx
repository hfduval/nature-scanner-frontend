import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Button, Text, Modal, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { GetPresignedURL, UploadToS3, ProcessApi } from '@/functions/Api';

export default function TabTwoScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);
  const [cameraReady, setCameraReady] = useState(false);
  const [recentPhotos, setRecentPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [renderSpeciesInfo, setRenderSpeciesInfo] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false); 

  const takePicture = async () => {
    console.log("Taking picture");
    if (cameraRef.current && cameraReady) {
      try {
        const options = { quality: 0.5, base64: false, exif: false };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data.uri); // Add this line to debug
        setRecentPhotos(currentPhotos => [data.uri, ...currentPhotos]);
      } catch (error) {
         Alert.alert("Error", "Failed to take picture: " + error);
      }
    }
  };

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

  // Function to toggle the preview modal
  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  const uploadImage = async (image: any) => {
    setUploading(true);
    setIsPreviewVisible(false);
    let responseGet = await GetPresignedURL();
    if (!responseGet.success) {
      setUploading(false);
      Alert.alert("Error", "Failed to upload picture");
    } else {
      let responsePut = await UploadToS3(image, responseGet.data.url)
      if (!responsePut.success) {
        Alert.alert("Error", "Failed to upload picture");
      } else {
        processImage(responseGet.data.key);
      }
    }
  }

  const processImage = async (key: any) => {
    let response = await ProcessApi(key);
    if (!response.success) {
      setUploading(false);
      Alert.alert("Error", "Failed to process picture");
    } else {
      setUploading(false);
      setRenderSpeciesInfo(true);
    }
  }

  /** FIXME @FRANCO */
  if (renderSpeciesInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>The animal species is: </Text>
        <Button onPress={() => setRenderSpeciesInfo(false)} title="Animal species page NEEDS FIX" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.scanner} 
        type={type} 
        ref={cameraRef} 
        onCameraReady={() => {
          setCameraReady(true);
        }}>
        <View style={styles.cameraContainer}>
      {/* Flip Camera Button */}
      <TouchableOpacity style={styles.flipCameraButton} onPress={toggleCameraType}>
        <FontAwesome name="refresh" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Take Picture Button */}
      <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
        <View style={styles.innerCircle} />
      </TouchableOpacity>

      {/* Thumbnail for the most recent photo */}
      {recentPhotos.length > 0 && (
        <TouchableOpacity style={styles.thumbnailContainer} onPress={togglePreview}>
          <Image source={{ uri: recentPhotos[0] }} style={styles.thumbnail} />
        </TouchableOpacity>
      )}
    </View>
      </Camera>
      {/* Modal to show the full photo in a preview */}
      {isPreviewVisible && (
        <Modal visible={isPreviewVisible} transparent={true} animationType="slide">
          <View style={styles.previewModal}>
            <TouchableOpacity style={styles.closePreview} onPress={togglePreview}>
              <Text style={{color: 'white', fontSize: 18}}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadPreview} onPress={() => uploadImage(recentPhotos[0])}>
              <Text style={{color: 'white', fontSize: 18}}>Upload</Text>
            </TouchableOpacity>
            <Image source={{ uri: recentPhotos[0] }} style={styles.fullPhoto} />
          </View>
        </Modal>
      )}
      {uploading && (
        <Modal visible={uploading} transparent={false} animationType="fade">
          <View style={styles.previewModal}>
            <ActivityIndicator />
              <Text style={{color: 'white', fontSize: 18, top: 10}}>Uploading...</Text>
          </View>
        </Modal>
      )}
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
  cameraContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 20, // Padding from the left edge of the screen
    right: 20, // Padding from the right edge of the screen
    bottom: 50,
  },
  cameraButton: {
    alignSelf: 'center', // Center the button in the available space
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30, // Half of width/height
    width: 60,
    height: 60,
  },
  flipCameraButton: {
    // Removed position: 'absolute', left, and bottom properties
    borderRadius: 30,
    backgroundColor: "#ffffff90",
    padding: 10,
    // Add size if using FontAwesome icon without text
    width: 50, // Adjust as necessary
    height: 50, // Adjust as necessary
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    // Removed position: 'absolute', right, and bottom properties
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10, // Match container rounding
  },
  previewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closePreview: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  uploadPreview: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  fullPhoto: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  // Additional styles for the close button in the modal if needed
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
});
