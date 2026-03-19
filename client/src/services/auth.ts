import { api } from './api';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';
import type { User, AuthTokens, LoginRequest, RegisterRequest, OTPRequest } from '@/types';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials, {
      skipAuth: true,
    });
    useAuthStore.getState().login(response.user, response.tokens);
    useTenantStore.getState().setTenant(response.user.tenantId, response.user.name);
    return response;
  },

  async register(data: RegisterRequest): Promise<{ message: string }> {
    return api.post('/auth/register', data, { skipAuth: true });
  },

  async verifyOTP(data: OTPRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/verify-otp', data, {
      skipAuth: true,
    });
    useAuthStore.getState().login(response.user, response.tokens);
    useTenantStore.getState().setTenant(response.user.tenantId, response.user.name);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      useAuthStore.getState().logout();
      useTenantStore.getState().clearTenant();
    }
  },

  async getProfile(): Promise<User> {
    return api.get('/auth/profile');
  },
};
