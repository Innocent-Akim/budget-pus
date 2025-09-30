import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getHealth() {
    const isDbConnected = await this.databaseService.isConnected();
    
    return {
      status: isDbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: isDbConnected,
        status: isDbConnected ? 'up' : 'down',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('database')
  async getDatabaseHealth() {
    const isConnected = await this.databaseService.isConnected();
    
    return {
      connected: isConnected,
      status: isConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }
}
