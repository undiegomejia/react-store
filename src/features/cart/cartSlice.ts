import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../models/types';
import { StorageManager } from '../../utils/storage';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: StorageManager.getCart(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      StorageManager.setCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      StorageManager.setCart(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        item => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        StorageManager.setCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      StorageManager.clearCart();
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;