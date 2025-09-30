import { apiClient } from '@/lib/api-client';

export interface UserSettings {
  currency: string;
  language: string;
  theme: string;
  monthlyIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

export interface UpdateUserSettingsRequest {
  currency?: string;
  language?: string;
  theme?: string;
  totalIncome?: number;
  totalExpenses?: number;
  totalSavings?: number;
}

export interface UserStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  balance: number;
  savingsRate: number;
  memberSince: string;
}

class UserService {
  async getProfile(): Promise<{
    id: string;
    email: string;
    name: string;
    avatar: string;
    currency: string;
    language: string;
    theme: string;
    createdAt: string;
    updatedAt: string;
  }> {
    return await apiClient.get('/user/profile');
  }

  async getSettings(): Promise<UserSettings> {
    return await apiClient.get('/user/settings');
  }

  async updateSettings(settings: UpdateUserSettingsRequest): Promise<UserSettings> {
    return await apiClient.put('/user/settings', settings);
  }

  async updateMonthlyIncome(monthlyIncome: number): Promise<{
    monthlyIncome: number;
    message: string;
  }> {
    return await apiClient.put('/user/monthly-income', { monthlyIncome });
  }

  async getUserStats(): Promise<UserStats> {
    return await apiClient.get('/user/stats');
  }
}

export const userService = new UserService();
