import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContractScreen = ({ route }) => {
    const { resident } = route.params;
    return (
        <View style={styles.container}>
            <View style={styles.contractBox}>
                <Text style={styles.title}>Rental Agreement</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Resident Information</Text>
                    <Text style={styles.text}><Text style={styles.label}>Name:</Text> {resident.name}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Age:</Text> {resident.age}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Sex:</Text> {resident.sex}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Phone Number:</Text> {resident.phoneNumber}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Email:</Text> {resident.email}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Address:</Text> {resident.address}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Financial Terms</Text>
                    <Text style={styles.text}><Text style={styles.label}>Monthly Rent:</Text> {resident.rentAmount}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Security Deposit:</Text> {resident.securityDeposit}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. House Rules</Text>
                    <Text style={styles.text}><Text style={styles.label}>Quiet Hours:</Text> {resident.quietHours}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Guest Policy:</Text> {resident.guestPolicy}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Exit Terms</Text>
                    <Text style={styles.text}><Text style={styles.label}>Notice Period:</Text> {resident.noticePeriod}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f4f4f4' },
    contractBox: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase' },
    section: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
    text: { fontSize: 16, marginVertical: 4, color: '#555' },
    label: { fontWeight: 'bold', color: '#222' },
});

export default ContractScreen;