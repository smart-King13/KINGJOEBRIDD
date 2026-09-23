import { apiClient } from './apiClient';
import { Collection, ApiResponse } from '@/types/api';

export const collectionsApi = {
  getCollections: () => {
    return apiClient<ApiResponse<Collection[]>>('/collections');
  },
};
