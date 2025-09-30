import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalType, GoalStatus } from '../entities/goal.entity';
import { User } from '../entities/user.entity';
import { CreateGoalDto, UpdateGoalDto, GoalQueryDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getGoals(userId: string, query: GoalQueryDto): Promise<Goal[]> {
    const {
      type,
      status,
      limit = 50,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = query;

    const queryBuilder = this.goalRepository
      .createQueryBuilder('goal')
      .where('goal.userId = :userId', { userId })
      .orderBy(`goal.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .limit(limit)
      .offset(offset);

    if (type) {
      queryBuilder.andWhere('goal.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('goal.status = :status', { status });
    }

    return queryBuilder.getMany();
  }

  async getGoal(userId: string, id: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException('Objectif non trouvé');
    }

    return goal;
  }

  async createGoal(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId,
    });

    return this.goalRepository.save(goal);
  }

  async updateGoal(userId: string, id: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.getGoal(userId, id);

    Object.assign(goal, updateGoalDto);
    return this.goalRepository.save(goal);
  }

  async deleteGoal(userId: string, id: string): Promise<void> {
    const goal = await this.getGoal(userId, id);
    await this.goalRepository.remove(goal);
  }

  async getActiveGoals(userId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: {
        userId,
        status: GoalStatus.ACTIVE,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getCompletedGoals(userId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: {
        userId,
        status: GoalStatus.COMPLETED,
      },
      order: { updatedAt: 'DESC' },
    });
  }

  async getGoalsByType(userId: string, type: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: {
        userId,
        type: type as GoalType,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getGoalsByStatus(userId: string, status: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: {
        userId,
        status: status as GoalStatus,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getGoalsSummary(userId: string) {
    const [activeGoals, completedGoals, totalGoals] = await Promise.all([
      this.goalRepository.count({ where: { userId, status: GoalStatus.ACTIVE } }),
      this.goalRepository.count({ where: { userId, status: GoalStatus.COMPLETED } }),
      this.goalRepository.count({ where: { userId } }),
    ]);

    const goals = await this.goalRepository.find({
      where: { userId, status: GoalStatus.ACTIVE },
    });

    const totalTargetAmount = goals.reduce((sum, goal) => sum + parseFloat(goal.targetAmount.toString()), 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount.toString()), 0);
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      overallProgress: Math.round(overallProgress * 100) / 100,
    };
  }

  async getGoalsProgress(userId: string) {
    const goals = await this.goalRepository.find({
      where: { userId, status: GoalStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    return goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      targetAmount: parseFloat(goal.targetAmount.toString()),
      currentAmount: parseFloat(goal.currentAmount.toString()),
      progress: goal.targetAmount > 0 ? (parseFloat(goal.currentAmount.toString()) / parseFloat(goal.targetAmount.toString())) * 100 : 0,
      targetDate: goal.targetDate,
      type: goal.type,
      status: goal.status,
    }));
  }

  async contributeToGoal(userId: string, id: string, amount: number): Promise<Goal> {
    if (amount <= 0) {
      throw new BadRequestException('Le montant de la contribution doit être positif');
    }

    const goal = await this.getGoal(userId, id);
    
    if (goal.status !== GoalStatus.ACTIVE) {
      throw new BadRequestException('Impossible de contribuer à un objectif inactif');
    }

    const newCurrentAmount = parseFloat(goal.currentAmount.toString()) + amount;
    goal.currentAmount = newCurrentAmount;

    // Vérifier si l'objectif est atteint
    if (newCurrentAmount >= parseFloat(goal.targetAmount.toString())) {
      goal.status = GoalStatus.COMPLETED;
      goal.currentAmount = goal.targetAmount;
    }

    return this.goalRepository.save(goal);
  }

  async completeGoal(userId: string, id: string): Promise<Goal> {
    const goal = await this.getGoal(userId, id);
    goal.status = GoalStatus.COMPLETED;
    goal.currentAmount = goal.targetAmount;
    return this.goalRepository.save(goal);
  }

  async pauseGoal(userId: string, id: string): Promise<Goal> {
    const goal = await this.getGoal(userId, id);
    
    if (goal.status !== GoalStatus.ACTIVE) {
      throw new BadRequestException('Seuls les objectifs actifs peuvent être mis en pause');
    }

    goal.status = GoalStatus.PAUSED;
    return this.goalRepository.save(goal);
  }

  async resumeGoal(userId: string, id: string): Promise<Goal> {
    const goal = await this.getGoal(userId, id);
    
    if (goal.status !== GoalStatus.PAUSED) {
      throw new BadRequestException('Seuls les objectifs en pause peuvent être repris');
    }

    goal.status = GoalStatus.ACTIVE;
    return this.goalRepository.save(goal);
  }
}
