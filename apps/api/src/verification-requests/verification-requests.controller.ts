import { Controller, Get, Post, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { VerificationRequestsService } from './verification-requests.service';
import { CreateVerificationRequestDto } from './dto/verification-request.dto';

@Controller('verification-requests')
export class VerificationRequestsController {
  constructor(private readonly verificationRequestsService: VerificationRequestsService) {}

  @Get()
  async getVerificationRequests(@Query('identifier') identifier?: string) {
    try {
      const requests = await this.verificationRequestsService.getVerificationRequests(identifier);
      return {
        success: true,
        data: requests,
        message: 'Demandes de vérification récupérées avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des demandes',
          code: 'VERIFICATION_REQUESTS_FETCH_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getVerificationRequest(@Param('id') id: string) {
    try {
      const request = await this.verificationRequestsService.getVerificationRequest(parseInt(id));
      return {
        success: true,
        data: request,
        message: 'Demande de vérification récupérée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération de la demande',
          code: 'VERIFICATION_REQUEST_FETCH_FAILED'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get('token/:token')
  async getVerificationRequestByToken(@Param('token') token: string) {
    try {
      const request = await this.verificationRequestsService.getVerificationRequestByToken(token);
      return {
        success: true,
        data: request,
        message: 'Demande de vérification récupérée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération de la demande',
          code: 'VERIFICATION_REQUEST_FETCH_FAILED'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post()
  async createVerificationRequest(@Body() createVerificationRequestDto: CreateVerificationRequestDto) {
    try {
      const request = await this.verificationRequestsService.createVerificationRequest(createVerificationRequestDto);
      return {
        success: true,
        data: request,
        message: 'Demande de vérification créée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la création de la demande',
          code: 'VERIFICATION_REQUEST_CREATE_FAILED'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async deleteVerificationRequest(@Param('id') id: string) {
    try {
      await this.verificationRequestsService.deleteVerificationRequest(parseInt(id));
      return {
        success: true,
        message: 'Demande de vérification supprimée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la suppression de la demande',
          code: 'VERIFICATION_REQUEST_DELETE_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('token/:token')
  async deleteVerificationRequestByToken(@Param('token') token: string) {
    try {
      await this.verificationRequestsService.deleteVerificationRequestByToken(token);
      return {
        success: true,
        message: 'Demande de vérification supprimée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la suppression de la demande',
          code: 'VERIFICATION_REQUEST_DELETE_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cleanup')
  async cleanupExpiredRequests() {
    try {
      const deletedCount = await this.verificationRequestsService.cleanupExpiredRequests();
      return {
        success: true,
        data: { deletedCount },
        message: `${deletedCount} demandes expirées supprimées`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors du nettoyage des demandes',
          code: 'VERIFICATION_REQUEST_CLEANUP_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('verify/:token')
  async verifyRequest(@Param('token') token: string) {
    try {
      const isValid = await this.verificationRequestsService.verifyRequest(token);
      return {
        success: true,
        data: { isValid },
        message: isValid ? 'Token valide' : 'Token invalide ou expiré'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la vérification',
          code: 'VERIFICATION_FAILED'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
