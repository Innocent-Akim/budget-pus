import { Controller, Get, Post, Put, Delete, Body, Param, Request, HttpException, HttpStatus } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async getSessions(@Request() req) {
    try {
      // Pour le test, utiliser un userId par défaut si pas d'authentification
      const userId = req.user?.id || 'test-user-id';
      const sessions = await this.sessionsService.getSessionsByUserId(userId);
      return {
        success: true,
        data: sessions,
        message: 'Sessions récupérées avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des sessions',
          code: 'SESSIONS_FETCH_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('active')
  async getActiveSessions(@Request() req) {
    try {
      const sessions = await this.sessionsService.getActiveSessions(req.user.id);
      return {
        success: true,
        data: sessions,
        message: 'Sessions actives récupérées avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des sessions actives',
          code: 'ACTIVE_SESSIONS_FETCH_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getSession(@Request() req, @Param('id') id: string) {
    try {
      const session = await this.sessionsService.getSession(req.user.id, parseInt(id));
      return {
        success: true,
        data: session,
        message: 'Session récupérée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération de la session',
          code: 'SESSION_FETCH_FAILED'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post()
  async createSession(@Request() req, @Body() createSessionDto: CreateSessionDto) {
    try {
      const session = await this.sessionsService.createSession(req.user.id, createSessionDto);
      return {
        success: true,
        data: session,
        message: 'Session créée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la création de la session',
          code: 'SESSION_CREATE_FAILED'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':id')
  async updateSession(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    try {
      const session = await this.sessionsService.updateSession(req.user.id, parseInt(id), updateSessionDto);
      return {
        success: true,
        data: session,
        message: 'Session mise à jour avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la mise à jour de la session',
          code: 'SESSION_UPDATE_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteSession(@Request() req, @Param('id') id: string) {
    try {
      await this.sessionsService.deleteSession(req.user.id, parseInt(id));
      return {
        success: true,
        message: 'Session supprimée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la suppression de la session',
          code: 'SESSION_DELETE_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cleanup')
  async cleanupExpiredSessions(@Request() req) {
    try {
      const deletedCount = await this.sessionsService.cleanupExpiredSessions(req.user.id);
      return {
        success: true,
        data: { deletedCount },
        message: `${deletedCount} sessions expirées supprimées`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors du nettoyage des sessions',
          code: 'SESSION_CLEANUP_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
