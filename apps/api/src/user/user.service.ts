import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'avatar', 'currency', 'language', 'theme', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async getSettings(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'currency', 'language', 'theme', 'totalIncome', 'totalExpenses', 'totalSavings'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      currency: user.currency,
      language: user.language,
      theme: user.theme,
      monthlyIncome: user.totalIncome,
      totalExpenses: user.totalExpenses,
      totalSavings: user.totalSavings,
    };
  }

  async updateSettings(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return {
      currency: updatedUser.currency,
      language: updatedUser.language,
      theme: updatedUser.theme,
      monthlyIncome: updatedUser.totalIncome,
      totalExpenses: updatedUser.totalExpenses,
      totalSavings: updatedUser.totalSavings,
    };
  }

  async updateMonthlyIncome(userId: string, monthlyIncome: number) {
    if (monthlyIncome < 0) {
      throw new Error('Le revenu mensuel ne peut pas être négatif');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    user.totalIncome = monthlyIncome;
    await this.userRepository.save(user);

    return {
      monthlyIncome: user.totalIncome,
      message: 'Revenu mensuel mis à jour avec succès',
    };
  }

  async getUserStats(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['totalIncome', 'totalExpenses', 'totalSavings', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const balance = user.totalIncome - user.totalExpenses;
    const savingsRate = user.totalIncome > 0 ? (user.totalSavings / user.totalIncome) * 100 : 0;

    return {
      totalIncome: user.totalIncome,
      totalExpenses: user.totalExpenses,
      totalSavings: user.totalSavings,
      balance,
      savingsRate: Math.round(savingsRate * 100) / 100,
      memberSince: user.createdAt,
    };
  }
}
