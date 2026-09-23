import { apiClient } from './apiClient';
import { Payment, ApiResponse } from '@/types/api';

export const paymentsApi = {
  async list(orderId: string): Promise<ApiResponse<Payment[]>> {
    return apiClient<ApiResponse<Payment[]>>(`/orders/${orderId}/payments`);
  },

  async initialize(orderId: string, amount: number, type: 'deposit' | 'full' | 'balance'): Promise<ApiResponse<{ payment: Payment, authorization_url: string }>> {
    return apiClient<ApiResponse<{ payment: Payment, authorization_url: string }>>(`/orders/${orderId}/payments`, {
      method: 'POST',
      data: { amount, type },
    });
  },

  async verify(paymentId: string): Promise<ApiResponse<Payment>> {
    return apiClient<ApiResponse<Payment>>(`/payments/${paymentId}/verify`, {
      method: 'POST',
    });
  },
};
