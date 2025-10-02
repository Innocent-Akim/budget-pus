# Configuration Email avec Novu - Frontend

Ce document explique comment configurer l'envoi d'emails avec Novu côté frontend dans l'application Budget Plus.

## Variables d'Environnement

Ajoutez les variables suivantes à votre fichier `.env.local` :

```env
# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:4000

# API URL
NEXT_PUBLIC_API_URL=http://localhost:4001

# Novu Email Service Configuration
NEXT_PUBLIC_NOVU_API_KEY=your-novu-api-key-here
NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER=your-novu-application-identifier-here
```

## Configuration Novu

1. **Créer un compte Novu** : Visitez [novu.co](https://novu.co) et créez un compte
2. **Créer une application** : Dans votre tableau de bord Novu, créez une nouvelle application
3. **Obtenir la clé API** : Copiez votre clé API depuis les paramètres de l'application
4. **Obtenir l'identifiant de l'application** : Copiez l'identifiant de l'application depuis les paramètres

## Templates d'Email

Les templates suivants doivent être créés dans votre tableau de bord Novu :

### 1. Email de Bienvenue (`welcome-email`)
- **Sujet** : Bienvenue sur {{appName}} !
- **Variables** : `userName`, `userEmail`, `appName`

### 2. Réinitialisation de Mot de Passe (`password-reset-email`)
- **Sujet** : Réinitialisez votre mot de passe {{appName}}
- **Variables** : `userName`, `userEmail`, `resetUrl`, `appName`

### 3. Vérification d'Email (`email-verification`)
- **Sujet** : Vérifiez votre adresse email
- **Variables** : `userName`, `userEmail`, `verificationUrl`, `appName`

### 4. Notification de Transaction (`transaction-notification`)
- **Sujet** : Nouvelle transaction dans {{appName}}
- **Variables** : `userName`, `userEmail`, `transactionType`, `amount`, `description`, `date`, `appName`

### 5. Objectif Atteint (`goal-achievement`)
- **Sujet** : Félicitations ! Vous avez atteint votre objectif !
- **Variables** : `userName`, `userEmail`, `goalName`, `goalAmount`, `currentAmount`, `appName`

### 6. Alerte Budget (`budget-alert`)
- **Sujet** : Alerte budget pour {{category}}
- **Variables** : `userName`, `userEmail`, `category`, `spentAmount`, `budgetLimit`, `percentage`, `appName`

## Utilisation

Le service email est automatiquement disponible dans tous les composants. Vous pouvez l'importer et l'utiliser :

```typescript
import { emailService } from '../services/email.service';

// Envoyer un email de bienvenue
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Envoyer une notification de transaction
await emailService.sendTransactionNotification('user@example.com', {
  userName: 'John Doe',
  userEmail: 'user@example.com',
  transactionType: 'expense',
  amount: 50.00,
  description: 'Achat en ligne',
  date: new Date().toISOString(),
  appName: 'Budget Plus'
});
```

## Méthodes Disponibles

- `sendWelcomeEmail(userEmail, userName)` - Envoyer un email de bienvenue
- `sendPasswordResetEmail(userEmail, resetToken, userName)` - Envoyer un email de réinitialisation
- `sendEmailVerificationEmail(userEmail, verificationToken, userName)` - Envoyer un email de vérification
- `sendTransactionNotification(userEmail, transactionData)` - Envoyer des notifications de transaction
- `sendGoalAchievementEmail(userEmail, goalData)` - Envoyer des notifications d'objectif atteint
- `sendBudgetAlertEmail(userEmail, alertData)` - Envoyer des alertes de budget

## Vérification

Pour vérifier que le service email fonctionne :

1. Vérifiez que les variables d'environnement sont correctement configurées
2. Utilisez `emailService.isAvailable()` pour vérifier l'état du service
3. Consultez les logs de la console pour voir les messages d'erreur éventuels
4. Vérifiez le tableau de bord Novu pour voir les emails envoyés

## Dépannage

- **Service non initialisé** : Vérifiez que `NEXT_PUBLIC_NOVU_API_KEY` est correctement configuré
- **Erreurs d'API** : Vérifiez que votre clé API Novu est valide et active
- **Templates manquants** : Assurez-vous que tous les templates sont créés dans Novu
- **Emails non reçus** : Vérifiez la configuration du fournisseur d'email dans Novu
