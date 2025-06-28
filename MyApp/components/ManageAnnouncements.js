import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, Text, TextInput, FlatList, TouchableOpacity, 
    Alert, ActivityIndicator, StyleSheet 
} from 'react-native';

const API_URL = 'http://localhost:5000/announcements';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            Alert.alert("Error", "Failed to load announcements.");
        }
        setLoading(false);
    };

    const handleSaveAnnouncement = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Title and description cannot be empty.');
            return;
        }

        try {
            let updatedAnnouncements;
            if (editingId) {
                await fetch(`${API_URL}/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });

                updatedAnnouncements = announcements.map(a =>
                    a.announcement_id === editingId ? { ...a, title, description } : a
                );
                setEditingId(null);
            } else {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });

                const newAnnouncement = await response.json();
                updatedAnnouncements = [newAnnouncement, ...announcements];
            }

            setAnnouncements(updatedAnnouncements);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error("Error saving announcement:", error);
            Alert.alert("Error", "Failed to save announcement.");
        }
    };

    const handleEdit = useCallback((item) => {
        setEditingId(item.announcement_id);
        setTitle(item.title);
        setDescription(item.description);
    }, []);

    const handleDelete = useCallback((id) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this announcement?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                        setAnnouncements(prev => prev.filter(a => a.announcement_id !== id));
                    } catch (error) {
                        console.error("Error deleting announcement:", error);
                        Alert.alert("Error", "Failed to delete announcement.");
                    }
                },
                style: 'destructive'
            }
        ]);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Announcements</Text>

            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.textarea}
                multiline
            />

            <TouchableOpacity onPress={handleSaveAnnouncement} style={styles.addButton}>
                <Text style={styles.buttonText}>{editingId ? 'Update Announcement' : 'Add Announcement'}</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <FlatList
                    data={announcements}
                    keyExtractor={(item) => item.announcement_id.toString()}
                    renderItem={({ item }) => (
                        <AnnouncementItem item={item} onEdit={handleEdit} onDelete={handleDelete} />
                    )}
                />
            )}
        </View>
    );
};

const AnnouncementItem = ({ item, onEdit, onDelete }) => (
    <View style={styles.announcementCard}>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementDescription}>{item.description}</Text>
        <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)} style={[styles.actionButton, styles.editButton]}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.announcement_id)} style={[styles.actionButton, styles.deleteButton]}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 10,
        fontSize: 16,
        borderColor: '#ccc',
    },
    textarea: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 10,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
        borderColor: '#ccc',
    },
    addButton: {
        backgroundColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    announcementCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    announcementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    announcementDescription: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    editButton: {
        backgroundColor: '#28A745',
    },
    deleteButton: {
        backgroundColor: '#DC3545',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManageAnnouncements;
