import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;

export default persistReducer(authPersistConfig, authSlice.reducer);
