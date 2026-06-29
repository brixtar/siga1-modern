import api from './api';
import type { Hemograma, QuimicaClinica, Urianalisis } from '../types';

export const hemogramaService = {
  getAll: async (): Promise<Hemograma[]> => {
    const response = await api.get<Hemograma[]>('/hemogramas');
    return response.data;
  },
  getById: async (id: number): Promise<Hemograma> => {
    const response = await api.get<Hemograma>(`/hemogramas/${id}`);
    return response.data;
  },
  create: async (data: Omit<Hemograma, 'id'>): Promise<Hemograma> => {
    const response = await api.post<Hemograma>('/hemogramas', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Hemograma>): Promise<Hemograma> => {
    const response = await api.put<Hemograma>(`/hemogramas/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/hemogramas/${id}`);
  },
};

export const quimicaService = {
  getAll: async (): Promise<QuimicaClinica[]> => {
    const response = await api.get<QuimicaClinica[]>('/quimica-clinica');
    return response.data;
  },
  getById: async (id: number): Promise<QuimicaClinica> => {
    const response = await api.get<QuimicaClinica>(`/quimica-clinica/${id}`);
    return response.data;
  },
  create: async (data: Omit<QuimicaClinica, 'id'>): Promise<QuimicaClinica> => {
    const response = await api.post<QuimicaClinica>('/quimica-clinica', data);
    return response.data;
  },
  update: async (id: number, data: Partial<QuimicaClinica>): Promise<QuimicaClinica> => {
    const response = await api.put<QuimicaClinica>(`/quimica-clinica/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/quimica-clinica/${id}`);
  },
};

export const urianalisisService = {
  getAll: async (): Promise<Urianalisis[]> => {
    const response = await api.get<Urianalisis[]>('/urianalisis');
    return response.data;
  },
  getById: async (id: number): Promise<Urianalisis> => {
    const response = await api.get<Urianalisis>(`/urianalisis/${id}`);
    return response.data;
  },
  create: async (data: Omit<Urianalisis, 'id'>): Promise<Urianalisis> => {
    const response = await api.post<Urianalisis>('/urianalisis', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Urianalisis>): Promise<Urianalisis> => {
    const response = await api.put<Urianalisis>(`/urianalisis/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/urianalisis/${id}`);
  },
};
