import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image, ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

const MaintenanceRequest = ({ route }) => {
    const { userId } = route.params || {};  // Read user ID from navigation params

    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (subject.trim() === '' || description.trim() === '') {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('user_id', userId); // Use the passed user ID
        formData.append('subject', subject);
        formData.append('description', description);
        formData.append('priority', priority);

        media.forEach((file, index) => {
            formData.append(`media`, {
                uri: file.uri,
                type: file.type,
                name: file.fileName || `media_${index}.jpg`
            });
        });

        try {
            const response = await fetch('http://192.168.1.37:5000/maintenance', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const result = await response.json();
            setLoading(false);

            if (result.success) {
                Alert.alert('Success', 'Your maintenance request has been submitted.');
                setSubject('');
                setDescription('');
                setMedia([]);
            } else {
                Alert.alert('Error', result.message || 'Something went wrong.');
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            Alert.alert('Error', 'Failed to submit request.');
        }
    };

    const pickMedia = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'mixed', selectionLimit: 9 - media.length }, (response) => {
            if (!response.didCancel && response.assets) {
                setMedia([...media, ...response.assets]);
            }
        });
    };

    const removeMedia = (index) => {
        setMedia(media.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Maintenance Request</Text>
            
            <Text style={styles.label}>Subject (Max 20 letters)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter subject..."
                maxLength={20}
                value={subject}
                onChangeText={setSubject}
            />
            <Text style={styles.counter}>{subject.length}/20</Text>
            
            <Text style={styles.label}>Detailed Description (Max 200 letters)</Text>
            <TextInput
                style={[styles.input, { minHeight: 125 }]}
                placeholder="Describe the issue..."
                multiline
                maxLength={200}
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.counter}>{description.length}/200</Text>

            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={priority} onValueChange={setPriority}>
                    <Picker.Item label="Low Priority" value="Low" />
                    <Picker.Item label="Medium Priority" value="Medium" />
                    <Picker.Item label="High Priority" value="High" />
                </Picker>
            </View>

            <Text style={styles.label}>Attach Images/Videos (Max 9)</Text>
            <TouchableOpacity style={styles.button} onPress={pickMedia}>
                <Text style={styles.buttonText}>Add Media</Text>
            </TouchableOpacity>
            <Text style={styles.counter}>{media.length}/9</Text>

            <FlatList
                data={media}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.mediaContainer}>
                        <Image source={{ uri: item.uri }} style={styles.media} />
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(index)}>
                            <Text style={styles.removeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Submit Request</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        marginBottom: 5,
    },
    counter: {
        textAlign: 'right',
        fontSize: 12,
        color: 'gray',
        marginBottom: 10,
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    mediaContainer: {
        position: 'relative',
        margin: 5,
    },
    media: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MaintenanceRequest;
