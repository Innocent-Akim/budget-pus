import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('verification_requests')
@Index(['token'], { unique: true })
export class VerificationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expires: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
