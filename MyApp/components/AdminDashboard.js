import React, { useEffect, useState } from 'react';
import { 
    View, Text, FlatList, TouchableOpacity, StyleSheet, Image, 
    Alert, ActivityIndicator 
} from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
    const navigation = useNavigation();
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`http://192.168.51.89:5000/announcements?timestamp=${new Date().getTime()}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setAnnouncements([...data]);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoadingAnnouncements(false);
            }
        };

        const fetchMaintenanceRequests = async () => {
            try {
                const response = await fetch('http://192.168.51.89:5000/maintenance-requests');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    console.error("Invalid maintenance data format:", data);
                    return;
                }
        
                // Map data to the correct format
                const formattedData = data.map((item) => ({
                    id: item.request_id,         // Change request_id to id
                    resident: item.user_id,      // Map user_id to resident
                    issue: item.subject,         // Use subject for issue
                    priority: item.priority,     // Add priority field
                    status: item.status,         // Keep status same
                }));
        
                console.log('Maintenance Requests:', formattedData); // Debugging
        
                setMaintenanceRequests(formattedData); // Show all requests
            } catch (error) {
                console.error('Error fetching maintenance requests:', error);
            } finally {
                setLoadingRequests(false);
            }
        };
        
        fetchAnnouncements();
        fetchMaintenanceRequests();

        const interval = setInterval(() => {
            fetchAnnouncements();
            fetchMaintenanceRequests();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const adminProfile = {
        name: 'Admin',
        role: 'Community Manager',
        profileImage: 'https://www.w3schools.com/howto/img_avatar.png',
    };

    const payments = [
        { id: '1', resident: 'John Doe', amount: '₹2500', status: 'Paid' },
        { id: '2', resident: 'Jane Smith', amount: '₹500', status: 'Pending' },
    ];

    const handleQuickAction = () => {
        Alert.alert('Coming Soon', 'This feature will be implemented later.');
    };

    return (
        <FlatList
            data={[]}
            ListHeaderComponent={
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <Image source={{ uri: adminProfile.profileImage }} style={styles.profileImage} />
                        <View>
                            <Text style={styles.profileName}>{adminProfile.name}</Text>
                            <Text style={styles.profileRole}>{adminProfile.role}</Text>
                        </View>
                    </View>

                    {announcements.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📢 Announcements</Text>
                            {loadingAnnouncements ? (
                                <ActivityIndicator size="large" color="#007bff" />
                            ) : (
                                <FlatList
                                    data={announcements}
                                    keyExtractor={(item) => item.announcement_id.toString()}
                                    nestedScrollEnabled={true}
                                    renderItem={({ item }) => (
                                        <Card style={styles.card}>
                                            <Text style={styles.cardTitle}>{item.title}</Text>
                                            <Text style={styles.cardSubtitle}>{item.description}</Text>
                                        </Card>
                                    )}
                                />
                            )}
                        </View>
                    )}
                
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🛠 Maintenance Requests</Text>
                        {loadingRequests ? (
                            <ActivityIndicator size="large" color="#007bff" />
                        ) : maintenanceRequests.length === 0 ? (
                            <Text style={styles.noDataText}>No maintenance requests available.</Text>
                        ) : (
                            <FlatList
                                data={maintenanceRequests}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <Card style={styles.card}>
                                        <Text style={styles.cardTitle}>Resident Id: {item.resident}</Text>
                                        <Text style={styles.cardSubtitle}>Issue: {item.issue}</Text>
                                        <Text style={styles.cardSubtitle}>Status: {item.status}</Text>
                                    </Card>
                                )}
                            />
                        )}
                    </View>
               

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💳 Payments</Text>
                        <FlatList
                            data={payments}
                            keyExtractor={(item) => item.id}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <Card style={styles.card}>
                                    <Text style={styles.cardTitle}>{item.resident}</Text>
                                    <Text style={styles.cardSubtitle}>Amount: {item.amount}</Text>
                                    <Text style={styles.cardSubtitle}>Status: {item.status}</Text>
                                </Card>
                            )}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageResidents')}>
                                <Text style={styles.buttonText}>🏠 Manage Residents</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageAnnouncements')}>
                                <Text style={styles.buttonText}>📢 Manage Announcements</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewComplaints')}>
                                <Text style={styles.buttonText}>📑 View Complaints</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleQuickAction}>
                                <Text style={styles.buttonText}>💳 Manage Payments</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SecurityLogsScreen')}>
                                <Text style={styles.buttonText}>🚨 Security Logs</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
        />
    );
    
};
// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileRole: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
    },
    card: {
        padding: 15,
        marginVertical: 6,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
export default AdminDashboard;