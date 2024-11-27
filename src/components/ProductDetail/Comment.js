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
import { ToastAndroid } from "react-native";

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
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (productId) {
      loadComments();
    } else {
      console.error("Product ID is missing");
    }
  }, [productId]);

  const organizeComments = (commentsArray) => {
    const mainComments = commentsArray.filter((c) => c.parentCommentId === 0);
    mainComments.forEach((comment) => {
      comment.replies = commentsArray.filter(
        (r) => r.parentCommentId === comment.id
      );
    });
    return mainComments;
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetchComments(productId);
      if (response?.data?.$values) {
        const organizedComments = organizeComments(response.data.$values);
        setComments(organizedComments);
        setDisplayedComments(organizedComments.slice(0, INITIAL_COMMENT_COUNT));
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      setError("Unable to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
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

    try {
      const newCommentResponse = await postComment(productId, newComment);
      setComments((prevComments) => [newCommentResponse.data, ...prevComments]);
      setDisplayedComments((prevDisplayed) => [
        newCommentResponse.data,
        ...prevDisplayed,
      ]);
      setNewComment("");
      ToastAndroid.show("Thêm bình luận thành công!", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm bình luận. Vui lòng thử lại.");
    }
  };

  const handleEditComment = async (id) => {
    if (!id) {
      Alert.alert("Lỗi", "Không tìm thấy ID bình luận để chỉnh sửa.");
      return;
    }

    if (editingText.trim().length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận.");
      return;
    }

    try {
      await editComment(id, editingText);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, content: editingText } : comment
        )
      );
      setDisplayedComments((prevDisplayed) =>
        prevDisplayed.map((comment) =>
          comment.id === id ? { ...comment, content: editingText } : comment
        )
      );
      setEditingCommentId(null);
      setEditingText("");
      ToastAndroid.show("Chỉnh sửa bình luận thành công!", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chỉnh sửa bình luận. Vui lòng thử lại.");
    }
  };

  const confirmDeleteComment = (id) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa bình luận này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => handleDeleteComment(id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteComment = async (id) => {
    if (!id) {
      Alert.alert("Lỗi", "Không tìm thấy ID bình luận để xóa.");
      return;
    }

    try {
      await deleteComment(id);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
      setDisplayedComments((prevDisplayed) =>
        prevDisplayed.filter((comment) => comment.id !== id)
      );
      ToastAndroid.show("Xóa bình luận thành công!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Lỗi xoá bình luận:", error);
      Alert.alert("Lỗi", "Không thể xóa bình luận. Vui lòng thử lại.");
    }
  };

  const handleReplyComment = async (parentCommentId) => {
    if (replyText.trim().length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung trả lời.");
      return;
    }
  
    if (!isLoggedIn) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để trả lời bình luận.");
      return;
    }
  
    try {
      const newReply = await replyComment(productId, parentCommentId, replyText);
  
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === parentCommentId
            ? { ...comment, replies: [...(comment.replies || []), newReply.data] }
            : comment
        )
      );
  
      setReplyingCommentId(null);
      setReplyText("");
      ToastAndroid.show("Trả lời bình luận thành công!", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể trả lời bình luận. Vui lòng thử lại.");
      console.error("Error posting reply:", error.response || error.message);
    }
  };

  const startReplying = (commentId) => {
    setReplyingCommentId(commentId);
    setReplyText("");
  };

  const handleLoadMore = () => {
    const newCount = displayedComments.length + LOAD_MORE_COUNT;
    setDisplayedComments(comments.slice(0, newCount));
  };

  const renderReplyItem = (reply) => (
    <View key={reply.id} style={styles.replyItem}>
      <View style={styles.replyHeader}>
        <Text style={styles.replyAuthor}>{reply.username || "Unknown User"}</Text>
        <Text style={styles.replyDate}>
          {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : "Unknown Date"}
        </Text>
      </View>
      <Text style={styles.replyContent}>{reply.content}</Text>
    </View>
  );

  const renderCommentItem = ({ item }) => {
    const isOwner = item.userId === currentUserId;
    const isEditing = editingCommentId === item.id;

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
            multiline
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
                    setEditingCommentId(item.id);
                    setEditingText(item.content);
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="pencil-outline" size={16} color="#007AFF" />
                  <Text style={styles.actionText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDeleteComment(item.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#007AFF" />
                  <Text style={styles.actionText}>Xóa</Text>
                </TouchableOpacity>
              </>
            )}
            {isEditing && (
              <>
                <TouchableOpacity
                  onPress={() => handleEditComment(item.id)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCommentId(null);
                    setEditingText("");
                  }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>Hủy</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={() => startReplying(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="chatbox-outline" size={16} color="#007AFF" />
              <Text style={styles.actionText}>Trả lời</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map(renderReplyItem)}
          </View>
        )}
        {replyingCommentId === item.id && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Nhập nội dung trả lời..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <TouchableOpacity
              onPress={() => handleReplyComment(item.id)}
              style={styles.sendReplyButton}
            >
              <Ionicons name="send" size={24} color="#FFFFFF" />
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
        <Text style={styles.errorText}>{error}</Text>
      ) : displayedComments.length === 0 ? (
        <Text style={styles.noComments}>Không có bình luận nào</Text>
      ) : (
        <FlatList
          data={displayedComments.filter((item) => item && item.productId)}
          renderItem={renderCommentItem}
          keyExtractor={(item) =>
            item.productId ? `${item.productId}-${item.id}` : `${item.id}`
          }
          contentContainerStyle={styles.commentList}
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
            <Ionicons name="send" size={24} color="#FFFFFF" />
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
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  noComments: {
    fontStyle: "italic",
    color: "#8e8e93",
    textAlign: "center",
    paddingVertical: 20,
  },
  commentList: {
    flexGrow: 1,
  },
  commentItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#007AFF",
    fontSize: 16,
  },
  commentDate: {
    fontSize: 12,
    color: "#8e8e93",
  },
  commentContent: {
    marginBottom: 12,
    color: "#333333",
    fontSize: 16,
    lineHeight: 24,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#E6F2FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  actionText: {
    color: "#007AFF",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
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
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#F8F9FA",
  },
  loginPrompt: {
    fontStyle: "italic",
    color: "#8e8e93",
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
  loadMoreButton: {
    alignItems: "center",
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderColor: "#007AFF",
    borderWidth: 1,
    backgroundColor: "#E6F2FF",
  },
  loadMoreText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#E4E6EB",
  },
  replyItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  replyAuthor: {
    fontWeight: "600",
    color: "#007AFF",
    fontSize: 14,
  },
  replyContent: {
    color: "#333333",
    marginVertical: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  replyDate: {
    fontSize: 10,
    color: "#8e8e93",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
    color: "#333333",
    backgroundColor: "#F8F9FA",
  },
  sendReplyButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 16,
  },
});

export default Comment;

