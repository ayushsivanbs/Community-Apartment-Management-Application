import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ResidentDashboard = ({ route }) => {
    const navigation = useNavigation();
    const { userId } = route.params || {};
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sample User Profile
    const userProfile = {
        name: 'James',
        apartment: 'Apartment 12B',
        profileImage: 'https://www.w3schools.com/howto/img_avatar.png',
    };

    const bills = [
        { id: '1', type: 'Maintenance Fee', amount: '₹2500', dueDate: 'March 25, 2025' },
        { id: '2', type: 'Water Bill', amount: '₹500', dueDate: 'March 30, 2025' },
    ];

    const familyMembers = [
        { id: '1', name: 'Gopika', relation: 'Spouse' },
        { id: '2', name: 'Adi', relation: 'Son' },
    ];

    const quickActions = [
        { id: '1', title: '🛠 Request Maintenance', screen: 'Maintenance' },
        { id: '2', title: '👥 View Visitors', screen: 'Visitors' },
        { id: '3', title: '📞 Contact Management', screen: 'ContactManagement' },
        { id: '4', title: '🚨 Security Alerts', screen: 'SecurityAlertsScreen' },
        { id: '5', title: '💬 Community Forum', screen: 'CommunityForum' },
    ];

      useEffect(() => {
           const fetchAnnouncements = async () => {
               try {
                   const response = await fetch(`http://localhost:5000/announcements?timestamp=${new Date().getTime()}`);
                   if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
       
                   const data = await response.json();
                   setAnnouncements([...data]);
               } catch (error) {
                   console.error('Error fetching announcements:', error);
               } finally {
                   setLoading(false);
               }
           };
       
           fetchAnnouncements(); // Initial fetch
       
           const interval = setInterval(fetchAnnouncements, 1000); // Fetch every 5 seconds
       
           return () => clearInterval(interval); // Cleanup on component unmount
       }, []);

    const sections = [
        { type: 'profile' },
        { type: 'announcements', data: announcements },
        { type: 'bills', data: bills },
        { type: 'family', data: familyMembers },
        { type: 'quickActions', data: quickActions },
    ];

    const renderItem = ({ item }) => {
        if (item.type === 'profile') {
            return (
                <View style={styles.profileContainer}>
                    <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
                    <View>
                        <Text style={styles.profileName}>{userProfile.name}</Text>
                        <Text style={styles.profileApartment}>{userProfile.apartment}</Text>
                    </View>
                </View>
            );
        } else if (item.type === 'announcements') {
            return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📢 Announcements</Text>
                        {loading ? (
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
            );
        } else if (item.type === 'bills') {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Your Bills</Text>
                    {item.data.map((bill) => (
                        <Card key={bill.id} style={styles.card}>
                            <View style={styles.billContainer}>
                                <View>
                                    <Text style={styles.cardTitle}>{bill.type}</Text>
                                    <Text style={styles.cardSubtitle}>Amount: {bill.amount}</Text>
                                    <Text style={styles.cardSubtitle}>Due Date: {bill.dueDate}</Text>
                                </View>
                                <TouchableOpacity
    style={styles.payButton}
    onPress={() => navigation.navigate('PaymentPage', { amount: bill.amount })}
    activeOpacity={0.8}
>
    <Text style={styles.payButtonText}>💳 Pay Now</Text>
</TouchableOpacity>

                            </View>
                        </Card>
                    ))}
                </View>
            );
        }else if (item.type === 'family') {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👨‍👩‍👧‍👦 Family Details</Text>
                    {item.data.map((member) => (
                        <Card key={member.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{member.name}</Text>
                            <Text style={styles.cardSubtitle}>Relation: {member.relation}</Text>
                        </Card>
                    ))}
                </View>
            );
        } else if (item.type === 'quickActions') {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
                    <View style={styles.buttonContainer}>
                        {item.data.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.button}
                                onPress={() => action.screen ? navigation.navigate(action.screen, { userId }) : alert(`${action.title} feature will be implemented soon!`)}
                            >
                                <Text style={styles.buttonText}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }
        return null;
    };

    return (
        <FlatList
            data={sections}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
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
    profileApartment: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    payButton: {
        backgroundColor: '#28a745', // Green color for a positive action
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10, // More rounded
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignSelf: 'flex-start', // Align button properly
        marginTop: 10,
    },
    
    payButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
    },
    noDataText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
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

export default ResidentDashboard;
