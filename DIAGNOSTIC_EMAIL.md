# 🔍 Diagnostic - Pourquoi les Emails ne Partent Pas

## ✅ **Étapes de Diagnostic**

### 1. **Vérifier les Variables d'Environnement**

Créez un fichier `.env.local` dans `apps/frontend/` avec :

```env
# Variables requises
NEXT_PUBLIC_NOVU_API_KEY=your-novu-api-key-here
NEXT_PUBLIC_FRONTEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4001
```

**Vérification :**
```bash
# Dans le terminal, vérifiez que les variables sont chargées
cd apps/frontend
echo $NEXT_PUBLIC_NOVU_API_KEY
```

### 2. **Vérifier la Console du Navigateur**

Ouvrez les outils de développement (F12) et regardez la console :

**Messages attendus :**
- ✅ `"Novu email service initialized successfully"`
- ❌ `"NOVU_API_KEY not found in environment variables"`
- ❌ `"Failed to initialize Novu email service"`

### 3. **Tester le Service Email**

Utilisez le panneau de debug dans l'application :
1. Allez dans **Paramètres**
2. Utilisez le panneau **"Debug Email Service"**
3. Cliquez sur **"Tester le service email"**

### 4. **Vérifier la Configuration Novu**

#### A. Compte Novu
1. Allez sur [novu.co](https://novu.co)
2. Connectez-vous à votre compte
3. Vérifiez que vous avez une application créée

#### B. Clé API
1. Dans votre tableau de bord Novu
2. Allez dans **Settings** > **API Keys**
3. Copiez votre clé API (commence par `nv_`)

#### C. Fournisseur d'Email
1. Allez dans **Integrations**
2. Ajoutez un fournisseur d'email (SendGrid, Mailgun, etc.)
3. Configurez-le avec vos identifiants
4. **Activez** l'intégration

#### D. Templates d'Email
Créez ces templates dans Novu :

**Template 1: `welcome-email`**
- Subject: `Bienvenue sur {{appName}} !`
- Variables: `userName`, `userEmail`, `appName`

**Template 2: `transaction-notification`**
- Subject: `Nouvelle transaction dans {{appName}}`
- Variables: `userName`, `userEmail`, `transactionType`, `amount`, `description`, `date`, `appName`

**Template 3: `goal-achievement`**
- Subject: `Félicitations ! Vous avez atteint votre objectif !`
- Variables: `userName`, `userEmail`, `goalName`, `goalAmount`, `currentAmount`, `appName`

### 5. **Problèmes Courants et Solutions**

#### ❌ **Problème 1: "NOVU_API_KEY not found"**
**Solution :**
```bash
# Vérifiez que le fichier .env.local existe
ls -la apps/frontend/.env.local

# Redémarrez le serveur de développement
npm run dev
```

#### ❌ **Problème 2: "Email service not initialized"**
**Solution :**
- Vérifiez que `NEXT_PUBLIC_NOVU_API_KEY` est correct
- Vérifiez que la clé API commence par `nv_`
- Redémarrez l'application

#### ❌ **Problème 3: "Template not found"**
**Solution :**
- Créez les templates dans Novu
- Vérifiez que les noms correspondent exactement
- Vérifiez que les templates sont **actifs**

#### ❌ **Problème 4: "Subscriber not found"**
**Solution :**
- C'est normal, Novu crée automatiquement les subscribers
- Vérifiez les logs dans le tableau de bord Novu

#### ❌ **Problème 5: "Integration not configured"**
**Solution :**
- Configurez un fournisseur d'email dans Novu
- Activez l'intégration
- Testez l'envoi depuis Novu

### 6. **Test Manuel**

#### A. Test Direct avec Novu
1. Allez dans votre tableau de bord Novu
2. Allez dans **Templates**
3. Sélectionnez un template
4. Cliquez sur **"Test"**
5. Entrez un email de test
6. Vérifiez que l'email arrive

#### B. Test via l'Application
1. Ouvrez la console du navigateur
2. Allez dans **Paramètres** > **Debug Email Service**
3. Cliquez sur **"Tester le service email"**
4. Vérifiez les logs dans la console

### 7. **Logs de Debug**

Ajoutez ces logs temporaires dans `email.service.ts` :

```typescript
private initializeNovu() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NOVU_API_KEY;
    console.log('🔑 API Key found:', !!apiKey);
    console.log('🔑 API Key starts with nv_:', apiKey?.startsWith('nv_'));
    
    if (!apiKey) {
      console.warn('❌ NOVU_API_KEY not found in environment variables');
      return;
    }

    this.novu = new Novu(apiKey);
    this.isInitialized = true;
    console.log('✅ Novu email service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Novu email service:', error);
  }
}
```

### 8. **Vérification Complète**

**Checklist :**
- [ ] Fichier `.env.local` créé
- [ ] `NEXT_PUBLIC_NOVU_API_KEY` configuré
- [ ] Clé API valide (commence par `nv_`)
- [ ] Compte Novu actif
- [ ] Fournisseur d'email configuré et activé
- [ ] Templates créés dans Novu
- [ ] Application redémarrée
- [ ] Console sans erreurs
- [ ] Panneau de debug fonctionne

### 9. **Commandes de Test**

```bash
# Vérifier les variables d'environnement
cd apps/frontend
cat .env.local

# Redémarrer l'application
npm run dev

# Vérifier les logs
# Ouvrir la console du navigateur (F12)
```

### 10. **Support**

Si le problème persiste :
1. Vérifiez les logs dans le tableau de bord Novu
2. Consultez la [documentation Novu](https://docs.novu.co/)
3. Vérifiez les [statuts des services](https://status.novu.co/)

---

**💡 Astuce :** Commencez par le panneau de debug dans l'application pour identifier rapidement le problème !
