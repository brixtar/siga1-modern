import api from './api';
import type { Derivacion } from '../types';

export const derivacionService = {
  getAll: async (): Promise<Derivacion[]> => {
    const response = await api.get<Derivacion[]>('/derivaciones');
    return response.data;
  },

  getById: async (id: number): Promise<Derivacion> => {
    const response = await api.get<Derivacion>(`/derivaciones/${id}`);
    return response.data;
  },

  create: async (derivacion: Omit<Derivacion, 'id'>): Promise<Derivacion> => {
    const response = await api.post<Derivacion>('/derivaciones', derivacion);
    return response.data;
  },

  update: async (id: number, derivacion: Partial<Derivacion>): Promise<Derivacion> => {
    const response = await api.put<Derivacion>(`/derivaciones/${id}`, derivacion);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/derivaciones/${id}`);
  },
};
