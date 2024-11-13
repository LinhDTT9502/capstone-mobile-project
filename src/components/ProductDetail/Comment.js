import React, { useState, useEffect } from "react";
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
const INITIAL_COMMENT_COUNT = 5;
const LOAD_MORE_COUNT = 3;

const Comment = ({
  comments,
  isLoggedIn,
  onPostComment,
  onEditComment,
  onDeleteComment,
  onReplyComment,
  loadMoreComments,
  currentUserId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedComments, setDisplayedComments] = useState(
    comments.slice(0, INITIAL_COMMENT_COUNT)
  );
  useEffect(() => {
    setDisplayedComments(comments.slice(0, INITIAL_COMMENT_COUNT));
  }, [comments]);

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

  const renderCommentItem = ({ item }) => {
    const isOwner = item.userId === currentUserId;
    return (
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
            {/* Display "Sửa" and "Xóa" only if the user owns the comment */}
            {isOwner && (
              <>
                <TouchableOpacity
                  onPress={() => onEditComment(item.id, item.content)}
                  style={styles.actionButton}
                >
                  <Ionicons name="pencil-outline" size={16} color="#007AFF" />
                  <Text style={styles.actionText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDeleteComment(item.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#007AFF" />
                  <Text style={styles.actionText}>Xóa</Text>
                </TouchableOpacity>
              </>
            )}
            {/* Display "Trả lời" for all logged-in customers */}
            <TouchableOpacity
              onPress={() => onReplyComment(item.id)}
              style={styles.actionButton}
            >
              <Ionicons
                name="return-up-back-outline"
                size={16}
                color="#007AFF"
              />
              <Text style={styles.actionText}>Trả lời</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleLoadMore = async () => {
    if (!loading) {
      setLoading(true);
      await loadMoreComments();
      const newDisplayedComments = comments.slice(
        0,
        displayedComments.length + LOAD_MORE_COUNT
      );
      setDisplayedComments(newDisplayedComments);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bình luận</Text>
      {displayedComments.length === 0 ? (
        <Text style={styles.noComments}>Chưa có bình luận</Text>
      ) : (
        <FlatList
          data={displayedComments}
          renderItem={renderCommentItem}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          style={styles.commentList}
        />
      )}
      {displayedComments.length < comments.length && (
        <TouchableOpacity
          onPress={handleLoadMore}
          style={styles.loadMoreButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.loadMoreText}>Tải thêm</Text>
          )}
        </TouchableOpacity>
      )}
      {isLoggedIn ? (
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
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loginPrompt}>Đăng nhập để bình luận</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  noComments: {
    fontStyle: "italic",
    color: "#8e8e93",
    textAlign: "center",
    paddingVertical: 20,
  },
  commentList: {
    maxHeight: "100%",
  },
  commentItem: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#007AFF",
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
    color: "#8e8e93",
  },
  commentContent: {
    marginBottom: 12,
    color: "#333",
    fontSize: 15,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    color: "#007AFF",
    marginLeft: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: "#E4E6EB",
    paddingTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
    color: "#333",
  },
  loginPrompt: {
    fontStyle: "italic",
    color: "#8e8e93",
    marginTop: 16,
    textAlign: "center",
  },
  loadMoreButton: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: "#007AFF",
    borderWidth: 1,
    backgroundColor: "#E6F0FF",
  },
  loadMoreText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Comment;
