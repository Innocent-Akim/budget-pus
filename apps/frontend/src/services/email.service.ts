import { Novu } from '@novu/node';

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailOptions {
  to: string;
  templateName: string;
  data: Record<string, any>;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  appName: string;
}

export interface PasswordResetEmailData {
  userName: string;
  userEmail: string;
  resetUrl: string;
  appName: string;
}

export interface EmailVerificationData {
  userName: string;
  userEmail: string;
  verificationUrl: string;
  appName: string;
}

export interface TransactionNotificationData {
  userName: string;
  userEmail: string;
  transactionType: string;
  amount: number;
  description: string;
  date: string;
  appName: string;
}

export interface GoalAchievementData {
  userName: string;
  userEmail: string;
  goalName: string;
  goalAmount: number;
  currentAmount: number;
  appName: string;
}

export interface BudgetAlertData {
  userName: string;
  userEmail: string;
  category: string;
  spentAmount: number;
  budgetLimit: number;
  percentage: number;
  appName: string;
}

class EmailService {
  private novu: Novu | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeNovu();
  }

  private initializeNovu() {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NOVU_API_KEY;
      if (!apiKey) {
        console.warn('NOVU_API_KEY not found in environment variables');
        return;
      }

      // Vérifier que la clé commence par nv_
      if (!apiKey.startsWith('nv_')) {
        console.warn('❌ Clé API Novu invalide. Doit commencer par "nv_". Emails désactivés.');
        console.warn('💡 Obtenez une vraie clé sur https://novu.co');
        return;
      }

      this.novu = new Novu(apiKey);
      this.isInitialized = true;
      console.log('✅ Novu email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Novu email service:', error);
    }
  }

  private async ensureInitialized(): Promise<boolean> {
    if (!this.isInitialized || !this.novu) {
      console.error('Email service not initialized. Please check your NOVU_API_KEY.');
      return false;
    }
    return true;
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (!(await this.ensureInitialized())) {
      return false;
    }

    try {
      const { to, templateName, data } = options;
      
      console.log(`Sending email to ${to} with template ${templateName}`);
      
      // First, identify the subscriber
      await this.novu!.subscribers.identify(to, {
        email: to,
      });
      
      // Then trigger the notification
      await this.novu!.trigger(templateName, {
        to: {
          subscriberId: to,
        },
        payload: data,
      });
      
      console.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      templateName: 'welcome-email',
      data: {
        userName,
        userEmail,
        appName: 'Budget Plus',
      },
    });
  }

  async sendPasswordResetEmail(userEmail: string, resetToken: string, userName: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: userEmail,
      templateName: 'password-reset-email',
      data: {
        userName,
        userEmail,
        resetUrl,
        appName: 'Budget Plus',
      },
    });
  }

  async sendEmailVerificationEmail(userEmail: string, verificationToken: string, userName: string): Promise<boolean> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: userEmail,
      templateName: 'email-verification',
      data: {
        userName,
        userEmail,
        verificationUrl,
        appName: 'Budget Plus',
      },
    });
  }

  async sendTransactionNotification(userEmail: string, transactionData: TransactionNotificationData): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      templateName: 'transaction-notification',
      data: transactionData,
    });
  }

  async sendGoalAchievementEmail(userEmail: string, goalData: GoalAchievementData): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      templateName: 'goal-achievement',
      data: goalData,
    });
  }

  async sendBudgetAlertEmail(userEmail: string, alertData: BudgetAlertData): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      templateName: 'budget-alert',
      data: alertData,
    });
  }

  // Utility method to check if email service is available
  isAvailable(): boolean {
    return this.isInitialized;
  }
}

// Export a singleton instance
export const emailService = new EmailService();
export default emailService;
