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
import {
  fetchComments,
  postComment,
  editComment,
  deleteComment,
  replyComment,
} from "../../services/commentService";

const MAX_COMMENT_LENGTH = 100;
const INITIAL_COMMENT_COUNT = 5;
const LOAD_MORE_COUNT = 3;

const Comment = ({ productId, isLoggedIn, currentUserId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("Product ID in Comment component:", productId);
    // console.log("Is Logged In:", isLoggedIn);
    // console.log("Current User ID:", currentUserId);

    if (productId) {
      loadComments();
    } else {
      console.error("Product ID is missing");
    }
  }, [productId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchComments(productId);

      // Check if response has the expected structure
      if (response && response.data && response.data.$values) {
        const commentsArray = response.data.$values;
        // console.log("Loaded comments:", commentsArray); // Log to debug
        setComments(commentsArray);
        setDisplayedComments(commentsArray.slice(0, INITIAL_COMMENT_COUNT));
      } else {
        setError("Unexpected response format when loading comments");
        console.error(
          "Error: Expected an array in response.data.$values, got:",
          response
        );
      }
    } catch (error) {
      setError("Unable to load comments");
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim().length === 0) {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }
    if (newComment.length > MAX_COMMENT_LENGTH) {
      Alert.alert(
        "Error",
        `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`
      );
      return;
    }
    try {
      await postComment(productId, newComment);
      setNewComment("");
      loadComments(); // Reload comments after posting
    } catch (error) {
      Alert.alert("Error", "Unable to post comment.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (editingText.trim().length === 0) {
      Alert.alert("Error", "Vui lòng nhập comment");
      return;
    }
    try {
      await editComment(commentId, editingText);
      setEditingCommentId(null);
      setEditingText("");
      loadComments(); // Reload comments after editing
    } catch (error) {
      Alert.alert("Error", "Unable to edit comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      loadComments(); // Reload comments after deleting
    } catch (error) {
      Alert.alert("Error", "Unable to delete comment.");
    }
  };

  const handleReplyComment = async (commentId) => {
    Alert.alert(
      "Feature Not Implemented",
      "Reply functionality is not available yet."
    );
  };

  const handleLoadMore = () => {
    const newCount = displayedComments.length + LOAD_MORE_COUNT;
    setDisplayedComments(comments.slice(0, newCount));
  };

  const renderCommentItem = ({ item }) => {
    const isOwner = item.userId === currentUserId;
    const isEditing = editingCommentId === item.commentId;

    return (
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>
            {item.username || "Unknown User"}
          </Text>
          <Text style={styles.commentDate}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleString()
              : "Unknown Date"}
          </Text>
        </View>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editingText}
            onChangeText={setEditingText}
          />
        ) : (
          <Text style={styles.commentContent}>
            {item.content || "No content available"}
          </Text>
        )}
        {isLoggedIn && (
          <View style={styles.commentActions}>
            {isOwner && !isEditing && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCommentId(item.commentId); // Set specific comment ID for editing
                    setEditingText(item.content);
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="pencil-outline" size={16} color="#007AFF" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteComment(item.commentId)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#007AFF" />
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
            {isEditing && (
              <>
                <TouchableOpacity
                  onPress={() => handleEditComment(item.commentId)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCommentId(null); // Clear editing state
                    setEditingText("");
                  }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={() => handleReplyComment(item.commentId)}
              style={styles.actionButton}
            >
              <Ionicons
                name="return-up-back-outline"
                size={16}
                color="#007AFF"
              />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bình luận</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : displayedComments.length === 0 ? (
        <Text style={styles.noComments}>Không có bình luận nào</Text>
      ) : (
<FlatList
  data={displayedComments}
  renderItem={renderCommentItem}
  keyExtractor={(item) => `${item.productId}-${item.commentId}-${item.$id}`}
/>


      )}
      {displayedComments.length < comments.length && (
        <TouchableOpacity
          onPress={handleLoadMore}
          style={styles.loadMoreButton}
        >
          <Text style={styles.loadMoreText}>Hiển thị thêm</Text>
        </TouchableOpacity>
      )}
      {isLoggedIn ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập bình luận..."
            value={newComment}
            onChangeText={setNewComment}
            maxLength={MAX_COMMENT_LENGTH}
            multiline
          />
          <TouchableOpacity
            onPress={handlePostComment}
            style={styles.sendButton}
          >
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loginPrompt}>Đăng nhập để tiếp tục</Text>
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
  editInput: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  commentActions: {
    flexDirection: "row",
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
