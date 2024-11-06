import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadCartState = createAsyncThunk('cart/loadState', async () => {
  try {
    const serializedState = await AsyncStorage.getItem('cart');
    if (serializedState === null) {
      // console.log("Cart state is null");
      return [];
    }
    // console.log("Loaded cart state:", JSON.parse(serializedState));
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading cart state:', err);
    return [];
  }
});

const saveState = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem('cart', serializedState);
  } catch (err) {
    console.error('Error saving cart state:', err);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCartState.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;
export const selectCartItems = state => state.cart.items;

export default cartSlice.reducer;
