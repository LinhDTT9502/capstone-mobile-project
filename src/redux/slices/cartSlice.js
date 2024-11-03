// cartSlice.js

import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem('cart', serializedState);
  } catch (err) {
    console.error('Error saving cart state:', err);
  }
};

const initialState = {
  items: loadState() || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action) => {
      const product = state.items.find(item => item.id === action.payload.id);
      if (product) {
        product.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveState(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state.items);
    },
    decreaseQuantity: (state, action) => {
      const product = state.items.find(item => item.id === action.payload);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
      saveState(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state.items);
    }
  }
});

export const { addCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = state => state.cart.items;

export default cartSlice.reducer;
