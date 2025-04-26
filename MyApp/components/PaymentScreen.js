import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentsScreen = ({ route }) => {
    const { resident } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>💰 {resident.name}'s Payments</Text>
            <Text>Payment history will be displayed here...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default PaymentsScreen;
