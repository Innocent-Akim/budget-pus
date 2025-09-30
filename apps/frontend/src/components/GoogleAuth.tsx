'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    UserPlus,
    Chrome
} from 'lucide-react';
import { useState } from 'react';

export function GoogleAuth() {
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Utiliser l'API d'authentification
      const response = await fetch('/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Redirection après connexion réussie
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      // Utiliser l'API d'inscription
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: email.split('@')[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      // Redirection après inscription réussie
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
            <Chrome className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenue, {session.user?.name} !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vous êtes connecté avec Google
          </p>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Connectez-vous à votre compte Budget Plus' 
              : 'Créez votre compte Budget Plus'
            }
          </p>
        </div>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-center">
              {isLogin 
                ? 'Choisissez votre méthode de connexion'
                : 'Choisissez votre méthode d\'inscription'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              className="w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Chrome className="h-5 w-5 mr-2" />
              Continuer avec Google
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

            {/* Email/Password Form */}
            <form onSubmit={isLogin ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isLogin ? 'Connexion...' : 'Création...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isLogin ? 'Se connecter' : 'Créer le compte'}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                <button
                  onClick={toggleMode}
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {isLogin ? 'Créer un compte' : 'Se connecter'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
