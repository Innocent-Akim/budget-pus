'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { useBudgetStore } from '@/store/useBudgetStore';
import { X } from 'lucide-react';

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddGoalModal({ open, onClose }: AddGoalModalProps) {
  const { addBudgetGoal } = useBudgetStore();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount || !deadline) return;

    addBudgetGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      deadline: deadline,
    });

    // Réinitialiser le formulaire
    setName('');
    setTargetAmount('');
    setDeadline(undefined);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-md border-0 shadow-2xl animate-bounce-in bg-white dark:border-slate-700/50">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Créer un objectif d&apos;épargne</CardTitle>
              <CardDescription>Définissez un objectif financier à atteindre</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom de l'objectif */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom de l&apos;objectif</label>
              <Input
                placeholder="Ex: Voyage, Urgences, Maison..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Montant cible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Montant cible</label>
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
               <label className="text-sm font-medium text-gray-700">Date limite</label>
               <DatePicker
                 value={deadline}
                 onChange={setDeadline}
                 placeholder="Sélectionner une date"
               />
             </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1">
                Créer l&apos;objectif
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
