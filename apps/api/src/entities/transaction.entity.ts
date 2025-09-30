import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';

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

@Entity('transactions')
@Index(['userId', 'date'])
@Index(['userId', 'type'])
@Index(['userId', 'category'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCategory,
  })
  category: TransactionCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  tags: string; // JSON string array

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringPattern: string; // 'monthly', 'weekly', 'yearly'

  @Column({ nullable: true })
  recurringEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Helper methods
  get isIncome(): boolean {
    return this.type === TransactionType.INCOME;
  }

  get isExpense(): boolean {
    return this.type === TransactionType.EXPENSE;
  }

  get isTransfer(): boolean {
    return this.type === TransactionType.TRANSFER;
  }

  get tagsArray(): string[] {
    return this.tags ? JSON.parse(this.tags) : [];
  }

  setTagsArray(tags: string[]): void {
    this.tags = JSON.stringify(tags);
  }
}
