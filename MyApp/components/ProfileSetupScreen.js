import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Buffer } from 'buffer';

const ProfileSetupScreen = ({ route, navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const { userId } = route.params;

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,  // Include base64 data
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        const source = response.assets[0].uri;
        const base64Image = `data:image/jpeg;base64,${response.assets[0].base64}`;
  
        setSelectedImage({ uri: source });
        setProfilePicture(base64Image); // Store the image as Base64
      }
    });
  };
  
  const handleSubmit = async () => {
    if (!email || !fullName || !dob || !gender || !phone) {
      Alert.alert('Error', 'Please fill all the required fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('phone', phone);
  
    // Append image only if selected
    if (profilePicture) {
      formData.append('profile_picture', {
        uri: profilePicture,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }


    try {
  

      const response = await fetch('http://192.168.51.89:5000/setup-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' }, 
        body: formData,
      });
  
      const responseData = await response.json();
      console.log('Response:', responseData);
  
      if (response.status === 200) {
        Alert.alert('Success', 'Profile setup successfully!');
      } else {
        Alert.alert('Error', responseData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', 'Unable to save profile. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.formcontainer}>
        <Text style={styles.title}>Set Up Your Profile</Text>

        <TouchableOpacity style={styles.profilePic} onPress={selectImage}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.profilePicImage} />
          ) : (
            <Image source={require('../assets/jjjj.png')} style={styles.cameraIcon} />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Email<Text style={styles.required}>*</Text></Text>
        <TextInput style={styles.input} placeholder="Enter email" value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Full Name<Text style={styles.required}>*</Text></Text>
        <TextInput style={styles.input} placeholder="Enter full name" value={fullName} onChangeText={setFullName} />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Date of Birth<Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Gender<Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Select" value={gender} onChangeText={setGender} />
          </View>
        </View>

        <Text style={styles.label}>Phone Number<Text style={styles.required}>*</Text></Text>
        <TextInput style={styles.input} placeholder="Enter phone number" value={phone} onChangeText={setPhone} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  formcontainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profilePicImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  cameraIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputContainer: {
    width: '48%',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6B6FB9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProfileSetupScreen;
