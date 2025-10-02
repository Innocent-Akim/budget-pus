'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { useGoals } from '@/hooks/useGoals';
import { GoalType, GoalStatus } from '@/types/budget';
import { X } from 'lucide-react';
import { emailService } from '@/services/email.service';
import { useSession } from 'next-auth/react';

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddGoalModal({ open, onClose }: AddGoalModalProps) {
  const { addGoal, isAdding } = useGoals();
  const { data: session } = useSession();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount || !deadline) return;

    const goalData = {
      title: name,
      targetAmount: parseFloat(targetAmount),
      targetDate: deadline,
      type: GoalType.SAVINGS,
      status: GoalStatus.ACTIVE,
      currentAmount: 0,
      isRecurring: false,
    };

    try {
      // Ajouter l'objectif d'abord
      await addGoal(goalData);

      // Envoyer une notification email seulement si l'objectif a été créé avec succès
      if (session?.user?.email) {
        try {
          await emailService.sendGoalAchievementEmail(session.user.email, {
            userName: session.user.name || 'Utilisateur',
            userEmail: session.user.email,
            goalName: name,
            goalAmount: parseFloat(targetAmount),
            currentAmount: 0,
            appName: 'Budget Plus',
          });
          console.log('Notification d\'objectif envoyée avec succès');
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de la notification d\'objectif:', emailError);
          // Ne pas bloquer la création d'objectif si l'email échoue
        }
      }

      // Réinitialiser le formulaire seulement si tout s'est bien passé
      setName('');
      setTargetAmount('');
      setDeadline(undefined);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'objectif:', error);
      // L'erreur sera gérée par le hook useGoals et affichée via toast
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-md border-0 shadow-2xl animate-bounce-in bg-white dark:bg-slate-800 dark:border-slate-700/50">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Créer un objectif d&apos;épargne</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">Définissez un objectif financier à atteindre</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom de l'objectif */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l&apos;objectif</label>
              <Input
                placeholder="Ex: Voyage, Urgences, Maison..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Montant cible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Montant cible</label>
              <Input
                type="number"
                step="0.01"
                placeholder="10000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

             {/* Date limite */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date limite</label>
               <DatePicker
                 value={deadline}
                 onChange={setDeadline}
                 placeholder="Sélectionner une date"
               />
             </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isAdding}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={isAdding}>
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </div>
                ) : (
                  'Créer l\'objectif'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
