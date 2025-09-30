import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { userService } from '@/services/user.service';

export function useUserSettings() {
  const { data: session } = useSession();
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const settings = await userService.getSettings();
      setMonthlyIncome(settings.monthlyIncome);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const updateMonthlyIncome = async (income: number) => {
    if (!session?.user?.id) return;
    
    try {
      await userService.updateMonthlyIncome(income);
      setMonthlyIncome(income);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du revenu mensuel');
      throw err;
    }
  };

  const updateSettings = async (settings: { currency?: string; language?: string; theme?: string }) => {
    if (!session?.user?.id) return;
    
    try {
      await userService.updateSettings(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des paramètres');
      throw err;
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchSettings();
    }
  }, [session?.user?.id]);

  return {
    monthlyIncome,
    loading,
    error,
    updateMonthlyIncome,
    updateSettings,
    refetch: fetchSettings,
  };
}
