import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const EditResidentScreen = ({ route, navigation }) => {
    const { resident } = route.params;
    const [fullName, setFullName] = useState(resident.full_name);
    const [phone, setPhone] = useState(resident.phone_number);
    const [apartment, setApartment] = useState(resident.apartment_number);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/residents/${resident.resident_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    phone_number: phone,
                    apartment_number: apartment
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Resident details updated.');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update resident details.');
            }
        } catch (error) {
            console.error('Error updating resident:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>✏️ Edit Resident</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <Text style={styles.label}>Apartment Number</Text>
            <TextInput style={styles.input} value={apartment} onChangeText={setApartment} />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5 },
    saveButton: { marginTop: 20, padding: 15, backgroundColor: '#4CAF50', borderRadius: 5, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
});

export default EditResidentScreen;
