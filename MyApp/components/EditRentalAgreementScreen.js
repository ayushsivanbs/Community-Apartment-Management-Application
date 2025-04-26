import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const EditRentalAgreementScreen = ({ route }) => {
    const userId = route?.params?.userId;
    const [agreement, setAgreement] = useState(null);
    const [residentName, setResidentName] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!userId) {
            Alert.alert("Error", "User ID is missing.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [agreementResponse, residentResponse] = await Promise.all([
                    fetch('http://192.168.51.89:5000/rental-agreements/${userId}'),
                    fetch('http://192.168.51.89:5000/residents/${userId}')
                ]);
                
                if (agreementResponse.ok) {
                    const agreementData = await agreementResponse.json();
                    setAgreement(agreementData);
                } else {
                    setAgreement({});
                }

                if (residentResponse.ok) {
                    const residentData = await residentResponse.json();
                    setResidentName(residentData.name || "");
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch data.");
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleUpdate = async () => {
        if (!agreement) return;

        try {
            const response = await fetch('http://192.168.51.89:5000/rental-agreements/${agreement.id}', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agreement)
            });
            
            if (response.ok) {
                Alert.alert("Success", "Rental agreement updated successfully.");
                setIsEditing(false);
            } else {
                throw new Error("Failed to update agreement.");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
            console.error("Update Error:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rental Agreement</Text>
            <Text style={styles.label}>Resident Name:</Text>
            <TextInput style={styles.input} value={residentName} editable={false} />

            {agreement && (
                <>
                    <Text style={styles.label}>Monthly Rent:</Text>
                    <TextInput 
                        style={styles.input} 
                        value={String(agreement.monthly_rent || '')} 
                        onChangeText={(text) => setAgreement({ ...agreement, monthly_rent: parseFloat(text) || 0 })} 
                        keyboardType="numeric" 
                        editable={isEditing} 
                    />

                    <Text style={styles.label}>Security Deposit:</Text>
                    <TextInput 
                        style={styles.input} 
                        value={String(agreement.security_deposit || '')} 
                        onChangeText={(text) => setAgreement({ ...agreement, security_deposit: parseFloat(text) || 0 })} 
                        keyboardType="numeric" 
                        editable={isEditing} 
                    />

                    <Text style={styles.label}>Notice Period (Days):</Text>
                    <TextInput 
                        style={styles.input} 
                        value={String(agreement.notice_period || '')} 
                        onChangeText={(text) => setAgreement({ ...agreement, notice_period: parseInt(text) || 0 })} 
                        keyboardType="numeric" 
                        editable={isEditing} 
                    />

                    {!isEditing ? (
                        <Button title="Edit" onPress={() => setIsEditing(true)} />
                    ) : (
                        <Button title="Save Changes" onPress={handleUpdate} />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: '#fff' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 18, color: 'red' }
});

export default EditRentalAgreementScreen;