import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://samaj-portal-api.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('samaj_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkApiHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};
