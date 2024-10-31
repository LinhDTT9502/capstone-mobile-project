import { jwtDecode } from 'jwt-decode';
// import { login, logout } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn } from '../api/apiAuth';



export const authenticateUser = async ( username, password) => {
  try {
    const response = await signIn(username, password);
    const decoded = jwtDecode(response.data.data.token);
    await AsyncStorage.setItem('token', response.data.data.token);
    // dispatch(login(decoded));
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


// export const checkAndRefreshToken = async () => {
//   let token = localStorage.getItem('token');
//   const refreshToken = localStorage.getItem('refreshToken');

//   if (!token || !refreshToken) {
//     throw new Error('No token or refresh token found');
//   }

//   const decoded = jwtDecode(token);
//   const currentTime = Date.now() / 1000;

//   if (decoded.exp < currentTime) {
//     try {
//       const response = await refreshTokenAPI(token, refreshToken);
//       // console.log(response);
//       const newToken = response.data.data.token;
//       const newRefreshToken = response.data.data.refreshToken;
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('refreshToken', newRefreshToken);
//       token = newToken; 
//     } catch (error) {
//       console.error('Token refresh failed', error);
//       throw error;
//     }
//   }
  
//   return token;
// };