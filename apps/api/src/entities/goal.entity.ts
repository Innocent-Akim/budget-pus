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

@Entity('goals')
@Index(['userId', 'status'])
@Index(['userId', 'type'])
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: GoalType,
  })
  type: GoalType;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.ACTIVE,
  })
  status: GoalStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'date' })
  targetDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyContribution: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  icon: string;

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

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Calculated properties
  get progress(): number {
    return this.targetAmount > 0 ? (this.currentAmount / this.targetAmount) * 100 : 0;
  }

  get remainingAmount(): number {
    return Math.max(0, this.targetAmount - this.currentAmount);
  }

  get isCompleted(): boolean {
    return this.currentAmount >= this.targetAmount || this.status === GoalStatus.COMPLETED;
  }

  get isOverdue(): boolean {
    return new Date() > this.targetDate && !this.isCompleted;
  }

  get daysRemaining(): number {
    const today = new Date();
    const diffTime = this.targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get suggestedMonthlyContribution(): number {
    if (this.monthlyContribution) return this.monthlyContribution;
    
    const monthsRemaining = Math.max(1, this.daysRemaining / 30);
    return this.remainingAmount / monthsRemaining;
  }
}
