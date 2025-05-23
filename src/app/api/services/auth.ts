import api from '../client';
import { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schemas';
import { AuthResponse } from '@/schemas/api.schemas';

export const authService = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', data);
  },
  
  register: async (data: RegisterFormValues): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/users', {
      name: data.name,
      email: data.email,
      password: data.password
    });
  },
  
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },
  
  getCurrentUser: async () => {
    return api.get<{ id: string; name: string; email: string; role: string }>('/auth/me');
  }
}; 