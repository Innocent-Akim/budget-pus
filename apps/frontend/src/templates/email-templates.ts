// Templates d'email HTML pour Novu
// Ces templates peuvent être utilisés comme référence pour créer les templates dans Novu

export const emailTemplates = {
  welcome: {
    subject: 'Bienvenue sur {{appName}} !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur {{appName}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue sur {{appName}} !</h1>
            <p>Votre gestionnaire de budget personnel</p>
          </div>
          <div class="content">
            <h2>Bonjour {{userName}} !</h2>
            <p>Félicitations ! Votre compte a été créé avec succès sur {{appName}}.</p>
            <p>Vous pouvez maintenant :</p>
            <ul>
              <li>Suivre vos dépenses et revenus</li>
              <li>Définir des objectifs d'épargne</li>
              <li>Recevoir des alertes de budget</li>
              <li>Analyser vos habitudes financières</li>
            </ul>
            <p>Commencez dès maintenant à prendre le contrôle de vos finances !</p>
            <a href="{{frontendUrl}}" class="button">Accéder à mon compte</a>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>L'équipe {{appName}}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé à {{userEmail}}</p>
            <p>&copy; 2024 {{appName}}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bienvenue sur {{appName}} !
      
      Bonjour {{userName}} !
      
      Félicitations ! Votre compte a été créé avec succès sur {{appName}}.
      
      Vous pouvez maintenant :
      - Suivre vos dépenses et revenus
      - Définir des objectifs d'épargne
      - Recevoir des alertes de budget
      - Analyser vos habitudes financières
      
      Commencez dès maintenant à prendre le contrôle de vos finances !
      
      Accéder à mon compte : {{frontendUrl}}
      
      Si vous avez des questions, n'hésitez pas à nous contacter.
      
      L'équipe {{appName}}
      
      ---
      Cet email a été envoyé à {{userEmail}}
      © 2024 {{appName}}. Tous droits réservés.
    `
  },

  passwordReset: {
    subject: 'Réinitialisez votre mot de passe {{appName}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Réinitialisation de mot de passe</h1>
            <p>{{appName}}</p>
          </div>
          <div class="content">
            <h2>Bonjour {{userName}} !</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte {{appName}}.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="{{resetUrl}}" class="button">Réinitialiser mon mot de passe</a>
            <div class="warning">
              <strong>Important :</strong> Ce lien est valide pendant 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </div>
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">{{resetUrl}}</p>
            <p>L'équipe {{appName}}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé à {{userEmail}}</p>
            <p>&copy; 2024 {{appName}}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Réinitialisation de mot de passe - {{appName}}
      
      Bonjour {{userName}} !
      
      Vous avez demandé la réinitialisation de votre mot de passe pour votre compte {{appName}}.
      
      Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
      {{resetUrl}}
      
      IMPORTANT : Ce lien est valide pendant 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      
      L'équipe {{appName}}
      
      ---
      Cet email a été envoyé à {{userEmail}}
      © 2024 {{appName}}. Tous droits réservés.
    `
  },

  emailVerification: {
    subject: 'Vérifiez votre adresse email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification d'email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vérification d'email</h1>
            <p>{{appName}}</p>
          </div>
          <div class="content">
            <h2>Bonjour {{userName}} !</h2>
            <p>Merci de vous être inscrit sur {{appName}} !</p>
            <p>Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <a href="{{verificationUrl}}" class="button">Vérifier mon email</a>
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">{{verificationUrl}}</p>
            <p>L'équipe {{appName}}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé à {{userEmail}}</p>
            <p>&copy; 2024 {{appName}}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Vérification d'email - {{appName}}
      
      Bonjour {{userName}} !
      
      Merci de vous être inscrit sur {{appName}} !
      
      Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :
      {{verificationUrl}}
      
      L'équipe {{appName}}
      
      ---
      Cet email a été envoyé à {{userEmail}}
      © 2024 {{appName}}. Tous droits réservés.
    `
  },

  transactionNotification: {
    subject: 'Nouvelle transaction dans {{appName}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification de transaction</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .transaction { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
          .amount { font-size: 24px; font-weight: bold; color: #007bff; }
          .type { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .income { background: #d4edda; color: #155724; }
          .expense { background: #f8d7da; color: #721c24; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvelle transaction</h1>
            <p>{{appName}}</p>
          </div>
          <div class="content">
            <h2>Bonjour {{userName}} !</h2>
            <p>Une nouvelle transaction a été enregistrée dans votre compte :</p>
            <div class="transaction">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="type {{transactionType}}">{{transactionType}}</span>
                <span class="amount">{{amount}} €</span>
              </div>
              <p><strong>Description :</strong> {{description}}</p>
              <p><strong>Date :</strong> {{date}}</p>
            </div>
            <p>Consultez votre tableau de bord pour voir tous vos détails financiers.</p>
            <a href="{{frontendUrl}}" class="button">Voir mon tableau de bord</a>
            <p>L'équipe {{appName}}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé à {{userEmail}}</p>
            <p>&copy; 2024 {{appName}}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Nouvelle transaction - {{appName}}
      
      Bonjour {{userName}} !
      
      Une nouvelle transaction a été enregistrée dans votre compte :
      
      Type: {{transactionType}}
      Montant: {{amount}} €
      Description: {{description}}
      Date: {{date}}
      
      Consultez votre tableau de bord pour voir tous vos détails financiers.
      
      Voir mon tableau de bord : {{frontendUrl}}
      
      L'équipe {{appName}}
      
      ---
      Cet email a été envoyé à {{userEmail}}
      © 2024 {{appName}}. Tous droits réservés.
    `
  },

  goalAchievement: {
    subject: 'Félicitations ! Vous avez atteint votre objectif !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Objectif atteint !</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .celebration { text-align: center; font-size: 48px; margin: 20px 0; }
          .goal { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd700; }
          .amount { font-size: 24px; font-weight: bold; color: #28a745; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Félicitations !</h1>
            <p>Vous avez atteint votre objectif !</p>
          </div>
          <div class="content">
            <div class="celebration">🎊</div>
            <h2>Bravo {{userName}} !</h2>
            <p>Vous avez atteint votre objectif d'épargne ! C'est un moment important dans votre parcours financier.</p>
            <div class="goal">
              <h3>{{goalName}}</h3>
              <p><strong>Montant cible :</strong> <span class="amount">{{goalAmount}} €</span></p>
              <p><strong>Montant atteint :</strong> <span class="amount">{{currentAmount}} €</span></p>
            </div>
            <p>Continuez sur cette lancée ! Vous pouvez maintenant définir de nouveaux objectifs ou célébrer cette réussite.</p>
            <a href="{{frontendUrl}}" class="button">Voir mes objectifs</a>
            <p>L'équipe {{appName}}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé à {{userEmail}}</p>
            <p>&copy; 2024 {{appName}}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🎉 Félicitations ! Vous avez atteint votre objectif !
      
      Bravo {{userName}} !
      
      Vous avez atteint votre objectif d'épargne ! C'est un moment important dans votre parcours financier.
      
      Objectif: {{goalName}}
      Montant cible: {{goalAmount}} €
      Montant atteint: {{currentAmount}} €
      
      Continuez sur cette lancée ! Vous pouvez maintenant définir de nouveaux objectifs ou célébrer cette réussite.
      
      Voir mes objectifs : {{frontendUrl}}
      
      L'équipe {{appName}}
      
      ---
      Cet email a été envoyé à {{userEmail}}
      © 2024 {{appName}}. Tous droits réservés.
    `
  },

  budgetAlert: {
    subject: '⚠️ Alerte budget pour {{category}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alerte budget</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .category { font-size: 20px; font-weight: bold; color: #dc3545; }
          .percentage { font-size: 24px; font-weight: bold; color: #dc3545; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Alerte Budget</h1>
            <p>{{appName}}</p>
          </div>
          <div class="content">
            <h2>Bonjour {{userName}} !</h2>
            <p>Vous avez atteint <strong>{{percentage}}%</strong> de votre budget pour la catégorie <strong>{{category}}</strong>.</p>
            <div class="alert">
              <h3 class="category">{{category}}</h3>
              <p><strong>Montant dépensé :</strong> {{spentAmount}} €</p>
              <p><strong>Limite du budget :</strong> {{budgetLimit}} €</p>
              <p><strong>Pourcentage utilisé :</strong> <span class="percentage">{{percentage}}%</span></p>
            </div>
            <p>Il est temps de revoir vos dépenses pour cette catégorie ou d'ajuster votre budget.</p>
            <a href="{{frontendUrl}}" class="button">Gérer mon budget</a>
            <p>L'équipe {{appName}}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé à {{userEmail}}</p>
            <p>&copy; 2024 {{appName}}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ⚠️ Alerte budget - {{appName}}
      
      Bonjour {{userName}} !
      
      Vous avez atteint {{percentage}}% de votre budget pour la catégorie {{category}}.
      
      Catégorie: {{category}}
      Montant dépensé: {{spentAmount}} €
      Limite du budget: {{budgetLimit}} €
      Pourcentage utilisé: {{percentage}}%
      
      Il est temps de revoir vos dépenses pour cette catégorie ou d'ajuster votre budget.
      
      Gérer mon budget : {{frontendUrl}}
      
      L'équipe {{appName}}
      
      ---
      Cet email a été envoyé à {{userEmail}}
      © 2024 {{appName}}. Tous droits réservés.
    `
  }
};

export default emailTemplates;
