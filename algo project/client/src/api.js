import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL
});


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const getCurrentUser = () => api.get('/auth/me');

export const getTasks = () => api.get('/tasks');
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const getHabits = () => api.get('/habits');
export const createHabit = (habit) => api.post('/habits', habit);
export const updateHabit = (id, habit) => api.put(`/habits/${id}`, habit);
export const completeHabit = (id) => api.post(`/habits/${id}/complete`);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);
