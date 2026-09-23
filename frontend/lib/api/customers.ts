import { apiClient } from './apiClient';
import { User, PaginatedResponse, ApiResponse } from '@/types/api';

export const customersApi = {
  async list(page: number = 1): Promise<PaginatedResponse<User>> {
    return apiClient<PaginatedResponse<User>>(`/customers?page=${page}`);
  },

  async get(id: string): Promise<ApiResponse<User>> {
    return apiClient<ApiResponse<User>>(`/customers/${id}`);
  },
};
