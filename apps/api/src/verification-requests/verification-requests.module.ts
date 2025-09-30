import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationRequestsController } from './verification-requests.controller';
import { VerificationRequestsService } from './verification-requests.service';
import { VerificationRequest } from '../entities/verification-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationRequest])],
  controllers: [VerificationRequestsController],
  providers: [VerificationRequestsService],
  exports: [VerificationRequestsService],
})
export class VerificationRequestsModule {}
