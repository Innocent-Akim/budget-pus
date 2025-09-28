'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('budget-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('budget-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulation d'une API de connexion
      // Dans une vraie application, vous feriez un appel à votre API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification simple (en production, ceci serait fait côté serveur)
      const users = JSON.parse(localStorage.getItem('budget-users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      setUser(userData);
      localStorage.setItem('budget-user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulation d'une API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si l'utilisateur existe déjà
      const users = JSON.parse(localStorage.getItem('budget-users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // En production, le mot de passe serait hashé
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('budget-users', JSON.stringify(users));

      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };

      setUser(userData);
      localStorage.setItem('budget-user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('budget-user');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
