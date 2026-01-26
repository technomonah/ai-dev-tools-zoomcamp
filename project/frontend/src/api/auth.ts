import api from './client';

export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export const login = (data: LoginData) =>
  api.post<User>('/api/auth/login', data);

export const register = (data: RegisterData) =>
  api.post<User>('/api/auth/register', data);

export const logout = () =>
  api.post('/api/auth/logout');

export const getMe = () =>
  api.get<User>('/api/auth/me');
