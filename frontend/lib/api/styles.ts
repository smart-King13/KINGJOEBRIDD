import { apiClient } from './apiClient';
import { Style, Category, Collection, PaginatedResponse, ApiResponse } from '@/types/api';

export interface StyleFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_slug?: string;
  collection_slug?: string;
  is_featured?: boolean;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export const stylesApi = {
  getStyles: (filters: StyleFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return apiClient<PaginatedResponse<Style>>(`/styles${queryString ? `?${queryString}` : ''}`);
  },

  getStyle: (slug: string) => {
    return apiClient<ApiResponse<Style>>(`/styles/${slug}`);
  },

  getSavedStyles: (filters: Omit<StyleFilters, 'category_slug' | 'collection_slug' | 'is_featured'> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return apiClient<PaginatedResponse<Style>>(`/saved-styles${queryString ? `?${queryString}` : ''}`);
  },

  saveStyle: (id: string) => {
    return apiClient<ApiResponse<null>>(`/styles/${id}/save`, { method: 'POST', data: {} });
  },

  unsaveStyle: (id: string) => {
    return apiClient<ApiResponse<null>>(`/styles/${id}/save`, { method: 'DELETE' });
  },

  createStyle: (data: Partial<Style>) => {
    return apiClient<ApiResponse<Style>>('/styles', { method: 'POST', data });
  },

  updateStyle: (id: string, data: Partial<Style>) => {
    return apiClient<ApiResponse<Style>>(`/styles/${id}`, { method: 'PUT', data });
  },

  deleteStyle: (id: string) => {
    return apiClient<ApiResponse<null>>(`/styles/${id}`, { method: 'DELETE' });
  },
};
