import axios from 'axios';
import axiosInstance from './axiosInstance'; 
const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Like';

export const getLikesAPI = () => {
  return axios.get(`${API_BASE_URL}/get-likes`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
};

export const toggleLikeProductAPI = (productId) => {
  return axiosInstance.post(
    `${API_BASE_URL}/like-product/${productId}`,
    {},
    {
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
