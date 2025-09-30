import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { Goal } from '../entities/goal.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    private readonly dataSource: DataSource,
  ) {}

  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return await this.findUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  // Transaction operations
  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    return await this.transactionRepository.save(transaction);
  }

  async findTransactionsByUserId(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findTransactionById(id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> {
    await this.transactionRepository.update(id, transactionData);
    return await this.findTransactionById(id);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await this.transactionRepository.delete(id);
    return result.affected > 0;
  }

  // Goal operations
  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    const goal = this.goalRepository.create(goalData);
    return await this.goalRepository.save(goal);
  }

  async findGoalsByUserId(userId: string): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findGoalById(id: string): Promise<Goal | null> {
    return await this.goalRepository.findOne({ where: { id } });
  }

  async updateGoal(id: string, goalData: Partial<Goal>): Promise<Goal | null> {
    await this.goalRepository.update(id, goalData);
    return await this.findGoalById(id);
  }

  async deleteGoal(id: string): Promise<boolean> {
    const result = await this.goalRepository.delete(id);
    return result.affected > 0;
  }

  // Analytics operations
  async getUserFinancialSummary(userId: string, startDate?: Date, endDate?: Date) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    if (startDate) {
      query.andWhere('transaction.date >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('transaction.date <= :endDate', { endDate });
    }

    const transactions = await query.getMany();

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      transactionCount: transactions.length,
    };
  }

  // Database health check
  async isConnected(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Transaction with rollback support
  async runInTransaction<T>(fn: (manager: any) => Promise<T>): Promise<T> {
    return await this.dataSource.transaction(fn);
  }
}
