'use client';

import { signIn, getSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = searchParams.get('from') || '/';

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    getSession().then((session) => {
      if (session) {
        router.push(from);
      }
    });
  }, [from, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('google', {
        callbackUrl: from,
        redirect: false,
      });

      if (result?.error) {
        setError('Erreur lors de la connexion avec Google');
      } else if (result?.ok) {
        router.push(from);
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: 'demo@example.com', // En production, ceci viendrait d'un formulaire
        password: 'demo123',
        callbackUrl: from,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else if (result?.ok) {
        router.push(from);
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
            <Chrome className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Connexion requise
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Veuillez vous connecter pour accéder à cette page
          </p>
        </div>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Choisissez votre méthode de connexion
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-center">
              Connectez-vous avec Google ou utilisez un compte existant
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Chrome className="h-5 w-5 mr-2" />
                {isLoading ? 'Connexion...' : 'Continuer avec Google'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    ou
                  </span>
                </div>
              </div>

              {/* Demo Account */}
              <Button
                onClick={handleEmailSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? 'Connexion...' : 'Compte démo (email)'}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
