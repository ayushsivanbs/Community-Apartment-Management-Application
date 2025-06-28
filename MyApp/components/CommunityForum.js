import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CommunityForum = () => {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([
        { id: '1', author: 'Ashwin', content: 'How do I pay my maintenance bill online?', likes: 5, comments: [] },
        { id: '2', author: 'Jomol', content: 'Is there any event happening this weekend?', likes: 3, comments: [] },
    ]);
    const [newPost, setNewPost] = useState('');

    // Function to add a new post
    const handleAddPost = () => {
        if (newPost.trim() !== '') {
            const newPostData = {
                id: (posts.length + 1).toString(),
                author: 'You',
                content: newPost,
                likes: 0,
                comments: []
            };
            setPosts([newPostData, ...posts]);
            setNewPost('');
        }
    };

    // Function to handle likes
    const handleLike = (id) => {
        setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Community Forum</Text>

            {/* Input to add a new post */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Share something..."
                    value={newPost}
                    onChangeText={setNewPost}
                />
                <TouchableOpacity style={styles.postButton} onPress={handleAddPost}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>

            {/* List of posts */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Avatar.Text size={32} label={item.author[0]} />
                            <Text style={styles.author}>{item.author}</Text>
                        </View>
                        <Text style={styles.content}>{item.content}</Text>
                        <View style={styles.cardFooter}>
                            <TouchableOpacity onPress={() => handleLike(item.id)}>
                                <Text style={styles.likeButton}>👍 {item.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Comments', { post: item })}>
                                <Text style={styles.commentButton}>💬 Comment</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginRight: 10,
    },
    postButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    card: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    author: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    content: {
        fontSize: 14,
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likeButton: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    commentButton: {
        color: '#28a745',
        fontWeight: 'bold',
    },
});

export default CommunityForum;
