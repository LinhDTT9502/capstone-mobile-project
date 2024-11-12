import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchCommentsAPI,
  postCommentAPI,
  editCommentAPI,
  deleteCommentAPI,
  replyCommentAPI,
} from "../api/apiComment";

// Hàm lấy token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("Token not found");
      return null; // Trả về null nếu không có token
    }
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const fetchComments = async (productId) => {
  try {
    const token = await getToken();
    const response = await fetchCommentsAPI(productId, token);
    // console.log("Fetched comments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const postComment = async (productId, content) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User not logged in");
    }
    const response = await postCommentAPI(productId, content, token);
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

export const editComment = async (commentId, content) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User not logged in");
    }
    const response = await editCommentAPI(commentId, content, token);
    return response.data;
  } catch (error) {
    console.error("Error editing comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User not logged in");
    }
    const response = await deleteCommentAPI(commentId, token);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const replyComment = async (commentId, content) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User not logged in");
    }
    const response = await replyCommentAPI(commentId, content, token);
    return response.data;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
};