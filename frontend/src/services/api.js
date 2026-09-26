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

export const fetchFeed = async (page = 1, limit = 15) => {
  const res = await apiClient.get('/posts', { params: { page, limit } });
  return res.data;
};

export const createNewPost = async (formData) => {
  const res = await apiClient.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const togglePostLike = async (postId) => {
  const res = await apiClient.post(`/posts/${postId}/like`);
  return res.data;
};

export const loginUser = async (mobileNumber, password) => {
  const res = await apiClient.post('/auth/login', {
    identifier: mobileNumber,
    mobileNumber,
    password,
  });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await apiClient.post('/auth/register', userData);
  return res.data;
};

export const fetchGroups = async () => {
  const res = await apiClient.get('/groups');
  return res.data;
};

export const createGroup = async (groupData) => {
  const res = await apiClient.post('/groups', groupData);
  return res.data;
};

export const joinGroup = async (groupId) => {
  const res = await apiClient.post(`/groups/${groupId}/join`);
  return res.data;
};

export const fetchGroupMessages = async (groupId, page = 1) => {
  const res = await apiClient.get(`/groups/${groupId}/messages`, { params: { page } });
  return res.data;
};

export const sendGroupMessage = async (groupId, payload) => {
  const isFormData = payload instanceof FormData;
  const res = await apiClient.post(`/groups/${groupId}/messages`, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const addGroupMember = async (groupId, userId, role = 'MEMBER') => {
  const res = await apiClient.post(`/groups/${groupId}/members`, { userId, role });
  return res.data;
};

export const fetchGroupMembers = async (groupId) => {
  const res = await apiClient.get(`/groups/${groupId}/members`);
  return res.data;
};

export const updateMemberRole = async (groupId, userId, role) => {
  const res = await apiClient.patch(`/groups/${groupId}/members/${userId}/role`, { role });
  return res.data;
};

export const removeGroupMember = async (groupId, userId) => {
  const res = await apiClient.delete(`/groups/${groupId}/members/${userId}`);
  return res.data;
};
