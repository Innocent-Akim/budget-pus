# Test du Flux d'Authentification

## Architecture Mise à Jour

### Frontend (Next.js + NextAuth)
- **Connexion** : Utilise NextAuth avec le provider `credentials` qui appelle l'API backend
- **Inscription** : Appel direct à l'API backend, puis connexion automatique via NextAuth
- **Google OAuth** : NextAuth gère Google OAuth et envoie les données à l'API backend
- **Sessions** : Gérées par NextAuth côté frontend

### Backend (NestJS)
- **Endpoints** : `/auth/register`, `/auth/login`, `/auth/google`, `/auth/me`, `/auth/session`
- **Base de données** : Stockage des utilisateurs, comptes, sessions et tokens
- **JWT** : Génération et validation des tokens d'accès
- **Hachage** : Mots de passe hachés avec bcrypt

## Tests à Effectuer

### 1. Test d'Inscription
1. Aller sur `/auth/signin`
2. Cliquer sur "Créer un compte"
3. Remplir le formulaire (nom, email, mot de passe)
4. Vérifier que l'utilisateur est créé en base de données
5. Vérifier que la connexion automatique fonctionne

### 2. Test de Connexion
1. Aller sur `/auth/signin`
2. Entrer les identifiants d'un utilisateur existant
3. Vérifier que la session est créée
4. Vérifier que l'utilisateur est redirigé vers le tableau de bord

### 3. Test Google OAuth
1. Cliquer sur "Continuer avec Google"
2. Compléter le processus OAuth
3. Vérifier que l'utilisateur est créé/mis à jour en base
4. Vérifier que la session est créée

### 4. Test de Session
1. Rafraîchir la page après connexion
2. Vérifier que la session persiste
3. Tester la déconnexion

## Commandes de Test

```bash
# Démarrer l'API
cd apps/api
npm run start:dev

# Démarrer le frontend
cd apps/frontend
npm run dev
```

## Vérifications en Base de Données

```sql
-- Vérifier les utilisateurs
SELECT * FROM users;

-- Vérifier les comptes
SELECT * FROM accounts;

-- Vérifier les sessions
SELECT * FROM sessions;
```
