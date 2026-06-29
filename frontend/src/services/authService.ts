import api from './api';
import type { AuthUser, RegisterRequest } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<AuthUser> => {
    try {
      const response = await api.post<AuthUser>('/auth/login', { username, password });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se puede conectar al servidor. Verifique que el backend esté corriendo.');
      }
      if (error.response?.status === 401) {
        throw new Error('Usuario o contraseña incorrectos.');
      }
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Intente nuevamente en unos segundos.');
      }
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/register', data);
    return response.data;
  },
};
