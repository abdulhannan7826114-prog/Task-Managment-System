import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (username, email, password, confirmPassword) =>
    api.post('/auth/register', { username, email, password, confirmPassword }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Task API calls
export const taskAPI = {
  create: (title, description, priority, dueDate) =>
    api.post('/tasks', { title, description, priority, dueDate }),
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;
