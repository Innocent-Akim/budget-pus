import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Request() req, @Query() query: TransactionQueryDto) {
    return this.transactionsService.getTransactions(req.user.id, query);
  }

  @Get('summary')
  async getTransactionSummary(@Request() req, @Query('month') month?: string) {
    return this.transactionsService.getTransactionSummary(req.user.id, month);
  }

  @Get('expenses-by-category')
  async getExpensesByCategory(@Request() req, @Query('month') month?: string) {
    return this.transactionsService.getExpensesByCategory(req.user.id, month);
  }

  @Get('income-by-category')
  async getIncomeByCategory(@Request() req, @Query('month') month?: string) {
    return this.transactionsService.getIncomeByCategory(req.user.id, month);
  }

  @Get('month/:month')
  async getTransactionsByMonth(@Request() req, @Param('month') month: string) {
    return this.transactionsService.getTransactionsByMonth(req.user.id, month);
  }

  @Get('year/:year')
  async getTransactionsByYear(@Request() req, @Param('year') year: string) {
    return this.transactionsService.getTransactionsByYear(req.user.id, year);
  }

  @Get('category/:category')
  async getTransactionsByCategory(@Request() req, @Param('category') category: string) {
    return this.transactionsService.getTransactionsByCategory(req.user.id, category);
  }

  @Get('type/:type')
  async getTransactionsByType(@Request() req, @Param('type') type: string) {
    return this.transactionsService.getTransactionsByType(req.user.id, type);
  }

  @Get('date-range')
  async getTransactionsByDateRange(
    @Request() req,
    @Query('start') startDate: string,
    @Query('end') endDate: string
  ) {
    return this.transactionsService.getTransactionsByDateRange(req.user.id, startDate, endDate);
  }

  @Get('recurring')
  async getRecurringTransactions(@Request() req) {
    return this.transactionsService.getRecurringTransactions(req.user.id);
  }

  @Get('search')
  async searchTransactions(@Request() req, @Query('q') query: string) {
    return this.transactionsService.searchTransactions(req.user.id, query);
  }

  @Get('tags')
  async getTransactionsByTags(@Request() req, @Query('tags') tags: string) {
    const tagsArray = tags.split(',').map(tag => tag.trim());
    return this.transactionsService.getTransactionsByTags(req.user.id, tagsArray);
  }

  @Get(':id')
  async getTransaction(@Request() req, @Param('id') id: string) {
    return this.transactionsService.getTransaction(req.user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(req.user.id, createTransactionDto);
  }

  @Post('recurring')
  @HttpCode(HttpStatus.CREATED)
  async createRecurringTransaction(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createRecurringTransaction(req.user.id, createTransactionDto);
  }

  @Put(':id')
  async updateTransaction(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionsService.updateTransaction(req.user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Request() req, @Param('id') id: string) {
    await this.transactionsService.deleteTransaction(req.user.id, id);
  }
}
