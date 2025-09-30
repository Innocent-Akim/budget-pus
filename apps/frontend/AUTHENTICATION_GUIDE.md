# Guide d'authentification - Budget Plus

Ce guide explique comment utiliser le système d'authentification intégré avec l'API dans l'application Budget Plus.

## Architecture

Le système d'authentification est composé de plusieurs couches :

1. **ApiClient** (`/lib/api-client.ts`) - Classe Axios centralisée pour toutes les requêtes API
2. **AuthService** (`/services/auth.service.ts`) - Service d'authentification avec gestion des tokens JWT
3. **AuthContext** (`/contexts/AuthContext.tsx`) - Contexte React pour l'état d'authentification
4. **LoginForm** (`/components/LoginForm.tsx`) - Composant de formulaire de connexion/inscription

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` dans le dossier `apps/frontend/` :

```env
# Configuration de l'API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Configuration NextAuth (optionnel)
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-secret-key-here
```

### Configuration de l'API

L'API client est configuré pour pointer vers `http://localhost:3001` par défaut. Vous pouvez modifier l'URL via la variable d'environnement `NEXT_PUBLIC_API_URL`.

## Utilisation

### 1. Connexion utilisateur

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // L'utilisateur est maintenant connecté
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Connexion...' : 'Se connecter'}
    </button>
  );
}
```

### 2. Inscription utilisateur

```typescript
import { useAuth } from '@/contexts/AuthContext';

function RegisterComponent() {
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    try {
      await register({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe'
      });
      // L'utilisateur est maintenant connecté
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    }
  };

  return (
    <button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? 'Inscription...' : 'S\'inscrire'}
    </button>
  );
}
```

### 3. Vérification de l'état d'authentification

```typescript
import { useAuth } from '@/contexts/AuthContext';

function ProtectedComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### 4. Déconnexion

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LogoutComponent() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // L'utilisateur est maintenant déconnecté
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}
```

### 5. Utilisation directe de l'API

```typescript
import { apiClient } from '@/lib/api-client';

// Récupérer les transactions
const transactions = await apiClient.getTransactions();

// Créer une transaction
const newTransaction = await apiClient.createTransaction({
  type: 'expense',
  amount: 25.50,
  category: 'Nourriture',
  description: 'Déjeuner',
  date: new Date()
});

// Récupérer le profil utilisateur
const profile = await apiClient.getProfile();
```

## Gestion des tokens JWT

Le système gère automatiquement les tokens JWT :

- **Stockage** : Les tokens sont stockés dans `localStorage`
- **Validation** : Vérification automatique de l'expiration des tokens
- **Renouvellement** : Les tokens expirés sont automatiquement supprimés
- **Headers** : Les tokens sont automatiquement ajoutés aux requêtes API

## Gestion des erreurs

Le système fournit une gestion d'erreurs robuste :

```typescript
import { useAuth } from '@/contexts/AuthContext';

function ErrorHandlingComponent() {
  const { error, clearError } = useAuth();

  return (
    <div>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>Fermer</button>
        </div>
      )}
    </div>
  );
}
```

## Types TypeScript

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### LoginCredentials

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### RegisterData

```typescript
interface RegisterData {
  email: string;
  password: string;
  name: string;
}
```

### AuthResponse

```typescript
interface AuthResponse {
  user: User;
  token: string;
}
```

## Test de l'authentification

Pour tester le système d'authentification, visitez `/test-auth` dans votre application. Cette page fournit :

- Formulaire de connexion/inscription
- État de l'authentification
- Test de connexion API
- Informations de débogage

## Sécurité

### Côté client

- Les mots de passe ne sont jamais stockés localement
- Les tokens JWT sont validés côté client
- Nettoyage automatique des données en cas d'erreur

### Côté serveur (à implémenter)

- Hashage des mots de passe avec bcrypt
- Validation des tokens JWT
- Rate limiting sur les endpoints d'authentification
- HTTPS obligatoire en production

## Dépannage

### Problèmes courants

1. **Token expiré** : L'utilisateur est automatiquement déconnecté
2. **Erreur 401** : Vérifiez que l'API est accessible et que les credentials sont corrects
3. **Erreur de réseau** : Vérifiez la configuration de `NEXT_PUBLIC_API_URL`

### Logs de débogage

Activez les logs de débogage en définissant `NODE_ENV=development` dans votre fichier `.env.local`.

## Migration depuis l'ancien système

Si vous migrez depuis un système d'authentification existant :

1. Remplacez les appels à l'ancien système par `useAuth()`
2. Mettez à jour les types d'interface utilisateur
3. Testez la compatibilité avec l'API existante
4. Migrez les données utilisateur si nécessaire
