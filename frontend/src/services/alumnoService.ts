import api from './api';
import type { Alumno } from '../types';

export const alumnoService = {
  getAll: async (): Promise<Alumno[]> => {
    const response = await api.get<Alumno[]>('/alumnos');
    return response.data;
  },

  getById: async (id: number): Promise<Alumno> => {
    const response = await api.get<Alumno>(`/alumnos/${id}`);
    return response.data;
  },

  create: async (alumno: Omit<Alumno, 'id'>): Promise<Alumno> => {
    const response = await api.post<Alumno>('/alumnos', alumno);
    return response.data;
  },

  update: async (id: number, alumno: Partial<Alumno>): Promise<Alumno> => {
    const response = await api.put<Alumno>(`/alumnos/${id}`, alumno);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/alumnos/${id}`);
  },
};
