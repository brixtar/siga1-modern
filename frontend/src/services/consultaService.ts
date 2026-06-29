import api from './api';
import type { Consulta } from '../types';

export const consultaService = {
  getAll: async (): Promise<Consulta[]> => {
    const response = await api.get<Consulta[]>('/consultas');
    return response.data;
  },

  getById: async (id: number): Promise<Consulta> => {
    const response = await api.get<Consulta>(`/consultas/${id}`);
    return response.data;
  },

  create: async (consulta: Omit<Consulta, 'id'>): Promise<Consulta> => {
    const response = await api.post<Consulta>('/consultas', consulta);
    return response.data;
  },

  update: async (id: number, consulta: Partial<Consulta>): Promise<Consulta> => {
    const response = await api.put<Consulta>(`/consultas/${id}`, consulta);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },
};
