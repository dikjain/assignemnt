export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  id?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
} 