import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Session } from '../entities/session.entity';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async getSessionsByUserId(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getActiveSessions(userId: string): Promise<Session[]> {
    const now = new Date();
    return this.sessionRepository.find({
      where: { userId, expires: LessThan(now) },
      order: { createdAt: 'DESC' },
    });
  }

  async getSession(userId: string, id: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id, userId },
    });

    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    return session;
  }

  async getSessionByToken(sessionToken: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { sessionToken },
    });
  }

  async getSessionByAccessToken(accessToken: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { accessToken },
    });
  }

  async createSession(userId: string, createSessionDto: CreateSessionDto): Promise<Session> {
    // Vérifier si une session avec le même token existe déjà
    const existingSession = await this.sessionRepository.findOne({
      where: { sessionToken: createSessionDto.sessionToken },
    });

    if (existingSession) {
      throw new ConflictException('Une session avec ce token existe déjà');
    }

    const session = this.sessionRepository.create({
      ...createSessionDto,
      userId,
    });

    return this.sessionRepository.save(session);
  }

  async updateSession(
    userId: string,
    id: number,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.getSession(userId, id);
    
    Object.assign(session, updateSessionDto);
    
    return this.sessionRepository.save(session);
  }

  async deleteSession(userId: string, id: number): Promise<void> {
    const session = await this.getSession(userId, id);
    
    await this.sessionRepository.remove(session);
  }

  async deleteSessionByToken(sessionToken: string): Promise<void> {
    const session = await this.getSessionByToken(sessionToken);
    if (session) {
      await this.sessionRepository.remove(session);
    }
  }

  async cleanupExpiredSessions(userId?: string): Promise<number> {
    const now = new Date();
    const whereCondition = userId 
      ? { userId, expires: LessThan(now) }
      : { expires: LessThan(now) };

    const expiredSessions = await this.sessionRepository.find({
      where: whereCondition,
    });

    if (expiredSessions.length > 0) {
      await this.sessionRepository.remove(expiredSessions);
    }

    return expiredSessions.length;
  }

  async extendSession(userId: string, id: number, newExpiryDate: Date): Promise<Session> {
    const session = await this.getSession(userId, id);
    
    session.expires = newExpiryDate;
    
    return this.sessionRepository.save(session);
  }

  async revokeAllSessions(userId: string): Promise<number> {
    const sessions = await this.getSessionsByUserId(userId);
    
    if (sessions.length > 0) {
      await this.sessionRepository.remove(sessions);
    }

    return sessions.length;
  }
}
