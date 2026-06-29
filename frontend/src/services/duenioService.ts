import api from './api';
import type { Duenio } from '../types';

export const duenioService = {
  getAll: async (): Promise<Duenio[]> => {
    const response = await api.get<Duenio[]>('/duenios');
    return response.data;
  },

  getById: async (id: number): Promise<Duenio> => {
    const response = await api.get<Duenio>(`/duenios/${id}`);
    return response.data;
  },

  create: async (duenio: Omit<Duenio, 'id'>): Promise<Duenio> => {
    const response = await api.post<Duenio>('/duenios', duenio);
    return response.data;
  },

  update: async (id: number, duenio: Partial<Duenio>): Promise<Duenio> => {
    const response = await api.put<Duenio>(`/duenios/${id}`, duenio);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/duenios/${id}`);
  },
};
