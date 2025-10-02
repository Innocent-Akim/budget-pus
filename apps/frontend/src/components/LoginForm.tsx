'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { emailService } from '@/services/email.service';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setAuthError('');

    try {
      if (isLogin) {
        // Connexion avec NextAuth (qui utilise l'API backend)
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          // Gestion des erreurs spécifiques
          if (result.error === 'CredentialsSignin') {
            setError('Email ou mot de passe incorrect');
          } else if (result.error === 'Configuration') {
            setError('Erreur de configuration du serveur');
          } else if (result.error === 'AccessDenied') {
            setError('Accès refusé');
          } else if (result.error.includes('ECONNREFUSED') || result.error.includes('fetch')) {
            setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
          } else {
            setError('Erreur de connexion: ' + result.error);
          }
        } else if (result?.ok) {
          // Rediriger d'abord, puis vérifier la première connexion
          router.push('/');
          
          // Vérifier si c'est une première connexion après redirection
          // On utilise un setTimeout pour laisser le temps à la session de se mettre à jour
          setTimeout(async () => {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
              // Utiliser les cookies de session pour l'authentification
              const userResponse = await fetch(`${apiUrl}/auth/me`, {
                credentials: 'include'
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                // Si lastLoginAt est null ou undefined, c'est une première connexion
                if (userData.lastLoginAt === null || userData.lastLoginAt === undefined) {
                  console.log('Première connexion détectée, envoi de l\'email de bienvenue...');
                  try {
                    await emailService.sendWelcomeEmail(userData.email, userData.name);
                    console.log('Email de bienvenue envoyé avec succès');
                  } catch (emailError) {
                    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
                    // Ne pas bloquer la connexion si l'email échoue
                  }
                }
              }
            } catch (userError) {
              console.error('Erreur lors de la vérification des données utilisateur:', userError);
              // Ne pas bloquer la connexion si la vérification échoue
            }
          }, 1000);
        }
      } else {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }
        if (!name.trim()) {
          setError('Le nom est requis');
          setIsLoading(false);
          return;
        }
        
        // Inscription via l'API backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        
        try {
          const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });

          if (response.ok) {
            // Après inscription réussie, connecter l'utilisateur avec NextAuth
            const result = await signIn('credentials', {
              email,
              password,
              redirect: false,
            });

            if (result?.ok) {
              // Envoyer un email de bienvenue après connexion réussie (première connexion)
              try {
                await emailService.sendWelcomeEmail(email, name);
                console.log('Email de bienvenue envoyé avec succès');
              } catch (emailError) {
                console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
                // Ne pas bloquer la connexion si l'email échoue
              }
              
              router.push('/');
            } else if (result?.error) {
              setError('Inscription réussie, mais erreur de connexion automatique');
            }
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Erreur lors de l\'inscription');
          }
        } catch (fetchError) {
          if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
            setError('Impossible de se connecter au serveur. Vérifiez que l\'API est démarrée.');
          } else {
            setError('Erreur de connexion au serveur');
          }
        }
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      if (err instanceof Error) {
        if (err.message.includes('ECONNREFUSED') || err.message.includes('fetch')) {
          setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          setError('Erreur: ' + err.message);
        }
      } else {
        setError('Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setAuthError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  // Si l'utilisateur est connecté, afficher le profil
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Bienvenue !
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-center">
                Vous êtes connecté en tant que {session.user?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {session.user?.email}
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/')}
                  className="w-full gradient-primary"
                >
                  Aller au tableau de bord
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  Se déconnecter
                </Button>
              </div>
            </CardContent>
          </Card>
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
                ? 'Entrez vos identifiants pour accéder à votre budget'
                : 'Remplissez le formulaire pour commencer'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || authError) && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error || authError}</p>
                  {(error?.includes('Impossible de se connecter') || error?.includes('serveur')) && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      <p>L'API semble indisponible. Vérifiez que le serveur backend est démarré.</p>
                      <p className="mt-1">Vous pouvez essayer de vous connecter plus tard ou contacter l'administrateur.</p>
                    </div>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom complet
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Votre nom complet"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
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
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
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
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
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
                
                {/* Bouton réessayer en cas d'erreur de connexion */}
                {(error?.includes('Impossible de se connecter') || error?.includes('serveur')) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setError('');
                      setAuthError('');
                    }}
                  >
                    Réessayer
                  </Button>
                )}
              </div>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              {/* Bouton Google */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn('google', { redirect: false })}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
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
