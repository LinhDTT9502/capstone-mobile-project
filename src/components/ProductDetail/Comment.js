import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MAX_COMMENT_LENGTH = 100;

const Comment = ({
  comments,
  isLoggedIn,
  onPostComment,
  onEditComment,
  onDeleteComment,
  onReplyComment,
  loadMoreComments, // Function to load more comments
}) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostComment = () => {
    if (newComment.trim().length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận.");
      return;
    }
    if (newComment.length > MAX_COMMENT_LENGTH) {
      Alert.alert(
        "Lỗi",
        `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự.`
      );
      return;
    }
    onPostComment(newComment);
    setNewComment("");
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{item.username}</Text>
        <Text style={styles.commentDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
      {isLoggedIn && (
        <View style={styles.commentActions}>
          <TouchableOpacity
            onPress={() => onEditComment(item.id, item.content)}
            style={styles.actionButton}
          >
            <Ionicons name="pencil-outline" size={16} color="#0035FF" />
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeleteComment(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={16} color="#0035FF" />
            <Text style={styles.actionText}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onReplyComment(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="return-up-back-outline" size={16} color="#0035FF" />
            <Text style={styles.actionText}>Trả lời</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleLoadMore = async () => {
    if (!loading) {
      setLoading(true);
      await loadMoreComments(); // Fetch the next page of comments
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bình luận</Text>
      {comments.length === 0 ? (
        <Text style={styles.noComments}>Chưa có bình luận</Text>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          style={styles.commentList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="small" color="#0035FF" />
            ) : null
          }
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
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handlePostComment}
          >
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
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#050505",
  },
  noComments: {
    fontStyle: "italic",
    color: "#65676B",
  },
  commentList: {
    maxHeight: 400, // Increased maxHeight to accommodate more comments
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#050505",
  },
  commentDate: {
    fontSize: 12,
    color: "#65676B",
  },
  commentContent: {
    marginBottom: 8,
    color: "#050505",
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionText: {
    color: "#0035FF",
    marginLeft: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  loginPrompt: {
    fontStyle: "italic",
    color: "#65676B",
    marginTop: 16,
    textAlign: "center",
  },
});

export default Comment;
