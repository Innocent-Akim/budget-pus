# Système d'Authentification Budget Plus

## Vue d'ensemble

Le système d'authentification Budget Plus utilise NextAuth.js côté frontend et une API NestJS personnalisée côté backend. Il supporte l'authentification par email/mot de passe et l'authentification Google OAuth.

## Architecture

### Backend (API NestJS)
- **Module Auth** : Gère l'authentification JWT
- **Entités** : User, Account, Session, VerificationRequest
- **Endpoints** :
  - `POST /auth/register` - Inscription
  - `POST /auth/login` - Connexion
  - `POST /auth/logout` - Déconnexion
  - `GET /auth/me` - Profil utilisateur
  - `GET /auth/session` - Session actuelle
  - `POST /auth/google` - Authentification Google

### Frontend (Next.js + NextAuth)
- **NextAuth Configuration** : Providers et callbacks
- **Composants** :
  - `LoginForm` - Formulaire de connexion/inscription
  - `ProtectedRoute` - Protection des routes
  - `Providers` - Configuration des providers

## Configuration

### Variables d'environnement

#### API (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=budget_plus
JWT_SECRET=your-jwt-secret-key
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-nextauth-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Utilisation

### 1. Inscription
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
```

### 2. Connexion
```typescript
const result = await signIn('credentials', {
  email: 'john@example.com',
  password: 'password123',
  redirect: false
});
```

### 3. Protection des routes
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

function MyPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### 4. Vérification de session
```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Chargement...</p>;
  if (!session) return <p>Non connecté</p>;
  
  return <p>Connecté en tant que {session.user?.name}</p>;
}
```

## Sécurité

- **Mots de passe** : Hachés avec bcrypt (10 rounds)
- **JWT** : Tokens signés avec secret personnalisé
- **Sessions** : Gérées par NextAuth avec base de données
- **Validation** : Données validées avec class-validator

## Base de données

### Tables principales
- **users** : Informations utilisateur
- **accounts** : Comptes OAuth (Google, etc.)
- **sessions** : Sessions actives
- **verification_requests** : Demandes de vérification email

### Relations
- User 1:N Account
- User 1:N Session
- User 1:N Transaction
- User 1:N Goal

## Déploiement

1. **Base de données** : Créer la base PostgreSQL
2. **API** : Déployer sur votre serveur (port 3001)
3. **Frontend** : Déployer sur Vercel/Netlify (port 4000)
4. **Variables** : Configurer les variables d'environnement
5. **OAuth** : Configurer Google OAuth si nécessaire

## Dépannage

### Erreurs courantes
- **"Token invalide"** : Vérifier JWT_SECRET
- **"Utilisateur non trouvé"** : Vérifier la base de données
- **"CORS error"** : Vérifier NEXT_PUBLIC_API_URL
- **"Google OAuth error"** : Vérifier les credentials Google

### Logs
- **API** : Logs dans la console NestJS
- **Frontend** : Logs dans la console du navigateur
- **Base de données** : Logs PostgreSQL

## Support

Pour toute question ou problème :
1. Vérifier les logs
2. Tester les endpoints API
3. Vérifier la configuration
4. Consulter la documentation NextAuth
