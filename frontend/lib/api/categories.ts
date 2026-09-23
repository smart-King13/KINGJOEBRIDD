import { apiClient } from './apiClient';
import { Category, ApiResponse } from '@/types/api';

// Assuming categories return a flat array via ApiResponse based on typical Laravel resource collections without pagination if they are small, or paginated. We will use ApiResponse<Category[]> assuming it's a simple list, but handle safely.
export const categoriesApi = {
  getCategories: () => {
    return apiClient<ApiResponse<Category[]>>('/categories');
  },
};
