import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Card, Modal, Portal, Button, Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ManageResidents = () => {
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [apartment, setApartment] = useState('');
    const [contact, setContact] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
const [selectedResident, setSelectedResident] = useState(null);


    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://192.168.51.89:5000/profiles');
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResidents = async () => {
        try {
            const response = await fetch('http://192.168.51.89:5000/residents');
            const data = await response.json();
            setResidents(data);
        } catch (error) {
            console.error('Error fetching residents:', error);
        }
    };

    const addResident = async () => {
        if (!selectedProfile || !apartment || !contact) {
            alert('Please enter all details');
            return;
        }

        const newResident = {
            user_id: selectedProfile.user_id,
            full_name: selectedProfile.full_name,
            apartment,
            contact_number: contact,
        };

        try {
            const response = await fetch('http://192.168.51.89:5000/residents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResident),
            });

            if (!response.ok) {
                throw new Error('Failed to add resident');
            }

            const addedResident = await response.json();
            setResidents([...residents, addedResident]);
            setProfileModalVisible(false);
            setSelectedProfile(null);
            setApartment('');
            setContact('');
        } catch (error) {
            console.error('Error adding resident:', error);
        }
    };

    const removeResident = async (userId) => {
        try {
            const response = await fetch(`http://192.168.51.89:5000/residents/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove resident');
            }

            setResidents(residents.filter(resident => resident.user_id !== userId));
        } catch (error) {
            console.error('Error removing resident:', error);
        }
    };

    const isAlreadyAdded = (userId) => {
        return residents.some(resident => resident.user_id === userId);
    };
    const openViewModal = (resident) => {
        setSelectedResident(resident);
        setViewModalVisible(true);
    };
    
    return (
        <Provider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>🏠 Manage Residents</Text>
                
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    fetchProfiles();
                    setProfileModalVisible(true);
                }}>
                    <Text style={styles.addButtonText}>➕ Add Resident</Text>
                </TouchableOpacity>

                <FlatList
                    data={residents}
                    keyExtractor={(item) => item.user_id.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.name}>{item.full_name}</Text>
                                <Text style={styles.details}>Apartment: {item.apartment}</Text>
                                <Text style={styles.details}>Contact: {item.contact_number}</Text>
                                <View style={styles.buttonContainer}>
                                <Button mode="contained" onPress={() => openViewModal(item)} style={styles.viewButton}>👁️ View</Button>

                                    <Button mode="contained" onPress={() => removeResident(item.user_id)} style={styles.removeButton}>❌ Remove</Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                />

                <Portal>
                    <Modal visible={profileModalVisible} onDismiss={() => setProfileModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>🆕 Select a Profile</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#007bff" />
                        ) : (
                            <FlatList
                                data={profiles}
                                keyExtractor={(item) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.profileItem,
                                            selectedProfile?.user_id === item.user_id && styles.selectedProfile
                                        ]}
                                        onPress={() => {
                                            if (!isAlreadyAdded(item.user_id)) {
                                                setSelectedProfile(item);
                                            }
                                        }}>
                                        <View style={styles.profileTextContainer}>
                                            <Text style={styles.profileText}>{item.full_name}</Text>
                                            {isAlreadyAdded(item.user_id) && (
                                                <Text style={styles.alreadyAdded}>✔️ Already Added</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        {selectedProfile && !isAlreadyAdded(selectedProfile.user_id) && (
                            <View style={styles.inputContainer}>
                                <Text style={styles.selectedUserText}>👤 Selected: {selectedProfile.full_name}</Text>
                                <TextInput
                                    placeholder="Apartment Number"
                                    style={styles.input}
                                    value={apartment}
                                    onChangeText={setApartment}
                                />
                                <TextInput
                                    placeholder="Contact Number"
                                    style={styles.input}
                                    value={contact}
                                    keyboardType="numeric"
                                    onChangeText={setContact}
                                />
                                <Button mode="contained" onPress={addResident} style={styles.modalButton}>
                                    ✅ Add Resident
                                </Button>
                            </View>
                        )}
                        <Button mode="outlined" onPress={() => setProfileModalVisible(false)} style={styles.closeButton}>
                            ❌ Close
                        </Button>
                    </Modal>
                </Portal>
                <Portal>
    <Modal visible={viewModalVisible} onDismiss={() => setViewModalVisible(false)} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>👁️ View Resident Details</Text>
        {selectedResident && (
            <View>
                <Text style={styles.details}>Name: {selectedResident.full_name}</Text>
                <Text style={styles.details}>Apartment: {selectedResident.apartment}</Text>
                <Text style={styles.details}>Contact: {selectedResident.contact_number}</Text>
            </View>
        )}
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditRentalAgreementScreen',{ userId: selectedResident.user_id })}>
            <Text style={styles.optionText}>📜 Rental Agreement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditFamilyMembersScreen',{ userId: selectedResident.user_id })}>
            <Text style={styles.optionText}>👨‍👩‍👧‍👦 Family Members</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => alert('Payments')}>
            <Text style={styles.optionText}>💳 Payments</Text>
        </TouchableOpacity>
        <Button mode="outlined" onPress={() => setViewModalVisible(false)} style={styles.closeButton}>
            ❌ Close
        </Button>
    </Modal>
</Portal>
            </SafeAreaView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
    header: { fontSize: 22, fontWeight: 'bold', color: '#007bff', marginBottom: 15, textAlign: 'center' },
    addButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    card: { padding: 15, marginVertical: 6, backgroundColor: 'white', borderRadius: 10, elevation: 3 },
    name: { fontSize: 18, fontWeight: 'bold' },
    details: { fontSize: 14, color: '#666', marginTop: 2 },
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#007bff' },
    profileItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', width: '100%', alignItems: 'center' },
    profileTextContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    profileText: { fontSize: 16 },
    alreadyAdded: { fontSize: 14, color: 'red', fontWeight: 'bold' },
    selectedProfile: { backgroundColor: '#e0f7fa', borderRadius: 5 },
    inputContainer: { width: '100%', marginTop: 15 },
    selectedUserText: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, width: '100%' },
    modalButton: { backgroundColor: '#28a745', marginTop: 10 },
    closeButton: { marginTop: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    viewButton: { backgroundColor: '#007bff' },
    removeButton: { backgroundColor: '#dc3545' },
    optionButton: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        marginTop: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: 'bold',
    },
    
});

export default ManageResidents;
