import { apiClient } from './apiClient';
import { Attachment, ApiResponse } from '@/types/api';

export const attachmentsApi = {
  async upload(file: File): Promise<ApiResponse<Attachment>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient<ApiResponse<Attachment>>('/attachments', {
      method: 'POST',
      data: formData,
    });
  },
};
