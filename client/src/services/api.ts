import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(skipAuth = false): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!skipAuth) {
      const tokens = useAuthStore.getState().tokens;
      if (tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
    }

    const tenantId = useTenantStore.getState().tenantId;
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Token expired — attempt refresh
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        useAuthStore.getState().logout();
        useTenantStore.getState().clearTenant();
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const tokens = useAuthStore.getState().tokens;
    if (!tokens?.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      useAuthStore.getState().setTokens(data.tokens);
      return true;
    } catch {
      return false;
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.getHeaders(options?.skipAuth),
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(options?.skipAuth),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(options?.skipAuth),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(options?.skipAuth),
      ...options,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiService(API_BASE);
