import api from '../client';
import { User, UpdateUserValues } from '@/schemas/user.schemas';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return api.get<User[]>('/users');
  },
  
  getUserById: async (id: string): Promise<User> => {
    return api.get<User>(`/users/${id}`);
  },
  
  updateUser: async (id: string, data: UpdateUserValues): Promise<User> => {
    return api.put<User>(`/users/${id}`, data);
  },
  
  deleteUser: async (id: string): Promise<void> => {
    return api.delete<void>(`/users/${id}`);
  }
}; 