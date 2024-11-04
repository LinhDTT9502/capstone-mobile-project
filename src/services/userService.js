// userService.js
import { updateProfileApi } from '../api/apiUser';

export const updateProfile = async (userId, profileData) => {
  try {
    const response = await updateProfileApi(userId, profileData);
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
