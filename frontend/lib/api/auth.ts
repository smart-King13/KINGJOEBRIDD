import { apiClient } from './apiClient';
import { User, ApiResponse } from '@/types/api';

export const authApi = {
  login: (data: any) => apiClient<ApiResponse<{ user: User }>>('/login', { data }),
  register: (data: any) => apiClient<ApiResponse<{ user: User }>>('/register', { data }),
  logout: () => apiClient<any>('/logout', { data: {} }), // Need POST body to be considered POST by default, or explicitly set method
  me: () => apiClient<ApiResponse<User>>('/me', { method: 'GET' }),
  updateProfile: (data: { name: string; email: string }) => apiClient<ApiResponse<User>>('/auth/profile', { data, method: 'PUT' }),
  updatePassword: (data: any) => apiClient<ApiResponse<null>>('/auth/password', { data, method: 'PUT' }),
  updateAvatar: (formData: FormData) => apiClient<ApiResponse<User>>('/auth/avatar', { data: formData }),
};
