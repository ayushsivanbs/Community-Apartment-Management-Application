import React, { useEffect, useState } from 'react';
import { 
    View, Text, FlatList, ActivityIndicator, 
    StyleSheet, Alert, TouchableOpacity 
} from 'react-native';
import { Card } from 'react-native-paper';
import moment from 'moment'; // For better date formatting

const SecurityLogsScreen = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    // Dummy data to simulate fetch for testing
    const dummyLogs = [
        {
            id: 1,
            event: 'User Login',
            date: '2025-04-02',
            time: '08:30 AM',
            user: 'admin',
        },
        {
            id: 2,
            event: 'Password Change',
            date: '2025-04-02',
            time: '09:45 AM',
            user: 'johndoe',
        },
        {
            id: 3,
            event: 'Failed Login Attempt',
            date: '2025-04-02',
            time: '10:15 AM',
            user: 'guest',
        },
        {
            id: 4,
            event: 'User Logout',
            date: '2025-04-02',
            time: '11:00 AM',
            user: 'admin',
        },
        {
            id: 5,
            event: 'Security Alert: Suspicious Activity',
            date: '2025-04-02',
            time: '02:20 PM',
            user: 'system',
        },
    ];

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);

        // Simulating API call delay with dummy data
        setTimeout(() => {
            // Replace with actual fetch logic in production
            setLogs(dummyLogs);
            setLoading(false);
        }, 1500);
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card} elevation={3}>
            <Card.Content>
                <Text style={styles.title}>{item.event}</Text>
                <Text style={styles.details}>📅 Date: {moment(item.date).format('LL')}</Text>
                <Text style={styles.details}>⏰ Time: {item.time}</Text>
                <Text style={styles.details}>👤 User: {item.user}</Text>
            </Card.Content>
        </Card>
    );

    const handleRetry = () => {
        fetchLogs();
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200ea" />
                    <Text style={styles.loadingText}>Loading security logs...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : logs.length > 0 ? (
                <FlatList
                    data={logs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={styles.noDataText}>No security logs available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F7FA',
    },
    card: {
        marginBottom: 12,
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 8,
        elevation: 3, // Adds shadow for better UI
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    details: {
        fontSize: 14,
        color: '#555',
        marginBottom: 3,
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    loadingText: {
        marginTop: 10,
        color: '#6200ea',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SecurityLogsScreen;
