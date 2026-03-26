// src/services/auth.service.ts

const TOKEN_KEY = 'hs_token'; // hs = HoodSquare

export const authService = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};