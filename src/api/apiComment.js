// apiComment.js
import axiosInstance from './axiosInstance';
const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Comment';

export const fetchCommentsAPI = (productId) => {
    return axiosInstance.get(`${API_BASE_URL}/get-all-comments/${productId}`);
  };

export const postCommentAPI = (productId, content, token) => {
  return axiosInstance.post(
    `${API_BASE_URL}/product/${productId}/comment`,
    { content },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

export const editCommentAPI = (commentId, content, token) => {
  return axiosInstance.put(
    `${API_BASE_URL}/comment/${commentId}`,
    { content },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

export const deleteCommentAPI = (commentId, token) => {
  return axiosInstance.delete(`${API_BASE_URL}/comment/${commentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const replyCommentAPI = (commentId, content, token) => {
  return axiosInstance.post(
    `${API_BASE_URL}/comment/${commentId}/reply`,
    { content },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
