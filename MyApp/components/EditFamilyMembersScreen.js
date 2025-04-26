import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    FlatList, StyleSheet, Alert 
} from 'react-native';

const EditFamilyMembersScreen = ({ route, navigation }) => {
    const { userId } = route.params || {}; // Extract userId from route.params
    const [familyMembers, setFamilyMembers] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [relationship, setRelationship] = useState('');

    useEffect(() => {
        console.log("Received userId:", userId); // Debugging
        navigation.setOptions({ title: `Edit Family (User ID: ${userId})` });
    }, [navigation, userId]);

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            try {
                const response = await fetch(`http://192.168.51.89:5000/familyMembers/${userId}`);
                const data = await response.json();
                setFamilyMembers(data);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchFamilyMembers();
        navigation.setOptions({ title: `Edit Family (User ID: ${userId})` });
    }, [navigation, userId]);

    const addMember = async () => {
        if (!name.trim() || !age.trim() || !relationship.trim()) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
    
        if (isNaN(age) || parseInt(age) <= 0) {
            Alert.alert('Error', 'Please enter a valid age');
            return;
        }
    
        const newMember = { resident_id: userId, name, age: parseInt(age), relationship };
    
        try {
            const response = await fetch('http://192.168.51.89:5000/addFamilyMember', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember),
            });
    
            const data = await response.json();
            if (response.ok) {
                setFamilyMembers([...familyMembers, data.member]);
                setName('');
                setAge('');
                setRelationship('');
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add member');
        }
    };

    
    const removeMember = (id) => {
        Alert.alert(
            'Confirm', 
            'Are you sure you want to remove this member?', 
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            await fetch(`http://192.168.51.89:5000/deleteFamilyMember/${id}`, { method: 'DELETE' });
                            setFamilyMembers(familyMembers.filter(member => member.member_id !== id));
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Failed to delete member');
                        }
                    }
                }
            ]
        );
    };
    
    
    
    
    
    return (
        <View style={styles.container}>
            <Text style={styles.userIdText}>User ID: {userId}</Text>
            
            <Text style={styles.header}>Add Family Member</Text>

            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Name" 
                    value={name} 
                    onChangeText={setName} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Age" 
                    value={age} 
                    onChangeText={setAge} 
                    keyboardType="numeric" 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Relationship" 
                    value={relationship} 
                    onChangeText={setRelationship} 
                />
                <TouchableOpacity style={styles.addButton} onPress={addMember}>
                    <Text style={styles.addButtonText}>+ Add Member</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                data={familyMembers}
                keyExtractor={(item) => item.member_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.memberCard}>
                        <Text style={styles.memberText}>
                            {item.name} - {item.relationship} ({item.age})
                        </Text>
                        <TouchableOpacity onPress={() => removeMember(item.id)}>
                            <Text style={styles.deleteButton}>✖</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
    
    userIdText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
    },

    header: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        textAlign: 'center', 
        color: '#333' 
    },
    
    inputContainer: { 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        elevation: 2, 
        marginBottom: 15 
    },
    
    input: { 
        backgroundColor: '#FFF', 
        padding: 12, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#CCC', 
        marginBottom: 10, 
        fontSize: 16 
    },

    addButton: { 
        backgroundColor: '#28A745', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },

    addButtonText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: 'white' 
    },

    memberCard: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: 'white', 
        borderRadius: 8, 
        marginBottom: 10, 
        elevation: 2 
    },

    memberText: { 
        fontSize: 16, 
        color: '#333' 
    },

    deleteButton: { 
        color: 'red', 
        fontSize: 20, 
        fontWeight: 'bold' 
    }
});

export default EditFamilyMembersScreen;
