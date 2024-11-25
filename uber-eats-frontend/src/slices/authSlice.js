import { createSlice } from '@reduxjs/toolkit';
import { signupCustomerThunk, signupRestaurantThunk } from './authThunks';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutAction(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Handle lifecycle states of signupCustomerThunk
    builder
      .addCase(signupCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupCustomerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // User data from API
        state.isAuthenticated = true;
      })
      .addCase(signupCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message
      });

    // Handle lifecycle states of signupRestaurantThunk
    builder
      .addCase(signupRestaurantThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupRestaurantThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // User data from API
        state.isAuthenticated = true;
      })
      .addCase(signupRestaurantThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message
      });
  },
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;
