import api from './api';
import type { Raza } from '../types';

export const razaService = {
  getAll: async (): Promise<Raza[]> => {
    const response = await api.get<Raza[]>('/razas');
    return response.data;
  },

  getByEspecieId: async (especieId: number): Promise<Raza[]> => {
    const response = await api.get<Raza[]>(`/razas/especie/${especieId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Raza> => {
    const response = await api.get<Raza>(`/razas/${id}`);
    return response.data;
  },

  create: async (raza: Omit<Raza, 'id'>): Promise<Raza> => {
    const response = await api.post<Raza>('/razas', raza);
    return response.data;
  },

  update: async (id: number, raza: Partial<Raza>): Promise<Raza> => {
    const response = await api.put<Raza>(`/razas/${id}`, raza);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/razas/${id}`);
  },
};
