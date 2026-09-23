import { apiClient } from './apiClient';
import { Message, PaginatedResponse, ApiResponse } from '@/types/api';

export interface SendMessagePayload {
  content?: string;
  attachment_ids?: string[];
}

export const messagesApi = {
  async list(conversationId: string, page: number = 1): Promise<PaginatedResponse<Message>> {
    return apiClient<PaginatedResponse<Message>>(`/conversations/${conversationId}/messages?page=${page}`);
  },

  async send(conversationId: string, data: SendMessagePayload): Promise<ApiResponse<Message>> {
    return apiClient<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      data,
    });
  },
};
