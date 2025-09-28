'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AuthErrorProps {
  onRetry?: () => void;
}

export function AuthError({ onRetry }: AuthErrorProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Il y a un problème avec la configuration du serveur.';
      case 'AccessDenied':
        return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      case 'Verification':
        return 'Le token a expiré ou a déjà été utilisé.';
      case 'Default':
        return 'Une erreur inattendue s\'est produite lors de la connexion.';
      default:
        return 'Une erreur d\'authentification s\'est produite.';
    }
  };

  const getErrorDescription = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Veuillez contacter l\'administrateur du système.';
      case 'AccessDenied':
        return 'Vérifiez que vous avez les bonnes permissions pour accéder à cette application.';
      case 'Verification':
        return 'Veuillez essayer de vous reconnecter.';
      case 'Default':
        return 'Veuillez réessayer dans quelques instants.';
      default:
        return 'Veuillez vérifier vos informations de connexion.';
    }
  };

  if (!error) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border border-red-200 dark:border-red-800 shadow-lg">
          <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-red-900 dark:text-red-100">
                  Erreur d'authentification
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-300">
                  {getErrorMessage(error)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getErrorDescription(error)}
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={onRetry}
                  className="flex-1 gradient-primary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth/signin'}
                  variant="outline"
                  className="flex-1"
                >
                  Nouvelle connexion
                </Button>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="ghost"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
