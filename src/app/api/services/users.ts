import api from '../client';
import { User, UpdateUserValues } from '@/schemas/user.schemas';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: UpdateUserValues): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
}; 