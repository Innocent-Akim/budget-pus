import { ApiClient } from "@/lib/api-client";
import { Transaction, TransactionType, TransactionCategory } from "@/types/budget";

export interface CreateTransactionRequest {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string; // ISO date string
  notes?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: string; // ISO date string
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

class TransactionsService {
  constructor(private readonly apiClient: ApiClient) {}

  // CRUD Operations
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';
    return await this.apiClient.get(url);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return await this.apiClient.get(`/transactions/${id}`);
  }

  async createTransaction(transaction: CreateTransactionRequest): Promise<Transaction> {
    return await this.apiClient.post('/transactions', transaction);
  }

  async updateTransaction(id: string, transaction: UpdateTransactionRequest): Promise<Transaction> {
    return await this.apiClient.put(`/transactions/${id}`, transaction);
  }
  
  async deleteTransaction(id: string): Promise<void> {
    await this.apiClient.delete(`/transactions/${id}`);
  }

  // Filtered queries
  async getTransactionsByMonth(month: string): Promise<Transaction[]> {
    return await this.apiClient.get(`/transactions/month/${month}`);
  }
  
  async getTransactionsByYear(year: string): Promise<Transaction[]> {
    return await this.apiClient.get(`/transactions/year/${year}`);
  }

  async getTransactionsByCategory(category: TransactionCategory): Promise<Transaction[]> {
    return await this.apiClient.get(`/transactions/category/${category}`);
  }
  
  async getTransactionsByType(type: TransactionType): Promise<Transaction[]> {
    return await this.apiClient.get(`/transactions/type/${type}`);
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return await this.apiClient.get(`/transactions/date-range?start=${startDate}&end=${endDate}`);
  }

  // Analytics and summaries
  async getTransactionSummary(month?: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    transactionCount: number;
  }> {
    const url = month ? `/transactions/summary?month=${month}` : '/transactions/summary';
    return await this.apiClient.get(url);
  }

  async getExpensesByCategory(month?: string): Promise<Record<string, number>> {
    const url = month ? `/transactions/expenses-by-category?month=${month}` : '/transactions/expenses-by-category';
    return await this.apiClient.get(url);
  }

  async getIncomeByCategory(month?: string): Promise<Record<string, number>> {
    const url = month ? `/transactions/income-by-category?month=${month}` : '/transactions/income-by-category';
    return await this.apiClient.get(url);
  }

  // Recurring transactions
  async getRecurringTransactions(): Promise<Transaction[]> {
    return await this.apiClient.get('/transactions/recurring');
  }

  async createRecurringTransaction(transaction: CreateTransactionRequest): Promise<Transaction> {
    return await this.apiClient.post('/transactions/recurring', transaction);
  }

  // Search and advanced queries
  async searchTransactions(query: string): Promise<Transaction[]> {
    return await this.apiClient.get(`/transactions/search?q=${encodeURIComponent(query)}`);
  }

  async getTransactionsByTags(tags: string[]): Promise<Transaction[]> {
    const tagsParam = tags.join(',');
    return await this.apiClient.get(`/transactions/tags?tags=${encodeURIComponent(tagsParam)}`);
  }
}

export const transactionsService = new TransactionsService(new ApiClient());