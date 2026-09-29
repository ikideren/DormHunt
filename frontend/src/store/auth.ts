import { create } from 'zustand';

export interface AuthState {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: localStorage.getItem('userId') || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (userId: string, token: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    set({ userId, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    set({ userId: null, token: null, isAuthenticated: false });
  },
}));
