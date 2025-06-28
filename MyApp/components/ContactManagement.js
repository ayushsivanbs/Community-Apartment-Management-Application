import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Linking, Alert } from 'react-native';
import { Card } from 'react-native-paper';

const ContactManagement = () => {
    const [issue, setIssue] = useState('');
    const [details, setDetails] = useState('');

    // Sample contact data
    const contacts = [
        { id: '1', name: 'Apartment Manager', phone: '9876543210', email: 'manager@example.com' },
        { id: '2', name: 'Maintenance Team', phone: '9123456789', email: 'maintenance@example.com' },
        { id: '3', name: 'Security Guard', phone: '9012345678', email: 'security@example.com' },
        { id: '4', name: 'Emergency Services', phone: '100', email: 'emergency@example.com' },
    ];

    // Function to handle calling
    const handleCall = (phone) => {
        Linking.openURL(`tel:${phone}`);
    };

    // Function to handle emailing
    const handleEmail = (email) => {
        Linking.openURL(`mailto:${email}`);
    };

    // Function to submit complaint
    const handleSubmitComplaint = () => {
        if (!issue || !details) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        Alert.alert('Complaint Submitted', 'Your complaint has been sent to management.');
        setIssue('');
        setDetails('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Contact Management</Text>

            {/* Contact List */}
            <Text style={styles.sectionTitle}>Important Contacts</Text>
            <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text>📞 {item.phone}</Text>
                        <Text>📧 {item.email}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}>
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.emailButton} onPress={() => handleEmail(item.email)}>
                                <Text style={styles.buttonText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                )}
            />
 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    card: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    callButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    emailButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    chatButton: {
        backgroundColor: '#6c757d',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ContactManagement;
