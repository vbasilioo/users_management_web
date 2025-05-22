import axios, { type AxiosInstance, AxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (request) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
  }
  return request;
})

export default api

export const apiClient = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api.request(config);
  return response.data;
}; 