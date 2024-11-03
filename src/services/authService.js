import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, refreshTokenAPI  } from '../api/apiAuth';

export const authenticateUser = async ( username, password) => {
  
  try {
    const response = await signIn(username, password);
    const decoded = jwtDecode(response.data.data.token);
    await AsyncStorage.setItem('token', response.data.data.token);
    return decoded;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

// export const signUpUser = async (userData) => {
//   try {
//     const response = await signUp(userData);
//     return response.data;
//   } catch (error) {
//     console.error('Error during sign-up:', error);
//     throw error;
//   }
// };

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