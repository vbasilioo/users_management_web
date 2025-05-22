import api from '../client';
import { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schemas';
import { AuthResponse } from '@/schemas/api.schemas';

export const authService = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterFormValues): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password
    });
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
}; 