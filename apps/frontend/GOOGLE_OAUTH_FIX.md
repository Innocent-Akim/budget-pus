# 🔧 Correction de l'erreur Google OAuth - redirect_uri_mismatch

## ❌ Erreur actuelle
```
Error 400: redirect_uri_mismatch
You can't sign in because budget sent an invalid request.
```

## 🔍 Cause du problème
L'URI de redirection configuré dans Google Cloud Console ne correspond pas à celui utilisé par NextAuth.

## ✅ Solution étape par étape

### 1. Aller dans Google Cloud Console
- Ouvrir [Google Cloud Console](https://console.cloud.google.com/)
- Sélectionner votre projet
- Aller dans "APIs & Services" > "Credentials"

### 2. Modifier l'OAuth 2.0 Client ID
- Cliquer sur votre OAuth 2.0 Client ID
- Dans "Authorized redirect URIs", ajouter :
  ```
  http://localhost:3000/api/auth/callback/google
  ```

### 3. Pour la production, ajouter aussi :
  ```
  https://votre-domaine.com/api/auth/callback/google
  ```

### 4. Vérifier les variables d'environnement
Créer un fichier `.env.local` dans `apps/frontend/` :

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 5. Générer NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## 🎯 URIs de redirection corrects

### Développement local
```
http://localhost:3000/api/auth/callback/google
```

### Production
```
https://votre-domaine.com/api/auth/callback/google
```

## ⚠️ Points importants

1. **Pas de slash final** : Ne pas mettre de `/` à la fin
2. **HTTP vs HTTPS** : Utiliser `http://` pour localhost, `https://` pour production
3. **Port correct** : Vérifier que le port 3000 est correct
4. **Sauvegarder** : Cliquer sur "Save" dans Google Cloud Console

## 🔄 Après la correction

1. Redémarrer le serveur de développement
2. Vider le cache du navigateur
3. Tester la connexion Google

## 🐛 Debugging

Si l'erreur persiste :
1. Vérifier les logs de la console
2. Vérifier que les variables d'environnement sont chargées
3. Vérifier l'URL exacte dans l'erreur Google

## 📞 Support

Si le problème persiste, vérifier :
- Que le projet Google Cloud est correct
- Que l'API Google+ est activée
- Que les credentials sont corrects

