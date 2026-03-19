export type Role = 'owner' | 'manager' | 'analyst';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface OTPRequest {
  email: string;
  otp: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
