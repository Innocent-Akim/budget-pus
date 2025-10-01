import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('JWT Guard - Error:', err);
    console.log('JWT Guard - User:', user ? 'User present' : 'No user');
    console.log('JWT Guard - Info:', info);
    
    if (err || !user) {
      console.log('JWT Guard - Throwing error:', err?.message || 'Token invalide ou expiré');
      throw err || new Error('Token invalide ou expiré');
    }
    return user;
  }
}
