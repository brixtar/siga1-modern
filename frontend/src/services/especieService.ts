import api from './api';
import type { Especie } from '../types';

export const especieService = {
  getAll: async (): Promise<Especie[]> => {
    const response = await api.get<Especie[]>('/especies');
    return response.data;
  },

  getById: async (id: number): Promise<Especie> => {
    const response = await api.get<Especie>(`/especies/${id}`);
    return response.data;
  },

  create: async (especie: Omit<Especie, 'id'>): Promise<Especie> => {
    const response = await api.post<Especie>('/especies', especie);
    return response.data;
  },

  update: async (id: number, especie: Partial<Especie>): Promise<Especie> => {
    const response = await api.put<Especie>(`/especies/${id}`, especie);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/especies/${id}`);
  },
};
