import { StyleSheet, Dimensions, ImageBackground } from 'react-native';

import { Text, View } from '@/components/Themed';
import { MonoText } from '@/components/StyledText';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8fA%3D%3D" }}
        style={styles.image}
      >
        <Text style={styles.title}>Discover new animals</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <MonoText style={styles.body}>Snap or upload a photo of an interesting animal</MonoText>
        <MonoText style={styles.body}>you've encountered to learn more.</MonoText>

      </ImageBackground>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    paddingTop: screenHeight * 0.05,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body: {
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    paddingHorizontal: screenWidth * 0.05,
    alignItems: 'center',
  },
});
