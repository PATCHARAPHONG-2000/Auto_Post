import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_URL });

export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (email: string, password: string) => api.post('/auth/register', { email, password }),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (data: any) => api.post('/products', data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  createTikTok: (productId: string) => api.post('/tasks/tiktok', { productId }),
  createFacebook: (productId: string) => api.post('/tasks/facebook', { productId }),
  getStatus: (id: string) => api.get(`/tasks/${id}`),
};

export const platformsAPI = {
  getConfig: (platform: string) => api.get(`/platforms/${platform}`),
  updateConfig: (platform: string, data: any) => api.post(`/platforms/${platform}`, data),
};

export default api;
