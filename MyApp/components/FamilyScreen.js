import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const FamilyScreen = ({ route }) => {
    const { resident } = route.params;
    const { familyMembers } = resident;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👨‍👩‍👧‍👦 {resident.name}'s Family Members</Text>
            {familyMembers && familyMembers.length > 0 ? (
                <FlatList
                    data={familyMembers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <Text style={styles.memberName}>{item.name}</Text>
                            <Text>Relation: {item.relation}</Text>
                            <Text>Age: {item.age}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>No family members found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    memberCard: { padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0', borderRadius: 5 },
    memberName: { fontSize: 18, fontWeight: 'bold' },
});

export default FamilyScreen;