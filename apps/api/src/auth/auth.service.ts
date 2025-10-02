import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Account } from '../entities/accounts.entity';
import { Session } from '../entities/session.entity';
import { VerificationRequest } from '../entities/verification-request.entity';
import { EmailService } from '../services/email.service';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    emailVerified?: Date;
  };
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(VerificationRequest)
    private verificationRequestRepository: Repository<VerificationRequest>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { name, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
      lastLoginAt: null, // Explicitement défini à null pour la première connexion
    });

    const savedUser = await this.userRepository.save(user);

    const account = this.accountRepository.create({
      compoundId: `credentials:${savedUser.id}`,
      userId: savedUser.id,
      providerType: 'credentials',
      providerId: 'credentials',
      providerAccountId: savedUser.id,
    });

    await this.accountRepository.save(account);

    const payload = { sub: savedUser.id, email: savedUser.email };
    const accessToken = this.jwtService.sign(payload);

    const session = this.sessionRepository.create({
      userId: savedUser.id,
      sessionToken: this.generateSessionToken(),
      accessToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    });

    await this.sessionRepository.save(session);

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        image: savedUser.image,
        emailVerified: savedUser.emailVerified,
      },
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    if (!user.password) {
      throw new UnauthorizedException('Ce compte utilise une connexion OAuth. Veuillez vous connecter avec Google.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier si c'est la première connexion
    const isFirstLogin = !user.lastLoginAt;
    
    // Mettre à jour la dernière connexion
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Envoyer un email de bienvenue si c'est la première connexion
    if (isFirstLogin) {
      try {
        await this.emailService.sendWelcomeEmail(user.email, user.name);
        console.log(`🎉 Email de bienvenue envoyé à ${user.email} pour sa première connexion`);
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
        // Ne pas bloquer la connexion si l'email échoue
      }
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    let session = await this.sessionRepository.findOne({ where: { userId: user.id } });
    if (session) {
      session.sessionToken = this.generateSessionToken();
      session.accessToken = accessToken;
      session.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await this.sessionRepository.save(session);
    } else {
      session = this.sessionRepository.create({
        userId: user.id,
        sessionToken: this.generateSessionToken(),
        accessToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await this.sessionRepository.save(session);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      },
      accessToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.sessionRepository.delete({ userId });
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getSessionByToken(sessionToken: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ 
      where: { sessionToken },
      relations: ['user']
    });
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async createVerificationRequest(identifier: string, token: string): Promise<VerificationRequest> {
    const verificationRequest = this.verificationRequestRepository.create({
      identifier,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
    });
    return this.verificationRequestRepository.save(verificationRequest);
  }

  async getVerificationRequest(token: string): Promise<VerificationRequest | null> {
    return this.verificationRequestRepository.findOne({ where: { token } });
  }

  async deleteVerificationRequest(token: string): Promise<void> {
    await this.verificationRequestRepository.delete({ token });
  }

  async handleGoogleAuth(googleData: any): Promise<AuthResponse> {
    try {
      console.log('Google Auth data received:', googleData);
      const { name, email, image, providerId } = googleData;

      let user = await this.userRepository.findOne({ where: { email } });
      let isFirstLogin = false;
    
      if (!user) {
        user = this.userRepository.create({
          name,
          email,
          image,
          emailVerified: new Date(),
          lastLoginAt: new Date(),
        });
        user = await this.userRepository.save(user);
        isFirstLogin = true;
      } else {
        // Vérifier si c'est la première connexion
        isFirstLogin = !user.lastLoginAt;
        
        // Mettre à jour la dernière connexion
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
      }

      // Envoyer un email de bienvenue si c'est la première connexion
      if (isFirstLogin) {
        try {
          await this.emailService.sendWelcomeEmail(user.email, user.name);
          console.log(`🎉 Email de bienvenue envoyé à ${user.email} pour sa première connexion Google`);
        } catch (error) {
          console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
          // Ne pas bloquer la connexion si l'email échoue
        }
      }

      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        },
        accessToken,
      };
    } catch (error) {
      console.error('Google Auth error:', error);
      throw error;
    }
  }
}
