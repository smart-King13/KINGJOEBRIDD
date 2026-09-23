import { apiClient } from './apiClient';
import { StyleRequest, PaginatedResponse, ApiResponse } from '@/types/api';

export interface CreateStyleRequestPayload {
  style_id?: string;
  description: string;
  preferred_color?: string;
  preferred_material?: string;
  sourcing_preference?: 'customer_provided' | 'kingjoebridd_sourced';
  notes?: string;
  attachment_ids?: string[];
}

export const styleRequestsApi = {
  async list(page: number = 1): Promise<PaginatedResponse<StyleRequest>> {
    return apiClient<PaginatedResponse<StyleRequest>>(`/style-requests?page=${page}`);
  },

  async get(id: string): Promise<ApiResponse<StyleRequest>> {
    return apiClient<ApiResponse<StyleRequest>>(`/style-requests/${id}`);
  },

  async create(data: CreateStyleRequestPayload): Promise<ApiResponse<StyleRequest>> {
    return apiClient<ApiResponse<StyleRequest>>('/style-requests', {
      method: 'POST',
      data,
    });
  },

  async updateStatus(id: string, status: string): Promise<ApiResponse<StyleRequest>> {
    return apiClient<ApiResponse<StyleRequest>>(`/style-requests/${id}/status`, {
      method: 'PATCH',
      data: { status },
    });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient<ApiResponse<null>>(`/style-requests/${id}`, {
      method: 'DELETE',
    });
  },
};
