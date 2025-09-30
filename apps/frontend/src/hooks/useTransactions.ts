import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { transactionsService } from '@/services/transactions.service';
import { Transaction, TransactionType } from '@/types/budget';

export function useTransactions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Query pour récupérer les transactions
  const {
    data: transactions = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No session or user ID');
      }
      console.log('🔄 Fetching transactions for user:', session.user.id);
      const data = await transactionsService.getTransactions();
      console.log('✅ Transactions fetched:', data);
      
      // Convertir les dates string en objets Date
      const processedData = Array.isArray(data) ? data.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
        recurringEndDate: transaction.recurringEndDate ? new Date(transaction.recurringEndDate) : undefined,
      })) : [];
      
      return processedData;
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation pour ajouter une transaction
  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      
      const transactionData = {
        ...transaction,
        date: transaction.date.toISOString().split('T')[0],
        recurringEndDate: transaction.recurringEndDate?.toISOString().split('T')[0],
      };
      return await transactionsService.createTransaction(transactionData);
    },
    onSuccess: (newTransaction) => {
      // Invalider et refetch les transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Ou optimiser avec setQueryData pour une mise à jour immédiate
      queryClient.setQueryData(['transactions', session?.user?.id], (old: Transaction[] = []) => {
        return [newTransaction, ...old];
      });
    },
    onError: (error) => {
      console.error('❌ Error adding transaction:', error);
    }
  });

  // Mutation pour mettre à jour une transaction
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, transaction }: { id: string; transaction: Partial<Transaction> }) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      
      const transactionData = {
        ...transaction,
        date: transaction.date?.toISOString().split('T')[0],
        recurringEndDate: transaction.recurringEndDate?.toISOString().split('T')[0],
      };
      return await transactionsService.updateTransaction(id, transactionData);
    },
    onSuccess: (updatedTransaction) => {
      // Mise à jour optimiste
      queryClient.setQueryData(['transactions', session?.user?.id], (old: Transaction[] = []) => {
        return old.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
      });
    },
    onError: (error) => {
      console.error('❌ Error updating transaction:', error);
    }
  });

  // Mutation pour supprimer une transaction
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) throw new Error('No session or user ID');
      return await transactionsService.deleteTransaction(id);
    },
    onSuccess: (_, deletedId) => {
      // Mise à jour optimiste
      queryClient.setQueryData(['transactions', session?.user?.id], (old: Transaction[] = []) => {
        return old.filter(t => t.id !== deletedId);
      });
    },
    onError: (error) => {
      console.error('❌ Error deleting transaction:', error);
    }
  });

  // Wrapper functions pour maintenir la compatibilité
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return addTransactionMutation.mutateAsync(transaction);
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    return updateTransactionMutation.mutateAsync({ id, transaction });
  };

  const deleteTransaction = async (id: string) => {
    return deleteTransactionMutation.mutateAsync(id);
  };

  const getCurrentMonthTransactions = () => {
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return getTransactionsByMonth(currentMonthKey);
  };

  const getTransactionsByMonth = (monthKey: string) => {
    if (!transactions || !Array.isArray(transactions)) {
      return [];
    }
    
    const [year, month] = monthKey.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const getTotalsByMonth = (monthKey: string) => {
    const monthTransactions = getTransactionsByMonth(monthKey);
    
    const income = monthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = income - expenses;
    
    return { income, expenses, savings };
  };

  const getExpensesByCategory = (monthKey: string) => {
    const monthTransactions = getTransactionsByMonth(monthKey);
    const expenses = monthTransactions.filter(t => t.type === TransactionType.EXPENSE);
    
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach(transaction => {
      const category = transaction.category;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + transaction.amount;
    });
    
    return expensesByCategory;
  };

  return {
    transactions,
    loading,
    error: error?.message || null,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentMonthTransactions,
    getTransactionsByMonth,
    getTotalsByMonth,
    getExpensesByCategory,
    refetch,
    // Nouvelles propriétés React Query
    isAdding: addTransactionMutation.isPending,
    isUpdating: updateTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,
    addError: addTransactionMutation.error?.message || null,
    updateError: updateTransactionMutation.error?.message || null,
    deleteError: deleteTransactionMutation.error?.message || null,
  };
}
