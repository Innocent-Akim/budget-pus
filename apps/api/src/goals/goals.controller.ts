import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGoalDto, UpdateGoalDto, GoalQueryDto } from './dto/goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  async getGoals(@Request() req, @Query() query: GoalQueryDto) {
    return this.goalsService.getGoals(req.user.id, query);
  }

  @Get('summary')
  async getGoalsSummary(@Request() req) {
    return this.goalsService.getGoalsSummary(req.user.id);
  }

  @Get('active')
  async getActiveGoals(@Request() req) {
    return this.goalsService.getActiveGoals(req.user.id);
  }

  @Get('completed')
  async getCompletedGoals(@Request() req) {
    return this.goalsService.getCompletedGoals(req.user.id);
  }

  @Get('by-type/:type')
  async getGoalsByType(@Request() req, @Param('type') type: string) {
    return this.goalsService.getGoalsByType(req.user.id, type);
  }

  @Get('by-status/:status')
  async getGoalsByStatus(@Request() req, @Param('status') status: string) {
    return this.goalsService.getGoalsByStatus(req.user.id, status);
  }

  @Get('progress')
  async getGoalsProgress(@Request() req) {
    return this.goalsService.getGoalsProgress(req.user.id);
  }

  @Get(':id')
  async getGoal(@Request() req, @Param('id') id: string) {
    return this.goalsService.getGoal(req.user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGoal(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.createGoal(req.user.id, createGoalDto);
  }

  @Put(':id')
  async updateGoal(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto
  ) {
    return this.goalsService.updateGoal(req.user.id, id, updateGoalDto);
  }

  @Put(':id/contribute')
  async contributeToGoal(
    @Request() req,
    @Param('id') id: string,
    @Body() contribution: { amount: number }
  ) {
    return this.goalsService.contributeToGoal(req.user.id, id, contribution.amount);
  }

  @Put(':id/complete')
  async completeGoal(@Request() req, @Param('id') id: string) {
    return this.goalsService.completeGoal(req.user.id, id);
  }

  @Put(':id/pause')
  async pauseGoal(@Request() req, @Param('id') id: string) {
    return this.goalsService.pauseGoal(req.user.id, id);
  }

  @Put(':id/resume')
  async resumeGoal(@Request() req, @Param('id') id: string) {
    return this.goalsService.resumeGoal(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGoal(@Request() req, @Param('id') id: string) {
    await this.goalsService.deleteGoal(req.user.id, id);
  }
}
