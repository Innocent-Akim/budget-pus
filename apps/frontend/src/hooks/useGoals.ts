import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { goalsService } from '@/services/goals.service';
import { Goal, GoalStatus } from '@/types/budget';

export function useGoals() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Query pour récupérer les objectifs
  const {
    data: goals = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['goals', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No session or user ID');
      }
      console.log('🔄 Fetching goals for user:', session.user.id);
      const data = await goalsService.getGoals();
      console.log('✅ Goals fetched:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation pour ajouter un objectif
  const addGoalMutation = useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      
      const goalData = {
        ...goal,
        targetDate: goal.targetDate.toISOString().split('T')[0],
        recurringEndDate: goal.recurringEndDate?.toISOString().split('T')[0],
      };
      return await goalsService.createGoal(goalData);
    },
    onSuccess: (newGoal) => {
      queryClient.setQueryData(['goals', session?.user?.id], (old: Goal[] = []) => {
        return [newGoal, ...old];
      });
    },
    onError: (error) => {
      console.error('❌ Error adding goal:', error);
    }
  });

  // Mutation pour mettre à jour un objectif
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, goal }: { id: string; goal: Partial<Goal> }) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      
      const goalData = {
        ...goal,
        targetDate: goal.targetDate?.toISOString().split('T')[0],
        recurringEndDate: goal.recurringEndDate?.toISOString().split('T')[0],
      };
      return await goalsService.updateGoal(id, goalData);
    },
    onSuccess: (updatedGoal) => {
      queryClient.setQueryData(['goals', session?.user?.id], (old: Goal[] = []) => {
        return old.map(g => g.id === updatedGoal.id ? updatedGoal : g);
      });
    },
    onError: (error) => {
      console.error('❌ Error updating goal:', error);
    }
  });

  // Mutation pour supprimer un objectif
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      return await goalsService.deleteGoal(id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['goals', session?.user?.id], (old: Goal[] = []) => {
        return old.filter(g => g.id !== deletedId);
      });
    },
    onError: (error) => {
      console.error('❌ Error deleting goal:', error);
    }
  });

  // Mutation pour contribuer à un objectif
  const contributeToGoalMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      return await goalsService.contributeToGoal(id, amount);
    },
    onSuccess: (updatedGoal) => {
      queryClient.setQueryData(['goals', session?.user?.id], (old: Goal[] = []) => {
        return old.map(g => g.id === updatedGoal.id ? updatedGoal : g);
      });
    },
    onError: (error) => {
      console.error('❌ Error contributing to goal:', error);
    }
  });

  // Mutation pour finaliser un objectif
  const completeGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      return await goalsService.completeGoal(id);
    },
    onSuccess: (updatedGoal) => {
      queryClient.setQueryData(['goals', session?.user?.id], (old: Goal[] = []) => {
        return old.map(g => g.id === updatedGoal.id ? updatedGoal : g);
      });
    },
    onError: (error) => {
      console.error('❌ Error completing goal:', error);
    }
  });

  // Wrapper functions pour maintenir la compatibilité
  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return addGoalMutation.mutateAsync(goal);
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    return updateGoalMutation.mutateAsync({ id, goal });
  };

  const deleteGoal = async (id: string) => {
    return deleteGoalMutation.mutateAsync(id);
  };

  const contributeToGoal = async (id: string, amount: number) => {
    return contributeToGoalMutation.mutateAsync({ id, amount });
  };

  const completeGoal = async (id: string) => {
    return completeGoalMutation.mutateAsync(id);
  };

  const getActiveGoals = () => {
    return goals.filter(goal => goal.status === GoalStatus.ACTIVE);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.status === GoalStatus.COMPLETED);
  };

  return {
    goals,
    loading,
    error: error?.message || null,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    completeGoal,
    getActiveGoals,
    getCompletedGoals,
    refetch,
    // Nouvelles propriétés React Query
    isAdding: addGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
    isContributing: contributeToGoalMutation.isPending,
    isCompleting: completeGoalMutation.isPending,
    addError: addGoalMutation.error?.message || null,
    updateError: updateGoalMutation.error?.message || null,
    deleteError: deleteGoalMutation.error?.message || null,
    contributeError: contributeToGoalMutation.error?.message || null,
    completeError: completeGoalMutation.error?.message || null,
  };
}
