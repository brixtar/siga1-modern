import api from './api';
import type { Animal } from '../types';

export const animalService = {
  getAll: async (): Promise<Animal[]> => {
    const response = await api.get<Animal[]>('/animales');
    return response.data;
  },

  getById: async (id: number): Promise<Animal> => {
    const response = await api.get<Animal>(`/animales/${id}`);
    return response.data;
  },

  create: async (animal: Omit<Animal, 'id'>): Promise<Animal> => {
    const response = await api.post<Animal>('/animales', animal);
    return response.data;
  },

  update: async (id: number, animal: Partial<Animal>): Promise<Animal> => {
    const response = await api.put<Animal>(`/animales/${id}`, animal);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/animales/${id}`);
  },
};
