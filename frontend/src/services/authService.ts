import api from './api';
import type { AuthUser, CaptchaResponse, RegisterRequest } from '../types';

export const authService = {
  getCaptcha: async (): Promise<CaptchaResponse> => {
    try {
      const response = await api.get<CaptchaResponse>('/auth/captcha');
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se puede conectar con el servidor para obtener el código de seguridad.');
      }
      throw new Error(error.response?.data?.message || 'Error al cargar código de seguridad');
    }
  },

  login: async (username: string, password: string, captchaId: string, captchaAnswer: string): Promise<AuthUser> => {
    try {
      const response = await api.post<AuthUser>('/auth/login', {
        username,
        password,
        captchaId,
        captchaAnswer,
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se puede conectar al servidor. Verifique su conexión o intente más tarde.');
      }
      if (error.response?.status === 429) {
        throw new Error(error.response?.data?.message || 'Has superado el límite de intentos de inicio de sesión. Por seguridad, espere 1 minuto.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Código de seguridad CAPTCHA incorrecto o expirado.');
      }
      if (error.response?.status === 401) {
        throw new Error('Usuario o contraseña incorrectos.');
      }
      if (error.response?.status === 500) {
        throw new Error(error.response?.data?.message || 'Error interno del servidor. Intente nuevamente en unos segundos.');
      }
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/register', data);
    return response.data;
  },
};
