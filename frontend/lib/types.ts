// Authentication Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'portal';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  email?: string;
}

export interface ErrorResponse {
  success: false;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ApiResponse<T = AuthResponse> = T | ErrorResponse;

