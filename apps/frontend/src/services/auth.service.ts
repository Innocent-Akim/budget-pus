import { ApiClient } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.apiClient.post('/auth/login', credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return await this.apiClient.post('/auth/register', data);
  }

  async logout(): Promise<void> {
    await this.apiClient.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    return await this.apiClient.get('/auth/me');
  }

  async getSession(): Promise<any> {
    return await this.apiClient.get('/auth/session');
  }
}