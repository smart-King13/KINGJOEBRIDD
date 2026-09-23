import { apiClient } from './apiClient';
import { Quote, PaginatedResponse, ApiResponse } from '@/types/api';

export const quotesApi = {
  async list(page: number = 1): Promise<PaginatedResponse<Quote>> {
    return apiClient<PaginatedResponse<Quote>>(`/quotes?page=${page}`);
  },

  async get(id: string): Promise<ApiResponse<Quote>> {
    return apiClient<ApiResponse<Quote>>(`/quotes/${id}`);
  },

  async accept(id: string): Promise<ApiResponse<{ order_id: string }>> {
    return apiClient<ApiResponse<{ order_id: string }>>(`/quotes/${id}/accept`, {
      method: 'POST',
    });
  },

  async update(id: string, payload: any): Promise<ApiResponse<Quote>> {
    return apiClient<ApiResponse<Quote>>(`/quotes/${id}`, {
      method: 'PUT',
      data: payload,
    });
  },
};
