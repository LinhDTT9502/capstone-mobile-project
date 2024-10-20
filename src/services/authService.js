import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // To decode the JWT token

const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Auth';

export const authenticateUser = async (userName, password) => {
  try {
    // Step 1: Call the login API
    const response = await axios.post(`${API_BASE_URL}/sign-in`, {
      userName,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    });

    console.log("Full API Response:", response); // Debug the API response

    // Step 2: Check if the response contains the token and refreshToken
    if (!response || !response.data || !response.data.token) {
      throw new Error("Invalid API response. Token not found.");
    }

    const token = response.data.token;
    const refreshToken = response.data.refreshToken;

    // Step 3: Store tokens and userId in AsyncStorage
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    // Decode the token to get user information
    const decoded = jwtDecode(token);

    // Step 4: Save the userId for future use
    await AsyncStorage.setItem('userId', decoded.userId.toString());

    // Return decoded user information
    return decoded;

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sign-up`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userId = await AsyncStorage.getItem('userId');

    if (!token || !refreshToken || !userId) {
      throw new Error('Missing logout information');
    }

    const response = await axios.post(`${API_BASE_URL}/sign-out`, {
      token,
      refreshToken,
      userId: parseInt(userId),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');
    }
    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!token || !refreshToken) {
      throw new Error('No token or refresh token found');
    }

    const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
      token,
      refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const newToken = response.data.token;
    const newRefreshToken = response.data.refreshToken;

    await AsyncStorage.setItem('authToken', newToken);
    await AsyncStorage.setItem('refreshToken', newRefreshToken);

    return newToken;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};
