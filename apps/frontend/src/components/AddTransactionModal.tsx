'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import {
  TransactionType,
  TransactionCategory,
  CATEGORY_LABELS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES
} from '@/types/budget';
import { useTransactions } from '@/hooks/useTransactions';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useTransactions();
  
  // État du stepper
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // État du formulaire
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState('');
  const [recurringEndDate, setRecurringEndDate] = useState('');

  const availableCategories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Fonctions de navigation du stepper
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation par étape
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(type && amount && parseFloat(amount) > 0);
      case 2:
        return !!(category && description);
      case 3:
        return !!date;
      case 4:
        return true; // Les champs de l'étape 4 sont optionnels
      default:
        return false;
    }
  };

  const canProceed = validateStep(currentStep);

  const resetForm = () => {
    setCurrentStep(1);
    setType(TransactionType.EXPENSE);
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setTags('');
    setIsRecurring(false);
    setRecurringPattern('');
    setRecurringEndDate('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) return;

    const transactionData = {
      type,
      category: category as TransactionCategory,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      notes: notes || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : undefined,
    };

    addTransaction(transactionData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Composant de stepper
  const Stepper = () => (
    <div className="flex items-center justify-between mb-6">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
              ${isCompleted 
                ? 'bg-green-500 text-white' 
                : isCurrent 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }
            `}>
              {isCompleted ? '✓' : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className={`
                w-12 h-0.5 mx-2
                ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );

  // Composant de navigation
  const Navigation = () => (
    <div className="flex gap-3 pt-4">
      {currentStep > 1 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
          className="flex-1"
        >
          ←
          Précédent
        </Button>
      )}
      
      {currentStep < totalSteps ? (
        <Button 
          type="button" 
          onClick={nextStep}
          disabled={!canProceed}
          className="flex-1"
        >
          Suivant
          →
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={!canProceed}
          className="flex-1"
        >
          Ajouter
        </Button>
      )}
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <Card className="relative w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-lg animate-fade-in bg-white">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Ajouter une transaction
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Étape {currentStep} sur {totalSteps}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Stepper />
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Étape 1: Type et montant */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Type et montant
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Commencez par définir le type de transaction et son montant
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={type === TransactionType.EXPENSE ? 'default' : 'outline'}
                        onClick={() => {
                          setType(TransactionType.EXPENSE);
                          setCategory('');
                        }}
                        className="w-full"
                      >
                        Dépense
                      </Button>
                      <Button
                        type="button"
                        variant={type === TransactionType.INCOME ? 'default' : 'outline'}
                        onClick={() => {
                          setType(TransactionType.INCOME);
                          setCategory('');
                        }}
                        className="w-full"
                      >
                        Revenu
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Montant</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2: Catégorie et description */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Catégorie et description
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choisissez une catégorie et décrivez votre transaction
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                      className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <Input
                      placeholder="Description de la transaction"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3: Date et notes */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Date et notes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Définissez la date et ajoutez des notes si nécessaire
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optionnel)</label>
                    <Input
                      placeholder="Notes supplémentaires..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 4: Tags et récurrence */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Tags et récurrence
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ajoutez des tags et configurez la récurrence si nécessaire
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags (optionnel)</label>
                    <Input
                      placeholder="tag1, tag2, tag3..."
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Séparez les tags par des virgules</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Transaction récurrente
                      </label>
                    </div>
                    
                    {isRecurring && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fréquence</label>
                          <select
                            value={recurringPattern}
                            onChange={(e) => setRecurringPattern(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="">Sélectionner une fréquence</option>
                            <option value="weekly">Hebdomadaire</option>
                            <option value="monthly">Mensuel</option>
                            <option value="yearly">Annuel</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date de fin (optionnel)</label>
                          <Input
                            type="date"
                            value={recurringEndDate}
                            onChange={(e) => setRecurringEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Navigation />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
