import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const securityAlerts = [
  {
    id: '1',
    type: 'Unauthorized Entry',
    description: 'A person was spotted trying to access Block A without permission.',
    timestamp: '2025-03-25 10:30 AM',
  },
  {
    id: '2',
    type: 'Suspicious Activity',
    description: 'A vehicle has been parked near Gate 3 for an extended period.',
    timestamp: '2025-03-25 12:45 PM',
  },
  {
    id: '3',
    type: 'Fire Alarm Triggered',
    description: 'Fire alarm was triggered in Block C. Fire department notified.',
    timestamp: '2025-03-25 2:15 PM',
  },
];

// Function to determine alert type color
const getAlertColor = (type) => {
  switch (type) {
    case 'Unauthorized Entry': return '#d9534f'; // Red
    case 'Suspicious Activity': return '#f0ad4e'; // Orange
    case 'Fire Alarm Triggered': return '#d9534f'; // Red
    default: return '#0275d8'; // Blue
  }
};

const SecurityAlertsScreen = () => {
  // Optimized renderItem function
  const renderItem = useCallback(({ item }) => (
    <View style={styles.alertCard}>
      <Text style={[styles.alertType, { color: getAlertColor(item.type) }]} accessibilityLabel={`Alert Type: ${item.type}`}>
        {item.type}
      </Text>
      <Text style={styles.alertDescription} accessibilityLabel={`Description: ${item.description}`}>
        {item.description}
      </Text>
      <Text style={styles.timestamp} accessibilityLabel={`Timestamp: ${item.timestamp}`}>
        {item.timestamp}
      </Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Security Alerts</Text>
      <FlatList
        data={securityAlerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No alerts available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertDescription: {
    fontSize: 14,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default SecurityAlertsScreen;
