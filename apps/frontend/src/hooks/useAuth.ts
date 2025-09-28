'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(async (provider?: string) => {
    try {
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result?.error || 'Erreur de connexion' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Une erreur inattendue s\'est produite' 
      };
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await signOut({ 
        callbackUrl: '/auth/signin',
        redirect: false 
      });
      router.push('/auth/signin');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur lors de la déconnexion' 
      };
    }
  }, [router]);

  const requireAuth = useCallback((redirectTo?: string) => {
    if (status === 'unauthenticated') {
      router.push(redirectTo || '/auth/signin');
      return false;
    }
    return true;
  }, [status, router]);

  return {
    user: session?.user,
    session,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
    requireAuth,
  };
}
