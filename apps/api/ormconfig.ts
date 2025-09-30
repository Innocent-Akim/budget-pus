import { DataSource } from 'typeorm';
import { appConfig } from './config/app.config';
import { User, Transaction, Goal, Account, Session, VerificationRequest } from './src/entities';

export default new DataSource({
  ...appConfig.database,
  entities: [User, Transaction, Goal, Account, Session, VerificationRequest],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always false for migrations
});
