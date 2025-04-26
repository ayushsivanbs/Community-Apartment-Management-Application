import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { openGooglePay } from './Payment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentPage = () => {
  const route = useRoute();
  const { amount } = route.params || { amount: 100 }; // Default amount if not passed

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: 20 }}>
      <View style={{ backgroundColor: 'white', padding: 25, borderRadius: 15, width: '90%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 }}>
        <Icon name="currency-inr" size={50} color="#333" style={{ marginBottom: 10 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
          Payment Summary
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#555', marginBottom: 10 }}>
          {amount}
        </Text>
        <View style={{ width: '100%', height: 1, backgroundColor: '#ddd', marginVertical: 10 }}></View>
        <Text style={{ fontSize: 16, color: '#777', textAlign: 'center' }}>
          Secure UPI payment with instant confirmation
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => openGooglePay(amount)}
        style={{
          backgroundColor: '#008D4C',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 30,
          borderRadius: 12,
          marginTop: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Icon name="bank-transfer" size={24} color="white" style={{ marginRight: 10 }} />
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          Pay {amount} via UPI
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentPage;