import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Goal } from './goal.entity';
import { Account } from './accounts.entity';
import { Session } from './session.entity';


@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'email_verified', type: 'timestamptz', nullable: true })
  emailVerified: Date;

  @Column({ name: 'image', nullable: true })
  image: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'light' })
  theme: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalIncome: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpenses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSavings: number;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  // Calculated properties
  get balance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  get savingsRate(): number {
    return this.totalIncome > 0 ? (this.totalSavings / this.totalIncome) * 100 : 0;
  }
}
