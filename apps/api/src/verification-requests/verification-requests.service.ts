import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { VerificationRequest } from '../entities/verification-request.entity';
import { CreateVerificationRequestDto } from './dto/verification-request.dto';

@Injectable()
export class VerificationRequestsService {
  constructor(
    @InjectRepository(VerificationRequest)
    private verificationRequestRepository: Repository<VerificationRequest>,
  ) {}

  async getVerificationRequests(identifier?: string): Promise<VerificationRequest[]> {
    const whereCondition = identifier ? { identifier } : {};
    
    return this.verificationRequestRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async getVerificationRequest(id: number): Promise<VerificationRequest> {
    const request = await this.verificationRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Demande de vérification non trouvée');
    }

    return request;
  }

  async getVerificationRequestByToken(token: string): Promise<VerificationRequest> {
    const request = await this.verificationRequestRepository.findOne({
      where: { token },
    });

    if (!request) {
      throw new NotFoundException('Demande de vérification non trouvée');
    }

    return request;
  }

  async createVerificationRequest(createVerificationRequestDto: CreateVerificationRequestDto): Promise<VerificationRequest> {
    // Vérifier si une demande avec le même token existe déjà
    const existingRequest = await this.verificationRequestRepository.findOne({
      where: { token: createVerificationRequestDto.token },
    });

    if (existingRequest) {
      throw new ConflictException('Une demande avec ce token existe déjà');
    }

    const request = this.verificationRequestRepository.create(createVerificationRequestDto);

    return this.verificationRequestRepository.save(request);
  }

  async deleteVerificationRequest(id: number): Promise<void> {
    const request = await this.getVerificationRequest(id);
    
    await this.verificationRequestRepository.remove(request);
  }

  async deleteVerificationRequestByToken(token: string): Promise<void> {
    const request = await this.getVerificationRequestByToken(token);
    
    await this.verificationRequestRepository.remove(request);
  }

  async cleanupExpiredRequests(): Promise<number> {
    const now = new Date();
    const expiredRequests = await this.verificationRequestRepository.find({
      where: { expires: LessThan(now) },
    });

    if (expiredRequests.length > 0) {
      await this.verificationRequestRepository.remove(expiredRequests);
    }

    return expiredRequests.length;
  }

  async verifyRequest(token: string): Promise<boolean> {
    try {
      const request = await this.getVerificationRequestByToken(token);
      const now = new Date();
      
      // Vérifier si le token n'est pas expiré
      return request.expires > now;
    } catch {
      return false;
    }
  }

  async generateVerificationToken(identifier: string, expiresInHours: number = 24): Promise<string> {
    // Générer un token aléatoire
    const token = this.generateRandomToken();
    
    // Calculer la date d'expiration
    const expires = new Date();
    expires.setHours(expires.getHours() + expiresInHours);

    // Créer la demande de vérification
    await this.createVerificationRequest({
      identifier,
      token,
      expires: expires.toISOString(),
    });

    return token;
  }

  private generateRandomToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
