import { apiClient } from './apiClient';
import { Order, PaginatedResponse, ApiResponse, Fulfillment, ProductionUpdate } from '@/types/api';

export const ordersApi = {
  async list(page: number = 1): Promise<PaginatedResponse<Order>> {
    return apiClient<PaginatedResponse<Order>>(`/orders?page=${page}`);
  },

  async get(id: string): Promise<ApiResponse<Order>> {
    return apiClient<ApiResponse<Order>>(`/orders/${id}`);
  },

  async getFulfillment(id: string): Promise<ApiResponse<Fulfillment>> {
    return apiClient<ApiResponse<Fulfillment>>(`/orders/${id}/fulfillment`);
  },

  async upsertFulfillment(id: string, payload: Partial<Fulfillment>): Promise<ApiResponse<Fulfillment>> {
    return apiClient<ApiResponse<Fulfillment>>(`/orders/${id}/fulfillment`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getProductionUpdates(id: string): Promise<ApiResponse<ProductionUpdate[]>> {
    return apiClient<ApiResponse<ProductionUpdate[]>>(`/orders/${id}/production-updates`);
  },

  async updateProduction(id: string, payload: { status: string; note?: string }): Promise<ApiResponse<ProductionUpdate>> {
    return apiClient<ApiResponse<ProductionUpdate>>(`/orders/${id}/production-updates`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
