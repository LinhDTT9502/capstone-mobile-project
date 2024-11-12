import axios from 'axios';

const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Auth';

export const signIn = (userName, password) => {
  return axios.post(`${API_BASE_URL}/sign-in`, {
    userName,
    password,
  }, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const signUp = (userData) => {
  return axios.post(`${API_BASE_URL}/sign-up`, userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const signOut = (data) => {
  return axios.post(`${API_BASE_URL}/sign-out`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const refreshTokenAPI = (token, refreshToken, userId) => {
  return axios.post(`${API_BASE_URL}/refresh-token`, {
    token,
    refreshToken,
    userId
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const sendForgotPasswordRequest = (email) => {
  return axios.post(`${API_BASE_URL}/forgot-password-request`, { email }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const validateResetToken = (token, email) => {
  return axios.get(`${API_BASE_URL}/validate-reset-token`, {
    params: { token, email }
  });
};

export const resetPassword = (data) => {
  return axios.post(`${API_BASE_URL}/reset-password`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// export const resetPassword = (data) => {
//   return axios.post(`${API_BASE_URL}/reset-password`, data, {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
// };
// const axiosInstance = axios.create();

// axiosInstance.interceptors.request.use(async (config) => {
//   const token = await checkAndRefreshToken();
//   config.headers['Authorization'] = `Bearer ${token}`;
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export const mobileSignUp = (userData) => {
  return axios.post(`${API_BASE_URL}/sign-up-mobile`, userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const verifyAccountMobileAPI = (data) => {
  return axios.post(`${API_BASE_URL}/verify-account-mobile`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const forgotPasswordRequestMobile = (email) => {
  return axios.post(`${API_BASE_URL}/forgot-password-request-mobile`, { email }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const resetPasswordMobile = ({ otpCode, email, newPassword }) => {
  return axios.post(`${API_BASE_URL}/reset-password-mobile`, {
    otpCode,
    email,
    newPassword,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const sendOtpRequestMobile = (data) => {
  return axios.post(`${API_BASE_URL}/send-otp-request-mobile`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};