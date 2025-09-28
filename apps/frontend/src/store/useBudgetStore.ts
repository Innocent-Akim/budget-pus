import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Transaction,
    Category,
    BudgetGoal,
    DEFAULT_EXPENSE_CATEGORIES,
    DEFAULT_INCOME_CATEGORIES
} from '@/types/budget';

interface BudgetStore {
  // State
  transactions: Transaction[];
  categories: Category[];
  budgetGoals: BudgetGoal[];
  monthlyIncome: number;

  // Actions - Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Actions - Categories
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Actions - Budget Goals
  addBudgetGoal: (goal: Omit<BudgetGoal, 'id' | 'createdAt' | 'currentAmount'>) => void;
  updateBudgetGoal: (id: string, goal: Partial<BudgetGoal>) => void;
  deleteBudgetGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;

  // Actions - Settings
  setMonthlyIncome: (income: number) => void;

  // Computed values
  getCurrentMonthTransactions: () => Transaction[];
  getTransactionsByMonth: (month: string) => Transaction[];
  getExpensesByCategory: (month?: string) => Record<string, number>;
  getTotalsByMonth: (month: string) => { income: number; expenses: number; savings: number };
}

// Helper function to generate IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to initialize default categories
const initializeCategories = (): Category[] => {
  const expenseCategories = DEFAULT_EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    id: generateId(),
  }));
  
  const incomeCategories = DEFAULT_INCOME_CATEGORIES.map(cat => ({
    ...cat,
    id: generateId(),
  }));

  return [...expenseCategories, ...incomeCategories];
};

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: [],
      categories: initializeCategories(),
      budgetGoals: [],
      monthlyIncome: 1000, // Default $1000 as mentioned in requirements

      // Transaction actions
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          ...state.transactions,
          {
            ...transaction,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      })),

      updateTransaction: (id, transaction) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...transaction, updatedAt: new Date() } : t
        ),
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

      // Category actions
      addCategory: (category) => set((state) => ({
        categories: [
          ...state.categories,
          {
            ...category,
            id: generateId(),
          },
        ],
      })),

      updateCategory: (id, category) => set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...category } : c
        ),
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),

      // Budget goal actions
      addBudgetGoal: (goal) => set((state) => ({
        budgetGoals: [
          ...state.budgetGoals,
          {
            ...goal,
            id: generateId(),
            currentAmount: 0,
            createdAt: new Date(),
          },
        ],
      })),

      updateBudgetGoal: (id, goal) => set((state) => ({
        budgetGoals: state.budgetGoals.map((g) =>
          g.id === id ? { ...g, ...goal } : g
        ),
      })),

      deleteBudgetGoal: (id) => set((state) => ({
        budgetGoals: state.budgetGoals.filter((g) => g.id !== id),
      })),

      updateGoalProgress: (id, amount) => set((state) => ({
        budgetGoals: state.budgetGoals.map((g) =>
          g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
        ),
      })),

      // Settings actions
      setMonthlyIncome: (income) => set({ monthlyIncome: income }),

      // Computed values
      getCurrentMonthTransactions: () => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return get().getTransactionsByMonth(currentMonth);
      },

      getTransactionsByMonth: (month) => {
        return get().transactions.filter((t) => {
          const transactionMonth = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
          return transactionMonth === month;
        });
      },

      getExpensesByCategory: (month) => {
        const transactions = month 
          ? get().getTransactionsByMonth(month)
          : get().transactions;
        
        const expenses = transactions.filter(t => t.type === 'expense');
        
        return expenses.reduce((acc, transaction) => {
          acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
          return acc;
        }, {} as Record<string, number>);
      },

      getTotalsByMonth: (month) => {
        const transactions = get().getTransactionsByMonth(month);
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          income,
          expenses,
          savings: income - expenses,
        };
      },
    }),
    {
      name: 'budget-store',
      // Custom storage to handle Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              transactions: state.transactions.map((t: any) => ({
                ...t,
                date: new Date(t.date),
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt),
              })),
              budgetGoals: state.budgetGoals.map((g: any) => ({
                ...g,
                deadline: new Date(g.deadline),
                createdAt: new Date(g.createdAt),
              })),
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
