import api from './api';
import type { ReporteEstadisticas } from '../types';

export const reporteService = {
  getEstadisticas: async (fechaInicio: string, fechaFin: string): Promise<ReporteEstadisticas> => {
    const response = await api.get<ReporteEstadisticas>('/reportes/estadisticas', {
      params: { fechaInicio, fechaFin },
    });
    return response.data;
  },
};
