import { Controller, Get, Put, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Get('settings')
  async getSettings(@Request() req) {
    return this.userService.getSettings(req.user.id);
  }

  @Put('settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateSettings(req.user.id, updateUserDto);
  }

  @Put('monthly-income')
  @HttpCode(HttpStatus.OK)
  async updateMonthlyIncome(@Request() req, @Body() body: { monthlyIncome: number }) {
    return this.userService.updateMonthlyIncome(req.user.id, body.monthlyIncome);
  }

  @Get('stats')
  async getUserStats(@Request() req) {
    return this.userService.getUserStats(req.user.id);
  }
}
