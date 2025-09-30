import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/accounts.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAccount(userId: string, id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Compte non trouvé');
    }

    return account;
  }

  async createAccount(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    // Vérifier si un compte avec le même compound_id existe déjà
    const existingAccount = await this.accountRepository.findOne({
      where: { compoundId: createAccountDto.compoundId },
    });

    if (existingAccount) {
      throw new ConflictException('Un compte avec cet identifiant existe déjà');
    }

    const account = this.accountRepository.create({
      ...createAccountDto,
      userId,
    });

    return this.accountRepository.save(account);
  }

  async updateAccount(
    userId: string,
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.getAccount(userId, id);
    
    Object.assign(account, updateAccountDto);
    
    return this.accountRepository.save(account);
  }

  async deleteAccount(userId: string, id: number): Promise<void> {
    const account = await this.getAccount(userId, id);
    
    await this.accountRepository.remove(account);
  }

  async getAccountsByProvider(userId: string, providerType: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId, providerType },
      order: { createdAt: 'DESC' },
    });
  }

  async getAccountByProviderId(
    userId: string,
    providerType: string,
    providerAccountId: string,
  ): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { userId, providerType, providerAccountId },
    });
  }

  async updateAccessToken(
    userId: string,
    id: number,
    accessToken: string,
    accessTokenExpires?: Date,
  ): Promise<Account> {
    const account = await this.getAccount(userId, id);
    
    account.accessToken = accessToken;
    if (accessTokenExpires) {
      account.accessTokenExpires = accessTokenExpires;
    }
    
    return this.accountRepository.save(account);
  }

  async updateRefreshToken(
    userId: string,
    id: number,
    refreshToken: string,
  ): Promise<Account> {
    const account = await this.getAccount(userId, id);
    
    account.refreshToken = refreshToken;
    
    return this.accountRepository.save(account);
  }
}
