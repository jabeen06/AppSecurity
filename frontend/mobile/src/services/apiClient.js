import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000
});

export const setAuthToken = (token) => {
  apiClient.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
};
