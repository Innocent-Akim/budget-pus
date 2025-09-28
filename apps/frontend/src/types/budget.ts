export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  createdAt: Date;
}

export interface MonthlyBudget {
  month: string; // Format: "YYYY-MM"
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  transactions: Transaction[];
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  expensesByCategory: Record<string, number>;
  monthlyData: MonthlyBudget[];
}

// Catégories prédéfinies
export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Loyer', type: 'expense', color: '#ef4444' },
  { name: 'Nourriture', type: 'expense', color: '#f59e0b' },
  { name: 'Transport', type: 'expense', color: '#3b82f6' },
  { name: 'Aide familiale', type: 'expense', color: '#8b5cf6' },
  { name: 'Études frères', type: 'expense', color: '#6366f1' },
  { name: 'Loisirs', type: 'expense', color: '#10b981' },
  { name: 'Santé', type: 'expense', color: '#14b8a6' },
  { name: 'Autres', type: 'expense', color: '#6b7280' },
];

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Salaire', type: 'income', color: '#10b981' },
  { name: 'Freelance', type: 'income', color: '#3b82f6' },
  { name: 'Investissements', type: 'income', color: '#8b5cf6' },
  { name: 'Autres', type: 'income', color: '#6b7280' },
];
