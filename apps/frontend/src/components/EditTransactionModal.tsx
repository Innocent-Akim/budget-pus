'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import {
  Transaction,
  TransactionType,
  TransactionCategory,
  CATEGORY_LABELS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES
} from '@/types/budget';
import { useTransactions } from '@/hooks/useTransactions';

// Helper function to safely parse tags
const parseTags = (tags: any): string[] => {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  }
  return [];
};

interface EditTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function EditTransactionModal({ transaction, open, onClose }: EditTransactionModalProps) {
  const { updateTransaction } = useTransactions();
  
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState('');
  const [recurringEndDate, setRecurringEndDate] = useState('');

  // Initialiser les valeurs quand la transaction change
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(transaction.date.toISOString().split('T')[0]);
      setNotes(transaction.notes || '');
      setTags(parseTags(transaction.tags).join(', '));
      setIsRecurring(transaction.isRecurring);
      setRecurringPattern(transaction.recurringPattern || '');
      setRecurringEndDate(transaction.recurringEndDate?.toISOString().split('T')[0] || '');
    }
  }, [transaction]);

  const availableCategories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description || !transaction) return;

    const updatedTransaction = {
      userId: transaction.userId, // Keep existing userId
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

    updateTransaction(transaction.id, updatedTransaction);
    onClose();
  };

  const handleClose = () => {
    // Réinitialiser le formulaire
    setAmount('');
    setCategory('');
    setDescription('');
    setDate('');
    setNotes('');
    setTags('');
    setIsRecurring(false);
    setRecurringPattern('');
    setRecurringEndDate('');
    onClose();
  };

  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Modifier la transaction
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Modifiez les détails de votre transaction
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type de transaction */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <div className="grid grid-cols-3 gap-2">
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
                  <Button
                    type="button"
                    variant={type === TransactionType.TRANSFER ? 'default' : 'outline'}
                    onClick={() => {
                      setType(TransactionType.TRANSFER);
                      setCategory('');
                    }}
                    className="w-full"
                  >
                    Transfert
                  </Button>
                </div>
              </div>

              {/* Montant */}
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

              {/* Catégorie */}
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

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <Input
                  placeholder="Description de la transaction"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optionnel)</label>
                <Input
                  placeholder="Notes supplémentaires..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags (optionnel)</label>
                <Input
                  placeholder="tag1, tag2, tag3..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-gray-500">Séparez les tags par des virgules</p>
              </div>

              {/* Transaction récurrente */}
              <div className="space-y-2">
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

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 gradient-primary">
                  Modifier la transaction
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
