import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Thunk for customer signup
export const signupCustomerThunk = createAsyncThunk(
  'auth/signupCustomer',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/customers/signup/', formData);
      return response.data; // User data from the server
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Customer signup failed. Please try again.'
      );
    }
  }
);

// Thunk for restaurant signup
export const signupRestaurantThunk = createAsyncThunk(
  'auth/signupRestaurant',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/restaurants/signup/', formData);
      return response.data; // User data from the server
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Restaurant signup failed. Please try again.'
      );
    }
  }
);
