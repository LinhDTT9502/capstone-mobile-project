// services/commentService.js
import {
    fetchCommentsAPI,
    postCommentAPI,
    editCommentAPI,
    deleteCommentAPI,
    replyCommentAPI,
  } from "../api/apiComment";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  export const fetchComments = async (productId) => {
    try {
        const response = await fetchCommentsAPI(productId);
        console.log("Fetched comments:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};
  
  export const postComment = async (productId, content) => {
    try {
      const token = await AsyncStorage.getItem("token");
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
      const token = await AsyncStorage.getItem("token");
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
      const token = await AsyncStorage.getItem("token");
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
      const token = await AsyncStorage.getItem("token");
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
  