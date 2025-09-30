import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { transactionsService } from '@/services/transactions.service';
import { Transaction, TransactionType } from '@/types/budget';

export function useTransactions() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await transactionsService.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!session?.user?.id) return;
    
    try {
      const transactionData = {
        ...transaction,
        date: transaction.date.toISOString().split('T')[0],
        recurringEndDate: transaction.recurringEndDate?.toISOString().split('T')[0],
      };
      const newTransaction = await transactionsService.createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la transaction');
      throw err;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    if (!session?.user?.id) return;
    
    try {
      const transactionData = {
        ...transaction,
        date: transaction.date?.toISOString().split('T')[0],
        recurringEndDate: transaction.recurringEndDate?.toISOString().split('T')[0],
      };
      const updatedTransaction = await transactionsService.updateTransaction(id, transactionData);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      return updatedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!session?.user?.id) return;
    
    try {
      await transactionsService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la transaction');
      throw err;
    }
  };

  const getCurrentMonthTransactions = () => {
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return getTransactionsByMonth(currentMonthKey);
  };

  const getTransactionsByMonth = (monthKey: string) => {
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

  useEffect(() => {
    if (session?.user?.id) {
      fetchTransactions();
    }
  }, [session?.user?.id]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentMonthTransactions,
    getTransactionsByMonth,
    getTotalsByMonth,
    getExpensesByCategory,
    refetch: fetchTransactions,
  };
}
