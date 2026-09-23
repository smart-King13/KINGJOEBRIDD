import { apiClient } from './apiClient';
import { MeasurementProfile, ApiResponse } from '@/types/api';

export const measurementsApi = {
  async listProfiles(): Promise<ApiResponse<MeasurementProfile[]>> {
    return apiClient<ApiResponse<MeasurementProfile[]>>('/measurement-profiles');
  },

  async createProfile(name: string): Promise<ApiResponse<MeasurementProfile>> {
    return apiClient<ApiResponse<MeasurementProfile>>('/measurement-profiles', {
      method: 'POST',
      data: { name },
    });
  },

  async addSet(profileId: string, measurements: Record<string, number | string>): Promise<ApiResponse<any>> {
    return apiClient<ApiResponse<any>>(`/measurement-profiles/${profileId}/sets`, {
      method: 'POST',
      data: { measurements },
    });
  },

  async approveSet(setId: string): Promise<ApiResponse<any>> {
    return apiClient<ApiResponse<any>>(`/measurement-sets/${setId}/approve`, {
      method: 'POST',
    });
  },
};
