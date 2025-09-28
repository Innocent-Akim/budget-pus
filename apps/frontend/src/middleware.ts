import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware simple qui ne cause pas de boucles de redirection
  // La protection des routes est gérée côté client
  
  // Log des requêtes pour le debugging
  console.log('Middleware:', request.nextUrl.pathname);
  
  // Autoriser toutes les requêtes pour l'instant
  // La protection sera gérée par les composants React
  return NextResponse.next();
}

// Configuration des routes à intercepter
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
