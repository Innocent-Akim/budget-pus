import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { userService } from '@/services/user.service';

export function useUserSettings() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Query pour récupérer les paramètres utilisateur
  const {
    data: settings,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userSettings', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No session or user ID');
      }
      console.log('🔄 Fetching settings for user:', session.user.id);
      try {
        const settings = await userService.getSettings();
        console.log('✅ Settings fetched:', settings);
        return settings;
      } catch (error) {
        console.error('❌ Error fetching settings:', error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes (settings changent moins souvent)
    retry: 1, // Only retry once on failure
  });

  // Mutation pour mettre à jour le revenu mensuel
  const updateMonthlyIncomeMutation = useMutation({
    mutationFn: async (income: number) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      return await userService.updateMonthlyIncome(income);
    },
    onSuccess: (_, income) => {
      // Mise à jour optimiste
      queryClient.setQueryData(['userSettings', session?.user?.id], (old: any) => ({
        ...old,
        monthlyIncome: income
      }));
    },
    onError: (error) => {
      console.error('❌ Error updating monthly income:', error);
    }
  });

  // Mutation pour mettre à jour les paramètres généraux
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: { currency?: string; language?: string; theme?: string }) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      return await userService.updateSettings(settings);
    },
    onSuccess: (_, newSettings) => {
      // Mise à jour optimiste
      queryClient.setQueryData(['userSettings', session?.user?.id], (old: any) => ({
        ...old,
        ...newSettings
      }));
    },
    onError: (error) => {
      console.error('❌ Error updating settings:', error);
    }
  });

  // Wrapper functions pour maintenir la compatibilité
  const updateMonthlyIncome = async (income: number) => {
    return updateMonthlyIncomeMutation.mutateAsync(income);
  };

  const updateSettings = async (settings: { currency?: string; language?: string; theme?: string }) => {
    return updateSettingsMutation.mutateAsync(settings);
  };

  return {
    monthlyIncome: settings?.monthlyIncome || 0,
    loading,
    error: error?.message || null,
    settings, // Expose the full settings object for debugging
    updateMonthlyIncome,
    updateSettings,
    refetch,
    // Nouvelles propriétés React Query
    isUpdatingIncome: updateMonthlyIncomeMutation.isPending,
    isUpdatingSettings: updateSettingsMutation.isPending,
    updateIncomeError: updateMonthlyIncomeMutation.error?.message || null,
    updateSettingsError: updateSettingsMutation.error?.message || null,
  };
}
