// userService.js
import {
  getUserProfile as getUserProfile,
  updateProfileApi,
  uploadAvatarApi,
} from "../api/apiUser";

export const fetchUserProfile = async (userId) => {
  try {
    const response = await getUserProfile(userId);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const saveUserProfile = async (userId, profileData) => {
  try {
    const response = await updateProfileApi(userId, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const checkEmailVerification = async (userId) => {
  try {
    const response = await axios.get(`/api/User/verify-email-status/${userId}`);
    return response.data.emailConfirmed;
  } catch (error) {
    throw new Error("Lỗi kiểm tra trạng thái email xác minh");
  }
};

export const sendVerificationEmail = async (userId) => {
  try {
    const response = await axios.post(`/api/User/resend-verification-email`, {
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Lỗi gửi lại email xác minh");
  }
};

export const uploadAvatar = async (userId, avatarFile) => {
  try {
    const response = await uploadAvatarApi(userId, avatarFile);
    // console.log("Upload Avatar Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error?.response || error?.message);
    throw error;
  }
};

export const sendSmsOtpService = async (phoneNumber) => {
  try {
    const response = await sendSmsOtp(phoneNumber);
    return response.data;
  } catch (error) {
    console.error("Error sending SMS OTP:", error);
    throw new Error("Lỗi gửi OTP đến số điện thoại");
  }
};

export const verifyPhoneNumberService = async (otp) => {
  try {
    const response = await verifyPhoneNumber(otp);
    return response.data;
  } catch (error) {
    console.error("Error verifying phone number:", error);
    throw new Error("Lỗi xác thực số điện thoại bằng OTP");
  }
};
