import { apiClient } from './apiClient';
import { Conversation, PaginatedResponse, ApiResponse } from '@/types/api';

export interface CreateConversationPayload {
  context_type: 'style' | 'style_request' | 'order';
  context_id: string;
}

export const conversationsApi = {
  async list(page: number = 1): Promise<PaginatedResponse<Conversation>> {
    return apiClient<PaginatedResponse<Conversation>>(`/conversations?page=${page}`);
  },

  async get(id: string): Promise<ApiResponse<Conversation>> {
    return apiClient<ApiResponse<Conversation>>(`/conversations/${id}`);
  },

  async create(data: CreateConversationPayload): Promise<ApiResponse<Conversation>> {
    return apiClient<ApiResponse<Conversation>>('/conversations', {
      method: 'POST',
      data,
    });
  },

  async markAsRead(id: string): Promise<ApiResponse<null>> {
    return apiClient<ApiResponse<null>>(`/conversations/${id}/read`, {
      method: 'PATCH',
    });
  },
};
