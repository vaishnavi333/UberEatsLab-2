

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  orderStatus: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, name, price, quantity, restaurant } = action.payload;

      // Check if the item already exists in the cart
      const existingItem = state.cart.find(item => item.id === id);
      if (existingItem) {
        // Update quantity if it exists
        existingItem.quantity = quantity;
      } else {
        // Add new item to the cart
        state.cart.push({ id, name, price, quantity, restaurant });
      }
    },
    removeFromCart(state, action) {
      // Remove the item by filtering it out from the cart
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },
    updateOrderStatus(state, action) {
      // Update order status, such as success or failure
      state.orderStatus = action.payload;
    },
    clearCart(state) {
      // Empty the cart
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateOrderStatus, clearCart } = orderSlice.actions;
export default orderSlice.reducer;
