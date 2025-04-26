import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ResidentListScreen = ({ navigation }) => {
    const residents = [
        { id: '1', name: 'John Doe', apartment: 'A101', contact: '1234567890' },
        { id: '2', name: 'Jane Smith', apartment: 'B202', contact: '9876543210' }
    ];

    return (
        <View style={styles.container}>
            <FlatList 
                data={residents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.item} 
                        onPress={() => navigation.navigate('EditResidentScreen', { resident: item })}
                    >
                        <Text style={styles.text}>{item.name} - {item.apartment}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    text: { fontSize: 18 }
});

export default ResidentListScreen;
