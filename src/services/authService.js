import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, refreshTokenAPI , signUp, sendForgotPasswordRequest, validateResetToken, resetPassword } from '../api/apiAuth';

export const authenticateUser = async ( username, password) => {
  
  try {
    const response = await signIn(username, password);
    const decoded = jwtDecode(response.data.data.token);
    await AsyncStorage.setItem('token', response.data.data.token);
    await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    return decoded;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const signUpUser = async (userData) => {
  try {
    const response = await signUp(userData);
    return response.data;
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await sendForgotPasswordRequest(email);
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error.response ? error.response.data : error;
  }
};

export const verifyResetToken = async (token, email) => {
  try {
    const response = await validateResetToken(token, email);
    return response.data;
  } catch (error) {
    console.error('Error validating reset token:', error);
    throw error.response ? error.response.data : error;
  }
};

export const performPasswordReset = async (data) => {
  try {
    const response = await resetPassword(data);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error.response ? error.response.data : error;
  }
};

// export const signOutUser = async (data) => {
//   try {
//     const response = await signOut(data);
//     return response;
//   } catch (error) {
//     console.error('Error during sign-out:', error);
//     throw error;
//   }
// };


export const checkAndRefreshToken = async () => {
  try {
    let token = await AsyncStorage.getItem('token');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!token || !refreshToken) {
      throw new Error('No token or refresh token found');
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      try {
        const response = await refreshTokenAPI(token, refreshToken);
        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken;

        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        token = newToken;
      } catch (error) {
        console.error('Token refresh failed', error);
        throw error;
      }
    }

    return token;
  } catch (error) {
    console.error('Error checking or refreshing token:', error);
    throw error;
  }
};

export const changeUserPassword = async (data) => {
  try {
    const response = await changePassword(data);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error.response ? error.response.data : error;
  }
};