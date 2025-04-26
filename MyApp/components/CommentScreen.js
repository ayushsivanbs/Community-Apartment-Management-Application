import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommentScreen = ({ route }) => {
    const { post } = route.params; // Receive post data

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Comments for: {post.content}</Text>
            <Text style={styles.message}>No comments yet! Be the first to comment.</Text>
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        color: 'gray',
    },
});

export default CommentScreen;
