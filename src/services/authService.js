import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signIn,
  refreshTokenAPI,
  signUp,
  sendForgotPasswordRequest,
  validateResetToken,
  resetPassword,
  mobileSignUp,
  forgotPasswordRequestMobile,
  verifyAccountMobileAPI,
  resetPasswordMobile,
} from "../api/apiAuth";

export const authenticateUser = async (username, password) => {
  try {
    const response = await signIn(username, password);
    const decoded = jwtDecode(response.data.data.token);
    await AsyncStorage.setItem("token", response.data.data.token);
    await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken);
    await AsyncStorage.setItem("currentUserId", response.data.data.userId.toString());
    return decoded;

    
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const signUpUser = async (userData) => {
  try {
    const response = await mobileSignUp(userData);
    return response.data;
  } catch (error) {
    console.error("Error during mobile sign-up:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await forgotPasswordRequestMobile(email);
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error.response ? error.response.data : error;
  }
};

export const verifyAccountMobile = async ({ username, email, OtpCode }) => {
  try {
    const response = await verifyAccountMobileAPI({
      username,
      email,
      otpCode: OtpCode,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in verifyAccountMobile:",
      error.response?.data || error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const resendOtpRequest = async (data) => {
  try {
    const response = await sendOtpRequestMobile(data);
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error.response ? error.response.data : error;
  }
};

export const performPasswordReset = async ({ otpCode, email, newPassword }) => {
  try {
    const response = await resetPasswordMobile({ otpCode, email, newPassword });
    return response.data;
  } catch (error) {
    console.error(
      "Error in performPasswordReset:",
      error.response?.data || error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const verifyResetToken = async (token, email) => {
  try {
    const response = await validateResetToken(token, email);
    return response.data;
  } catch (error) {
    console.error("Error validating reset token:", error);
    throw error.response ? error.response.data : error;
  }
};

export const signOutUser = async (data) => {
  try {
    const response = await signOut(data);
    return response;
  } catch (error) {
    console.error("Error during sign-out:", error);
    throw error;
  }
};

export const checkAndRefreshToken = async () => {
  try {
    let token = await AsyncStorage.getItem("token");
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      throw new Error("No token or refresh token found");
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      try {
        const response = await refreshTokenAPI(
          token,
          refreshToken,
          decoded.userId
        );
        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken;

        await AsyncStorage.setItem("token", newToken);
        await AsyncStorage.setItem("refreshToken", newRefreshToken);
        token = newToken;
      } catch (error) {
        console.error("Token refresh failed", error);
        throw error;
      }
    }

    return token;
  } catch (error) {
    console.error("Error checking or refreshing token:", error);
    throw error;
  }
};

export const changeUserPassword = async (data) => {
  try {
    const response = await changePassword(data);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error.response ? error.response.data : error;
  }
};
