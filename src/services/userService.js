// userService.js
import { getUserProfile as getUserProfile, updateProfileApi } from '../api/apiUser';

export const fetchUserProfile = async (userId) => {
  try {
    const response = await getUserProfile(userId);
    return response.data.data; // Kiểm tra xem `data` có đúng là nơi chứa thông tin người dùng hay không
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const saveUserProfile = async (userId, profileData) => {
  try {
    const response = await updateProfileApi(userId, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
