export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum TransactionCategory {
  // Income categories
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  BONUS = 'bonus',
  OTHER_INCOME = 'other_income',

  // Expense categories
  FOOD = 'food',
  TRANSPORT = 'transport',
  HOUSING = 'housing',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  EDUCATION = 'education',
  TRAVEL = 'travel',
  OTHER_EXPENSE = 'other_expense',
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
  notes?: string;
  tags?: string[];
  isRecurring: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
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

export enum GoalType {
  SAVINGS = 'savings',
  DEBT_PAYOFF = 'debt_payoff',
  EMERGENCY_FUND = 'emergency_fund',
  VACATION = 'vacation',
  PURCHASE = 'purchase',
  INVESTMENT = 'investment',
  OTHER = 'other',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  monthlyContribution?: number;
  color?: string;
  icon?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
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

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  createdAt: Date;
}
export interface Session {
  id: string;
  name: string;
  type: string;
  balance: number;
  createdAt: Date;
}

export interface VerificationRequest {
  id: string;
  name: string;
  type: string;
  balance: number;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
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

// Mapping des catégories enum vers les noms français
export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  [TransactionCategory.SALARY]: 'Salaire',
  [TransactionCategory.FREELANCE]: 'Freelance',
  [TransactionCategory.INVESTMENT]: 'Investissement',
  [TransactionCategory.BONUS]: 'Prime',
  [TransactionCategory.OTHER_INCOME]: 'Autre revenu',
  [TransactionCategory.FOOD]: 'Nourriture',
  [TransactionCategory.TRANSPORT]: 'Transport',
  [TransactionCategory.HOUSING]: 'Logement',
  [TransactionCategory.UTILITIES]: 'Services publics',
  [TransactionCategory.HEALTHCARE]: 'Santé',
  [TransactionCategory.ENTERTAINMENT]: 'Loisirs',
  [TransactionCategory.SHOPPING]: 'Shopping',
  [TransactionCategory.EDUCATION]: 'Éducation',
  [TransactionCategory.TRAVEL]: 'Voyage',
  [TransactionCategory.OTHER_EXPENSE]: 'Autre dépense',
};

// Catégories par type
export const INCOME_CATEGORIES = [
  TransactionCategory.SALARY,
  TransactionCategory.FREELANCE,
  TransactionCategory.INVESTMENT,
  TransactionCategory.BONUS,
  TransactionCategory.OTHER_INCOME,
];

export const EXPENSE_CATEGORIES = [
  TransactionCategory.FOOD,
  TransactionCategory.TRANSPORT,
  TransactionCategory.HOUSING,
  TransactionCategory.UTILITIES,
  TransactionCategory.HEALTHCARE,
  TransactionCategory.ENTERTAINMENT,
  TransactionCategory.SHOPPING,
  TransactionCategory.EDUCATION,
  TransactionCategory.TRAVEL,
  TransactionCategory.OTHER_EXPENSE,
];
