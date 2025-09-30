import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Configuration de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
const API_TIMEOUT = 10000; // 10 secondes

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercepteur pour les requêtes
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const session = await getSession();
          if (session?.user?.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
          }
        } catch (error) {
          console.warn('Could not get session for API request:', error);
        }
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error('❌ API Error:', error.response?.status, error.message);
        
        // Gestion des erreurs communes
        if (error.response?.status === 401) {
          // Token expiré ou invalide - rediriger vers la page de connexion
          console.warn('Token invalide ou expiré, redirection vers la page de connexion');
          if (typeof window !== 'undefined') {
            // Utiliser NextAuth signOut pour nettoyer la session
            import('next-auth/react').then(({ signOut }) => {
              signOut({ callbackUrl: '/auth/signin' });
            });
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'Une erreur est survenue',
      status: error.response?.status || 500,
    };

    if (error.response?.data) {
      const data = error.response.data as any;
      apiError.message = data.message || data.error || apiError.message;
      apiError.code = data.code;
    } else if (error.request) {
      apiError.message = 'Impossible de joindre le serveur';
    }

    return apiError;
  }

  // ==================== MÉTHODES GÉNÉRIQUES ====================

  /**
   * Effectue une requête GET
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<ApiResponse<T> | T>(url, { params });
    // Handle both wrapped and direct response formats
    return (response.data as any).data || response.data;
  }

  /**
   * Effectue une requête POST
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T> | T>(url, data);
    // Handle both wrapped and direct response formats
    return (response.data as any).data || response.data;
  }

  /**
   * Effectue une requête PUT
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T> | T>(url, data);
    // Handle both wrapped and direct response formats
    return (response.data as any).data || response.data;
  }

  /**
   * Effectue une requête PATCH
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<ApiResponse<T> | T>(url, data);
    // Handle both wrapped and direct response formats
    return (response.data as any).data || response.data;
  }

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T> | T>(url);
    // Handle both wrapped and direct response formats
    return (response.data as any).data || response.data;
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Supprime le token d'authentification
   */
  removeAuthToken(): void {
    // L'authentification est maintenant gérée par NextAuth
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Récupère l'instance Axios pour des cas d'usage avancés
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Instance singleton
export const apiClient = new ApiClient();

// Export de la classe pour les tests
export { ApiClient };
