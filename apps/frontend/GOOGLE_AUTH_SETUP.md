# Configuration de l'authentification Google

## 1. Créer un projet Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ (ou Google Identity)

## 2. Configurer OAuth 2.0

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configurez l'écran de consentement OAuth si nécessaire
4. Créez un client OAuth 2.0 avec :
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     - `http://localhost:3000/api/auth/callback/google` (développement)
     - `https://votre-domaine.com/api/auth/callback/google` (production)

## 3. Variables d'environnement

Créez un fichier `.env.local` dans le dossier `apps/frontend/` avec :

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 4. Générer NEXTAUTH_SECRET

Vous pouvez générer un secret NextAuth avec :

```bash
openssl rand -base64 32
```

## 5. Fonctionnalités

- ✅ Connexion avec Google
- ✅ Connexion avec email/mot de passe
- ✅ Inscription avec email/mot de passe
- ✅ Gestion des sessions
- ✅ Interface utilisateur moderne
- ✅ Mode sombre/clair
- ✅ Responsive design

## 6. Utilisation

L'utilisateur peut choisir entre :
1. **Connexion Google** : Un clic pour se connecter avec son compte Google
2. **Connexion email** : Formulaire traditionnel email/mot de passe
3. **Inscription** : Création de compte avec validation
