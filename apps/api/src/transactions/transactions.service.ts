import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Transaction, TransactionType, TransactionCategory } from '../entities/transaction.entity';
import { User } from '../entities/user.entity';
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTransactions(userId: string, query: TransactionQueryDto): Promise<Transaction[]> {
    const {
      type,
      category,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      sortBy = 'date',
      sortOrder = 'DESC'
    } = query;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .orderBy(`transaction.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .limit(limit)
      .offset(offset);

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere('transaction.category = :category', { category });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return queryBuilder.getMany();
  }

  async getTransaction(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction non trouvée');
    }

    return transaction;
  }

  async createTransaction(userId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);
    await this.updateUserTotals(userId);

    return savedTransaction;
  }

  async createRecurringTransaction(userId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId,
      isRecurring: true,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);
    await this.updateUserTotals(userId);

    return savedTransaction;
  }

  async updateTransaction(userId: string, id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.getTransaction(userId, id);

    Object.assign(transaction, updateTransactionDto);
    const updatedTransaction = await this.transactionRepository.save(transaction);
    await this.updateUserTotals(userId);

    return updatedTransaction;
  }

  async deleteTransaction(userId: string, id: string): Promise<void> {
    const transaction = await this.getTransaction(userId, id);
    await this.transactionRepository.remove(transaction);
    await this.updateUserTotals(userId);
  }

  async getTransactionsByMonth(userId: string, month: string): Promise<Transaction[]> {
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

    return this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByYear(userId: string, year: string): Promise<Transaction[]> {
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    return this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        userId,
        category: category as TransactionCategory,
      },
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByType(userId: string, type: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        userId,
        type: type as TransactionType,
      },
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByDateRange(userId: string, startDate: string, endDate: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        userId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      order: { date: 'DESC' },
    });
  }

  async getRecurringTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        userId,
        isRecurring: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async searchTransactions(userId: string, query: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [
        { userId, description: Like(`%${query}%`) },
        { userId, notes: Like(`%${query}%`) },
      ],
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByTags(userId: string, tags: string[]): Promise<Transaction[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    tags.forEach((tag, index) => {
      queryBuilder.andWhere(`transaction.tags LIKE :tag${index}`, { [`tag${index}`]: `%${tag}%` });
    });

    return queryBuilder.getMany();
  }

  async getTransactionSummary(userId: string, month?: string) {
    let whereCondition: any = { userId };

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
      whereCondition.date = Between(startDate, endDate);
    }

    const [incomeResult, expenseResult] = await Promise.all([
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where({ ...whereCondition, type: TransactionType.INCOME })
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where({ ...whereCondition, type: TransactionType.EXPENSE })
        .getRawOne(),
    ]);

    const totalIncome = parseFloat(incomeResult?.total || '0');
    const totalExpenses = parseFloat(expenseResult?.total || '0');
    const savings = totalIncome - totalExpenses;

    const transactionCount = await this.transactionRepository.count({ where: whereCondition });

    return {
      totalIncome,
      totalExpenses,
      savings,
      transactionCount,
    };
  }

  async getExpensesByCategory(userId: string, month?: string): Promise<Record<string, number>> {
    let whereCondition: any = { userId, type: TransactionType.EXPENSE };

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
      whereCondition.date = Between(startDate, endDate);
    }

    const results = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'total')
      .where(whereCondition)
      .groupBy('transaction.category')
      .getRawMany();

    const expensesByCategory: Record<string, number> = {};
    results.forEach(result => {
      expensesByCategory[result.category] = parseFloat(result.total);
    });

    return expensesByCategory;
  }

  async getIncomeByCategory(userId: string, month?: string): Promise<Record<string, number>> {
    let whereCondition: any = { userId, type: TransactionType.INCOME };

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
      whereCondition.date = Between(startDate, endDate);
    }

    const results = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'total')
      .where(whereCondition)
      .groupBy('transaction.category')
      .getRawMany();

    const incomeByCategory: Record<string, number> = {};
    results.forEach(result => {
      incomeByCategory[result.category] = parseFloat(result.total);
    });

    return incomeByCategory;
  }

  private async updateUserTotals(userId: string): Promise<void> {
    const summary = await this.getTransactionSummary(userId);
    
    await this.userRepository.update(userId, {
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      totalSavings: summary.savings,
    });
  }
}
