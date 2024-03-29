import React, { useState } from 'react';
import { View, TouchableOpacity,  Image, StyleSheet } from 'react-native';
import {Camera, CameraType, FlashMode} from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Scanner = () => {
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [recentPictureUri, setRecentPictureUri] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState(false);

  const toggleCameraType = () => {
    setType(
        type === CameraType.back
            ? CameraType.front
            : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(
        flashMode === FlashMode.on
            ? FlashMode.off
            : FlashMode.on
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const picture = await cameraRef.current.takePictureAsync();
      setRecentPictureUri(picture.uri);
    }
  };

  let cameraRef = React.useRef<Camera>(null);

  return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} flashMode={flashMode} zoom={zoom} ref={cameraRef}>
          <View style={styles.buttonContainer}>

            {/* Toggle Camera Type */}
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <MaterialCommunityIcons name="camera-flip-outline" size={24} color="white" />
            </TouchableOpacity>

            {/* Take Picture */}
            <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
              <MaterialCommunityIcons name="camera-iris" size={48} color="white" />
            </TouchableOpacity>

            {/* Toggle Flash */}
            <TouchableOpacity style={styles.button} onPress={toggleFlash}>
              <MaterialCommunityIcons name="flash" size={24} color="white" />
            </TouchableOpacity>

            {/* Gallery Thumbnail */}
            {recentPictureUri && (
              <View>
                {!viewImage &&
                  <TouchableOpacity
                    onPress={() => setViewImage(true)}
                  >
                    <Image
                      source={{ uri: recentPictureUri }}
                      style={styles.thumbnail}
                    />
                  </TouchableOpacity>
                }
              </View>
            )}
          </View>
        </Camera>
        {viewImage && recentPictureUri &&
          <View style={styles.fullscreen}>
            <Image
              source={{ uri: recentPictureUri }}
              style={styles.fullscreen}
            />
          </View>
        }
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  takePictureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  fullscreen: {
    height: '100%',
    width: '100%',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default Scanner;
