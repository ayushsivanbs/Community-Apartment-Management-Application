import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import ReactNativeBiometrics from 'react-native-biometrics';
import axios from 'axios';

const BiometricsScreen = ({ navigation }) => {
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [fingerprintVerified, setFingerprintVerified] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const rnBiometrics = new ReactNativeBiometrics();

    const authenticate = async () => {
        try {
            const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' });
            if (success) {
                setFingerprintVerified(true);
                sendOtp();
            }
        } catch (error) {
            console.error('Biometric authentication error', error.message);
        }
    };

    const sendOtp = async () => {
        try {
            const response = await axios.post('http://192.168.51.89:5000/send-otp', {
                email: 'community.apartment.app@gmail.com',
            });
            if (response.data.success) {
                setGeneratedOtp(response.data.otp);
                setOtpSent(true);
            }
        } catch (error) {
            console.error('Error sending OTP', error.message);
        }
    };

    const verifyOtp = () => {
        if (otp === generatedOtp) {
            setOtpVerified(true);
            setTimeout(() => {
                alert('Verification Completed!');
                navigation.replace('AdminDashboard');
            }, 2000);
        }
    };

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <View style={styles.container}>
            <IconButton icon="fingerprint" size={80} color="#3498db" />
            <Text style={styles.title}>Verification</Text>
            
            {!fingerprintVerified ? (
                <Text style={styles.statusText}>Checking Fingerprint...</Text>
            ) : (
                <Text style={styles.successText}>Fingerprint Verified ✅</Text>
            )}
            
            {fingerprintVerified && !otpSent && (
                <Text style={styles.statusText}>Sending OTP...</Text>
            )}
            
            {otpSent && !otpVerified && (
                <>
                    <Text style={styles.successText}>OTP Sent to Email ✅</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="numeric"
                        value={otp}
                        onChangeText={setOtp}
                    />
                    <Button mode="contained" onPress={verifyOtp} style={styles.button}>
                        Verify OTP
                    </Button>
                </>
            )}
            
            {otpVerified && <Text style={styles.successText}>Email Verified ✅</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginTop: 20, color: '#333' },
    statusText: { fontSize: 18, color: '#777', marginVertical: 10 },
    successText: { fontSize: 18, color: 'green', marginVertical: 10 },
    button: { marginTop: 20, backgroundColor: '#3498db', paddingHorizontal: 20 },
    input: { borderWidth: 1, padding: 10, margin: 10, width: 200, textAlign: 'center', backgroundColor: '#fff' },
});

export default BiometricsScreen;