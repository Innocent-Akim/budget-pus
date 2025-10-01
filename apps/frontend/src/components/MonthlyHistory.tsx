'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useUserSettings } from '@/hooks/useUserSettings';
import { formatCurrency, formatMonth, getMonthKey } from '@/lib/utils';
import { TransactionType } from '@/types/budget';
import { IoArrowBack, IoArrowForward, IoCalendar, IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import type { IconType } from 'react-icons';

// Cast les icônes pour résoudre les conflits de types React
const Icon = ({ icon: IconComponent, className }: { icon: IconType; className: string }) => 
  IconComponent({ className }) as React.ReactElement;

export function MonthlyHistory() {
  const { getTotalsByMonth, getTransactionsByMonth } = useTransactions();
  const { monthlyIncome } = useUserSettings();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const currentMonthKey = getMonthKey(currentMonth);
  const { income, expenses, savings } = getTotalsByMonth(currentMonthKey);
  const transactions = getTransactionsByMonth(currentMonthKey);
  
  // Calculer le revenu total (utiliser soit les revenus des transactions, soit le revenu mensuel fixe)
  // Éviter le double comptage si l'utilisateur a déjà enregistré son salaire
  const safeMonthlyIncome = Number(monthlyIncome) || 0;
  const hasIncomeTransactions = income > 0;
  const totalIncome = hasIncomeTransactions ? income : safeMonthlyIncome;
  const totalSavings = totalIncome - expenses;

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const isCurrentMonth = getMonthKey(currentMonth) === getMonthKey(new Date());

  return (
    <Card className="border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.7s' }}>
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold light:text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Icon icon={IoCalendar} className="h-6 w-6 text-indigo-600" />
              Historique mensuel
            </CardTitle>
            <CardDescription className="light:text-gray-600 dark:text-gray-300">
              Consultez l&apos;évolution de votre budget mois par mois
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <Icon icon={IoArrowBack} className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentMonth}
              className={`px-3 ${isCurrentMonth ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              Aujourd&apos;hui
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
              disabled={isCurrentMonth}
            >
              <Icon icon={IoArrowForward} className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold light:text-gray-800 dark:text-gray-100 mb-2">
            {formatMonth(currentMonth)}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center justify-center mb-2">
                <Icon icon={IoTrendingUp} className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-lg font-semibold light:text-gray-800 dark:text-gray-100">
                {formatCurrency(totalIncome)}
              </div>
              <div className="text-sm light:text-gray-600 dark:text-gray-400">Revenus</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center justify-center mb-2">
                <Icon icon={IoTrendingDown} className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-lg font-semibold light:text-gray-800 dark:text-gray-100">
                {formatCurrency(expenses)}
              </div>
              <div className="text-sm light:text-gray-600 dark:text-gray-400">Dépenses</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${totalSavings >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
              <div className="flex items-center justify-center mb-2">
                <div className={`h-5 w-5 rounded-full ${totalSavings >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`} />
              </div>
              <div className={`text-lg font-semibold ${totalSavings >= 0 ? 'light:text-gray-800 dark:text-gray-100' : 'text-orange-600'}`}>
                {formatCurrency(totalSavings)}
              </div>
              <div className="text-sm light:text-gray-600 dark:text-gray-400">
                {totalSavings >= 0 ? 'Épargne' : 'Déficit'}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold light:text-gray-800 dark:text-gray-100 mb-4">
            Transactions du mois
          </h4>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon={IoCalendar} className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="light:text-gray-500 dark:text-gray-400">
                Aucune transaction pour ce mois
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {transactions
                .sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === TransactionType.INCOME   
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      }`}>
                        {transaction.type === TransactionType.INCOME ? (
                          <Icon icon={IoTrendingUp} className="h-4 w-4" />
                        ) : (
                          <Icon icon={IoTrendingDown} className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium light:text-gray-800 dark:text-gray-100">
                          {transaction.description}
                        </p>
                        <p className="text-xs light:text-gray-500 dark:text-gray-400">
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
