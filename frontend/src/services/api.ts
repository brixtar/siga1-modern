import axios from 'axios';

const env = (import.meta as any).env || {};
const apiBase = env.VITE_API_URL
  ? `${env.VITE_API_URL.replace(/\/$/, '')}/api/v1`
    : '/api/v1';

const api = axios.create({
    baseURL: apiBase,
    withCredentials: true,
    headers: {
          'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
          const token = localStorage.getItem('siga_token');
          if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
    },
    (error) => Promise.reject(error)
  );

api.interceptors.response.use(
    (response) => response,
    (error) => {
          if (error.response?.status === 401) {
                  localStorage.removeItem('siga_token');
                  localStorage.removeItem('siga_username');
                  localStorage.removeItem('siga_roles');
                  localStorage.removeItem('siga_puede_ver_auditoria');
                  localStorage.removeItem('siga_userid');
                  if (window.location.pathname !== '/login') {
                            window.location.href = '/login';
                  }
          }
          return Promise.reject(error);
    }
  );

export default api;
