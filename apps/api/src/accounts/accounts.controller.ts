import { Controller, Get, Post, Put, Delete, Body, Param, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getAccounts(@Request() req) {
    try {
      // Pour le test, utiliser un userId par défaut si pas d'authentification
      const userId = req.user?.id || 'test-user-id';
      const accounts = await this.accountsService.getAccountsByUserId(userId);
      return {
        success: true,
        data: accounts,
        message: 'Comptes récupérés avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des comptes',
          code: 'ACCOUNTS_FETCH_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getAccount(@Request() req, @Param('id') id: string) {
    try {
      const account = await this.accountsService.getAccount(req.user.id, parseInt(id));
      return {
        success: true,
        data: account,
        message: 'Compte récupéré avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération du compte',
          code: 'ACCOUNT_FETCH_FAILED'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post()
  async createAccount(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    try {
      const account = await this.accountsService.createAccount(req.user.id, createAccountDto);
      return {
        success: true,
        data: account,
        message: 'Compte créé avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la création du compte',
          code: 'ACCOUNT_CREATE_FAILED'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':id')
  async updateAccount(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    try {
      const account = await this.accountsService.updateAccount(req.user.id, parseInt(id), updateAccountDto);
      return {
        success: true,
        data: account,
        message: 'Compte mis à jour avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la mise à jour du compte',
          code: 'ACCOUNT_UPDATE_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteAccount(@Request() req, @Param('id') id: string) {
    try {
      await this.accountsService.deleteAccount(req.user.id, parseInt(id));
      return {
        success: true,
        message: 'Compte supprimé avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la suppression du compte',
          code: 'ACCOUNT_DELETE_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('provider/:providerType')
  async getAccountsByProvider(@Request() req, @Param('providerType') providerType: string) {
    try {
      const accounts = await this.accountsService.getAccountsByProvider(req.user.id, providerType);
      return {
        success: true,
        data: accounts,
        message: `Comptes ${providerType} récupérés avec succès`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des comptes',
          code: 'ACCOUNTS_BY_PROVIDER_FETCH_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
