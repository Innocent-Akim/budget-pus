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

@Entity('accounts')
@Index(['compoundId'], { unique: true })
@Index(['providerAccountId'])
@Index(['providerId'])
@Index(['userId'])
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'compound_id', unique: true })
  compoundId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'provider_type' })
  providerType: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  @Column({ name: 'provider_account_id' })
  providerAccountId: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'access_token_expires', type: 'timestamptz', nullable: true })
  accessTokenExpires: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}