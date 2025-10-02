import { Injectable } from '@nestjs/common';

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  appName: string;
}

@Injectable()
export class EmailService {
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      console.log(`📧 Envoi d'email de bienvenue à ${userEmail} pour ${userName}`);
      
      // Simuler l'envoi d'email avec un message de bienvenue personnalisé
      const welcomeMessage = `
🎉 Bienvenue dans Budget Plus, ${userName} !

Nous sommes ravis de vous accueillir dans notre application de gestion budgétaire.

Voici ce que vous pouvez faire :
• Ajouter vos transactions
• Définir des objectifs d'épargne
• Suivre vos dépenses par catégorie
• Visualiser vos finances avec des graphiques

Si vous avez des questions, n'hésitez pas à nous contacter.

L'équipe Budget Plus
      `;
      
      console.log(`📧 Message de bienvenue pour ${userName} (${userEmail}):`);
      console.log(welcomeMessage);
      console.log(`✅ Email de bienvenue envoyé avec succès à ${userEmail}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error);
      return false;
    }
  }
}
