import { apiClient } from '@/lib/api-client';
import { Goal, GoalType, GoalStatus } from '@/types/budget';

export interface CreateGoalRequest {
  title: string;
  description?: string;
  type: GoalType;
  targetAmount: number;
  targetDate: string;
  monthlyContribution?: number;
  color?: string;
  icon?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  type?: GoalType;
  status?: GoalStatus;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  monthlyContribution?: number;
  color?: string;
  icon?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: string;
}

export interface GoalQueryParams {
  type?: GoalType;
  status?: GoalStatus;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class GoalsService {
  async getGoals(params?: GoalQueryParams): Promise<Goal[]> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `/goals?${queryString}` : '/goals';
    return await apiClient.get(url);
  }

  async getGoal(id: string): Promise<Goal> {
    return await apiClient.get(`/goals/${id}`);
  }

  async createGoal(goal: CreateGoalRequest): Promise<Goal> {
    return await apiClient.post('/goals', goal);
  }

  async updateGoal(id: string, goal: UpdateGoalRequest): Promise<Goal> {
    return await apiClient.put(`/goals/${id}`, goal);
  }

  async deleteGoal(id: string): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  }

  async getActiveGoals(): Promise<Goal[]> {
    return await apiClient.get('/goals/active');
  }

  async getCompletedGoals(): Promise<Goal[]> {
    return await apiClient.get('/goals/completed');
  }

  async getGoalsByType(type: string): Promise<Goal[]> {
    return await apiClient.get(`/goals/by-type/${type}`);
  }

  async getGoalsByStatus(status: string): Promise<Goal[]> {
    return await apiClient.get(`/goals/by-status/${status}`);
  }

  async getGoalsSummary(): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    overallProgress: number;
  }> {
    return await apiClient.get('/goals/summary');
  }

  async getGoalsProgress(): Promise<Array<{
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    progress: number;
    targetDate: string;
    type: GoalType;
    status: GoalStatus;
  }>> {
    return await apiClient.get('/goals/progress');
  }

  async contributeToGoal(id: string, amount: number): Promise<Goal> {
    return await apiClient.put(`/goals/${id}/contribute`, { amount });
  }

  async completeGoal(id: string): Promise<Goal> {
    return await apiClient.put(`/goals/${id}/complete`);
  }

  async pauseGoal(id: string): Promise<Goal> {
    return await apiClient.put(`/goals/${id}/pause`);
  }

  async resumeGoal(id: string): Promise<Goal> {
    return await apiClient.put(`/goals/${id}/resume`);
  }
}

export const goalsService = new GoalsService();
