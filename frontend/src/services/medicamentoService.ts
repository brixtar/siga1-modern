import api from './api';
import type { Medicamento } from '../types';

export const medicamentoService = {
  getAll: async () => {
    const response = await api.get<Medicamento[]>('/medicamentos');
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get<Medicamento[]>('/medicamentos/bajo-stock');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Medicamento>(`/medicamentos/${id}`);
    return response.data;
  },

  create: async (medicamento: Omit<Medicamento, 'id'>) => {
    const response = await api.post<Medicamento>('/medicamentos', medicamento);
    return response.data;
  },

  update: async (id: number, medicamento: Partial<Medicamento>) => {
    const response = await api.put<Medicamento>(`/medicamentos/${id}`, medicamento);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/medicamentos/${id}`);
  },
};
