import axios from 'axios';

const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Auth';

export const signIn = async (userName, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sign-in`, {
      userName,
      password,
    }, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      }
    });
    console.log('API response:', response.data); // Log the response
    return response;
  } catch (error) {
    console.error('API request error:', error); // Log full error details
    throw error;
  }
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

export const refreshTokenAPI = (token, refreshToken) => {
  return axios.post(`${API_BASE_URL}/refresh-token`, {
    token,
    refreshToken,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const changePassword = (data) => {
  return axios.post(`${API_BASE_URL}/change-password`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const forgotPasswordRequest = (email) => {
  return axios.post(`${API_BASE_URL}/forgot-password-request`, { email });
};

export const resetPassword = (data) => {
  return axios.post(`${API_BASE_URL}/reset-password`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// const axiosInstance = axios.create();

// axiosInstance.interceptors.request.use(async (config) => {
//   const token = await checkAndRefreshToken();
//   config.headers['Authorization'] = `Bearer ${token}`;
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });
