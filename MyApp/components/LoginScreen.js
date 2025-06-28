import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLoginPress = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
  
      console.log('API Response:', response.data);
  
      if (response.data?.success) {
        const { role, user_id } = response.data;
  
        if (role === 'admin') {
          navigation.navigate('Biometrics');
        } else if (role === 'user') {
          navigation.navigate('Dashboard', { userId: user_id });
        } else if (role === 'puser') {
          navigation.navigate('ProfileSetup', { userId: user_id }); // Pass user_id
        }
      } else {
        Alert.alert('Login Failed', response.data?.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login Error:', error);
  
      if (error.response) {
        console.error('Error Response:', error.response.data);
        Alert.alert('Login Failed', error.response.data?.message || 'Server error occurred');
      } else if (error.request) {
        console.error('No response from server');
        Alert.alert('Login Failed', 'Unable to reach the server. Check your connection.');
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred');
      }
    }
  };
  
  
  

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Login</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPasswordPress}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={styles.signUp}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  formContainer: {
    width: '90%',
    maxWidth: 350,
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6B6FB9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#6B6FB9',
    textDecorationLine: 'underline',
    fontWeight: '500',
    marginTop: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#555',
  },
  signUp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B6FB9',
    textDecorationLine: 'underline',
  },
});

export default App;
