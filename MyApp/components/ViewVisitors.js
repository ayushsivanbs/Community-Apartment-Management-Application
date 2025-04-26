import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';

const ViewVisitors = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [visitors, setVisitors] = useState([
        { id: '1', name: 'John Doe', purpose: 'Meeting', entryTime: '10:30 AM' },
        { id: '2', name: 'Alice Smith', purpose: 'Delivery', entryTime: '11:15 AM' },
        { id: '3', name: 'Robert Brown', purpose: 'Guest', entryTime: '12:00 PM' },
    ]);

    // Filter visitors based on search query
    const filteredVisitors = visitors.filter(visitor => 
        visitor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to add a new visitor
    const addVisitor = useCallback(() => {
        const newVisitor = {
            id: (visitors.length + 1).toString(),
            name: `Visitor ${visitors.length + 1}`,
            purpose: 'New Entry',
            entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setVisitors(prevVisitors => [...prevVisitors, newVisitor]);
    }, [visitors]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Visitor Log</Text>

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search visitors..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Visitor List */}
            <FlatList
                data={filteredVisitors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Avatar.Text size={40} label={item.name[0]} />
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.details}>Purpose: {item.purpose}</Text>
                                <Text style={styles.details}>Entry Time: {item.entryTime}</Text>
                            </View>
                        </View>
                    </Card>
                )}
            />

            {/* Add Visitor Button */}
            <TouchableOpacity style={styles.addButton} onPress={addVisitor}>
                <Text style={styles.addButtonText}>+ Add Visitor</Text>
            </TouchableOpacity>
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
        marginBottom: 10,
        textAlign: 'center',
    },
    searchInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    card: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2, // Adds shadow effect
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: 'gray',
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ViewVisitors;
