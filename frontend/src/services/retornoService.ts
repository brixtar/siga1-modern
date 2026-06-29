import api from './api';
import type { Retorno } from '../types';

export const retornoService = {
  getAll: async (): Promise<Retorno[]> => {
    const response = await api.get<Retorno[]>('/retornos');
    return response.data;
  },

  getById: async (id: number): Promise<Retorno> => {
    const response = await api.get<Retorno>(`/retornos/${id}`);
    return response.data;
  },

  create: async (retorno: Omit<Retorno, 'id'>): Promise<Retorno> => {
    const response = await api.post<Retorno>('/retornos', retorno);
    return response.data;
  },

  update: async (id: number, retorno: Partial<Retorno>): Promise<Retorno> => {
    const response = await api.put<Retorno>(`/retornos/${id}`, retorno);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/retornos/${id}`);
  },
};
