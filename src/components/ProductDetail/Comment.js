import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MAX_COMMENT_LENGTH = 100;

const Comment = ({ comments, isLoggedIn, onPostComment, onEditComment, onDeleteComment, onReplyComment }) => {
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (newComment.trim().length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bình luận.');
      return;
    }
    if (newComment.length > MAX_COMMENT_LENGTH) {
      Alert.alert('Lỗi', `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự.`);
      return;
    }
    onPostComment(newComment);
    setNewComment('');
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentAuthor}>{item.username}</Text>
        <Text style={styles.commentContent}>{item.content}</Text>
        <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
    
      {isLoggedIn && (
        <View style={styles.commentActions}>
          <TouchableOpacity onPress={() => onEditComment(item.id, item.content)}>
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeleteComment(item.id)}>
            <Text style={styles.actionText}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onReplyComment(item.id)}>
            <Text style={styles.actionText}>Trả lời</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bình luận</Text>
      {comments.length === 0 ? (
        <Text style={styles.noComments}>Chưa có bình luận</Text>
      ) : (
<FlatList
    data={comments}
    renderItem={renderCommentItem}
    keyExtractor={(item) => item.userId.toString()}
/>

      )}
      {isLoggedIn && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập bình luận của bạn..."
            value={newComment}
            onChangeText={setNewComment}
            maxLength={MAX_COMMENT_LENGTH}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handlePostComment}>
            <Ionicons name="send" size={24} color="#0035FF" />
          </TouchableOpacity>
        </View>
      )}
      {!isLoggedIn && (
        <Text style={styles.loginPrompt}>Đăng nhập để bình luận</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noComments: {
    fontStyle: 'italic',
    color: '#666',
  },
  commentItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentContent: {
    marginBottom: 5,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionText: {
    color: '#0035FF',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
  loginPrompt: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
  },
});

export default Comment;