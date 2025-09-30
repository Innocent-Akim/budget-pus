import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, LoginDto, RegisterDto } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Déconnexion réussie' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.getUserById(req.user.id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  async getSession(@Request() req) {
    return {
      user: req.user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() googleData: any) {
    try {
      console.log('Google Auth controller - received data:', googleData);
      const result = await this.authService.handleGoogleAuth(googleData);
      console.log('Google Auth controller - success:', result);
      return result;
    } catch (error) {
      console.error('Google Auth controller - error:', error);
      throw error;
    }
  }
}
