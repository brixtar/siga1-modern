import api from './api';
import type { Doctor } from '../types';

export const doctorService = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>('/doctores');
    return response.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get<Doctor>(`/doctores/${id}`);
    return response.data;
  },

  create: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
    const response = await api.post<Doctor>('/doctores', doctor);
    return response.data;
  },

  update: async (id: number, doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.put<Doctor>(`/doctores/${id}`, doctor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctores/${id}`);
  },
};
