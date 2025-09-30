import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { goalsService } from '@/services/goals.service';
import { Goal, GoalStatus } from '@/types/budget';

export function useGoals() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await goalsService.getGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des objectifs');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!session?.user?.id) return;
    
    try {
      const goalData = {
        ...goal,
        targetDate: goal.targetDate.toISOString().split('T')[0],
        recurringEndDate: goal.recurringEndDate?.toISOString().split('T')[0],
      };
      const newGoal = await goalsService.createGoal(goalData);
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de l\'objectif');
      throw err;
    }
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    if (!session?.user?.id) return;
    
    try {
      const goalData = {
        ...goal,
        targetDate: goal.targetDate?.toISOString().split('T')[0],
        recurringEndDate: goal.recurringEndDate?.toISOString().split('T')[0],
      };
      const updatedGoal = await goalsService.updateGoal(id, goalData);
      setGoals(prev => 
        prev.map(g => g.id === id ? updatedGoal : g)
      );
      return updatedGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'objectif');
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    if (!session?.user?.id) return;
    
    try {
      await goalsService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'objectif');
      throw err;
    }
  };

  const contributeToGoal = async (id: string, amount: number) => {
    if (!session?.user?.id) return;
    
    try {
      const updatedGoal = await goalsService.contributeToGoal(id, amount);
      setGoals(prev => 
        prev.map(g => g.id === id ? updatedGoal : g)
      );
      return updatedGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la contribution à l\'objectif');
      throw err;
    }
  };

  const completeGoal = async (id: string) => {
    if (!session?.user?.id) return;
    
    try {
      const updatedGoal = await goalsService.completeGoal(id);
      setGoals(prev => 
        prev.map(g => g.id === id ? updatedGoal : g)
      );
      return updatedGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la finalisation de l\'objectif');
      throw err;
    }
  };

  const getActiveGoals = () => {
    return goals.filter(goal => goal.status === GoalStatus.ACTIVE);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.status === GoalStatus.COMPLETED);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchGoals();
    }
  }, [session?.user?.id]);

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    completeGoal,
    getActiveGoals,
    getCompletedGoals,
    refetch: fetchGoals,
  };
}
