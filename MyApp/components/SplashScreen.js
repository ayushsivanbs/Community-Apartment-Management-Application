import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../assets/Loading.json';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 6200); // Wait for 5 seconds before navigating

    return () => clearTimeout(timer); // Cleanup timer when unmounting
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView 
        source={loadingAnimation}
        autoPlay
        loop={true} // Keep looping in case animation is shorter than 5s
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default SplashScreen;
