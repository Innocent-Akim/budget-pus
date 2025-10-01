import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { SessionsModule } from './sessions/sessions.module';
import { VerificationRequestsModule } from './verification-requests/verification-requests.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GoalsModule } from './goals/goals.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule, 
    HealthModule,
    AuthModule,
    AccountsModule,
    SessionsModule,
    VerificationRequestsModule,
    TransactionsModule,
    GoalsModule,
    UserModule
  ],

})
export class AppModule {}
