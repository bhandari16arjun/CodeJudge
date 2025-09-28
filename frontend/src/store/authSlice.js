import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'axios';

export const loginUser = createAsyncThunk('authentication/loginUser', async (credentialsObject) => {
  try {
    const { data } = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, credentialsObject, { withCredentials: true });
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
});

export const registerUser = createAsyncThunk('authentication/registerUser', async (registrationPayload) => {
  try {
    const { data } = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, registrationPayload, { withCredentials: true });
    return data;
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
});

export const getProfile = createAsyncThunk('authentication/getProfile', async () => {
  try {
    const { data } = await api.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
});

export const logoutUser = createAsyncThunk('authentication/logoutUser', async () => {
  try {
    const { data } = await api.post('${import.meta.env.VITE_BACKEND_URL}/api/auth/logout', {}, { withCredentials: true });
    return data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
})
export const googleLogin = createAsyncThunk('auth/google', async () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
});

const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  message: '',
  error: null
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading'; state.error = null; state.message = '';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = action.payload.success;
      state.user = action.payload.user || null;
      state.message = action.payload.message;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error?.message || 'Login failed';
      state.isAuthenticated = false; state.user = null; state.message = '';
    });

    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading'; state.error = null; state.message = '';
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = action.payload.success;
      state.user = action.payload.user || null;
      state.message = action.payload.message;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error?.message || 'Registration failed';
      state.isAuthenticated = false; state.user = null; state.message = '';
    });

    builder.addCase(logoutUser.pending, (state) => {
      state.status = 'loading'; state.error = null; state.message = '';
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = !action.payload.success;  
      state.user = null;
      state.message = action.payload.message;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error?.message || 'Logout failed';
      state.isAuthenticated = false; state.user = null; state.message = '';
    });

    builder.addCase(getProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.user || null;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Profile fetch failed';
        state.isAuthenticated = false;
        state.user = null;
    });
    builder.addCase(googleLogin.pending,  (state) => { state.status = 'loading'; });
    builder.addCase(googleLogin.fulfilled,(state) => { state.status = 'redirecting'; });
  }
});

export default authenticationSlice.reducer;
