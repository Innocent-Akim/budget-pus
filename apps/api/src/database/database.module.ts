import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from '../../config/app.config';
import { DatabaseService } from './database.service';
import { User, Transaction, Goal, Account, Session, VerificationRequest } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...appConfig.database,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Transaction, Goal, Account, Session, VerificationRequest]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
