import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/schemas/user.schemas';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    fetchUsersFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    createUserStart: (state) => {
      state.isLoading = true;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.users = [...state.users, action.payload];
    },
    createUserFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.users = state.users.map(user => 
        user.id === action.payload.id ? action.payload : user
      );
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },
    updateUserFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.users = state.users.filter(user => user.id !== action.payload);
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },
    deleteUserFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailed,
  selectUser,
  createUserStart,
  createUserSuccess,
  createUserFailed,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer; 