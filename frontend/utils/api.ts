import axios from 'axios';
import { AuthResponse, Post, ApiError } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return data;
  },

  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/signup', {
      name,
      email,
      password,
    });
    return data;
  },
};

export const posts = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await api.get<Post[]>('/api/posts');
    return data;
  },

  getOne: async (id: string): Promise<Post> => {
    const { data } = await api.get<Post>(`/api/posts/${id}`);
    return data;
  },

  create: async (title: string, content: string): Promise<Post> => {
    const { data } = await api.post<Post>('/api/posts', {
      title,
      content,
    });
    return data;
  },

  update: async (id: string, title: string, content: string): Promise<Post> => {
    const { data } = await api.put<Post>(`/api/posts/${id}`, {
      title,
      content,
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/posts/${id}`);
  },
}; 