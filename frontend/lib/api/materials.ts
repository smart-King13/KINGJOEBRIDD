import { apiClient } from './apiClient';
import { Material, PaginatedResponse, ApiResponse } from '@/types/api';

export interface MaterialFilters {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export const materialsApi = {
  getMaterials: (filters: MaterialFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return apiClient<PaginatedResponse<Material>>(`/materials${queryString ? `?${queryString}` : ''}`);
  },

  getMaterial: (id: string) => {
    return apiClient<ApiResponse<Material>>(`/materials/${id}`);
  },

  createMaterial: (data: Partial<Material>) => {
    return apiClient<ApiResponse<Material>>('/materials', { method: 'POST', data });
  },

  updateMaterial: (id: string, data: Partial<Material>) => {
    return apiClient<ApiResponse<Material>>(`/materials/${id}`, { method: 'PUT', data });
  },

  deleteMaterial: (id: string) => {
    return apiClient<ApiResponse<null>>(`/materials/${id}`, { method: 'DELETE' });
  },
};
