'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Transaction,
  TransactionType,
  TransactionCategory,
  CATEGORY_LABELS
} from '@/types/budget';
import {
  Search,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

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

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtrer et trier les transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           parseTags(transaction.tags).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = (transactionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      onDelete?.(transactionId);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="h-6 w-6 rounded gradient-primary flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          Gestion des transactions
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Gérez vos transactions financières
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filtres et recherche */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par description, notes ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les types</option>
                <option value={TransactionType.INCOME}>Revenus</option>
                <option value={TransactionType.EXPENSE}>Dépenses</option>
                <option value={TransactionType.TRANSFER}>Transferts</option>
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as TransactionCategory | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                {Object.values(TransactionCategory).map(category => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'description')}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Date</option>
                <option value="amount">Montant</option>
                <option value="description">Description</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                  ? 'Aucune transaction ne correspond aux critères de recherche'
                  : 'Aucune transaction enregistrée'
                }
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    transaction.type === TransactionType.INCOME 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                      : transaction.type === TransactionType.EXPENSE
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                  }`}>
                    {transaction.type === TransactionType.INCOME ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : transaction.type === TransactionType.EXPENSE ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : (
                      <Calendar className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {transaction.description}
                      </h3>
                      {transaction.isRecurring && (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                          Récurrent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.date)}
                      </span>
                      <span>{CATEGORY_LABELS[transaction.category]}</span>
                      {(() => {
                        const tagsArray = parseTags(transaction.tags);
                        return tagsArray.length > 0 && (
                          <span className="flex items-center gap-1">
                            # {tagsArray.slice(0, 2).join(', ')}
                            {tagsArray.length > 2 && ` +${tagsArray.length - 2}`}
                          </span>
                        );
                      })()}
                    </div>
                    
                    {transaction.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                        {transaction.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.type === TransactionType.INCOME 
                        ? 'text-green-600' 
                        : transaction.type === TransactionType.EXPENSE
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {transaction.type === TransactionType.INCOME ? '+' : 
                       transaction.type === TransactionType.EXPENSE ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
