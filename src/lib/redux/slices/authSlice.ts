import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/schemas/user.schemas';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authCheckComplete: boolean;
  error: string | null;
}

const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  isAuthenticated: false,
  isLoading: false,
  authCheckComplete: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authCheckComplete = true;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.authCheckComplete = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.authCheckComplete = true;
      localStorage.removeItem('token');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    fetchUserStart: (state) => {
      state.isLoading = true;
    },
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.authCheckComplete = true;
    },
    fetchUserFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.authCheckComplete = true;
    },
    completeAuthCheck: (state) => {
      state.authCheckComplete = true;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  updateUser,
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailed,
  completeAuthCheck
} = authSlice.actions;

export default authSlice.reducer; 