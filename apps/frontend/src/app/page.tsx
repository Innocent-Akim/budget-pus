'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { EditTransactionModal } from '@/components/EditTransactionModal';
import { TransactionList } from '@/components/TransactionList';
import { GoalsSection } from '@/components/GoalsSection';
import { MonthlyHistory } from '@/components/MonthlyHistory';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { SettingsSection } from '@/components/SettingsSection';
import { NavigationMenu } from '@/components/NavigationMenu';
import { Header } from '@/components/Header';
import { LoginForm } from '@/components/LoginForm';
import { useSession } from 'next-auth/react';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import { useUserSettings } from '@/hooks/useUserSettings';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const { data: session, status } = useSession();
  
  const { 
    transactions,
    getCurrentMonthTransactions, 
    getTotalsByMonth, 
    getExpensesByCategory,
    updateTransaction,
    deleteTransaction
  } = useTransactions();
  
  const { goals: budgetGoals } = useGoals();
  const { monthlyIncome } = useUserSettings();

  // Afficher le formulaire de connexion si l'utilisateur n'est pas connecté
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const currentMonthTransactions = getCurrentMonthTransactions();
  const { income, expenses, savings } = getTotalsByMonth(currentMonthKey);
  const expensesByCategory = getExpensesByCategory(currentMonthKey);

  // Calculer le total économisé pour l'objectif principal
  const mainGoal = budgetGoals[0];
  const savingsGoalData = mainGoal ? {
    target: mainGoal.targetAmount,
    current: mainGoal.currentAmount,
  } : undefined;

  const savingsPercentage = savingsGoalData 
    ? Math.min((savingsGoalData.current / savingsGoalData.target) * 100, 100)
    : 0;

  // Fonctions de gestion des transactions
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsEditTransactionOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  const handleCloseEditModal = () => {
    setEditingTransaction(null);
    setIsEditTransactionOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <NavigationMenu 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />

      {/* Main Layout */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection} 
        />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSection === 'dashboard' && (
          <div className="space-y-8">
          {/* Statistiques principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenus du mois</CardTitle>
                <div className="h-10 w-10 rounded-lg gradient-success flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(income || monthlyIncome)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Revenu mensuel total
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Dépenses du mois</CardTitle>
                <div className="h-10 w-10 rounded-lg gradient-danger flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(expenses)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total des dépenses
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Épargne du mois</CardTitle>
                <div className="h-10 w-10 rounded-lg gradient-info flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-1 ${savings >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600'}`}>
                  {formatCurrency(savings || (monthlyIncome - expenses))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {savings >= 0 ? 'Montant épargné' : 'Déficit'}
                </p>
              </CardContent>
            </Card>

            {savingsGoalData && (
              <Card className="card-hover border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Objectif d&apos;épargne</CardTitle>
                  <div className="h-10 w-10 rounded-lg gradient-warning flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{savingsPercentage.toFixed(0)}%</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {formatCurrency(savingsGoalData.current)} / {formatCurrency(savingsGoalData.target)}
                  </p>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div 
                      className="h-full rounded-full gradient-warning transition-all duration-300 ease-out"
                      style={{ width: `${savingsPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Graphiques et transactions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded gradient-info flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  Répartition des dépenses
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Visualisez vos dépenses par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(expensesByCategory).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Aucune dépense enregistrée
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(expensesByCategory).map(([category, amount], index) => {
                      const total = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);
                      const percentage = (amount / total) * 100;
                      const gradients = ['gradient-danger', 'gradient-warning', 'gradient-orange', 'gradient-success', 'gradient-info', 'gradient-primary', 'gradient-purple', 'gradient-pink'];
                      
                      return (
                        <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded ${gradients[index % gradients.length]}`} />
                            <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">{formatCurrency(amount)}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded gradient-success flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Transactions récentes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Vos dernières transactions enregistrées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentMonthTransactions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Aucune transaction enregistrée
                    </p>
                  ) : (
                    currentMonthTransactions
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .slice(0, 5)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${
                              transaction.type === 'income' 
                                ? 'gradient-success' 
                                : 'gradient-danger'
                            }`}>
                              {transaction.type === 'income' ? (
                                <TrendingUp className="h-4 w-4 text-white" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {transaction.category}
                              </p>
                            </div>
                          </div>
                          <div className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section des objectifs d'épargne */}
          <GoalsSection />

          {/* Historique mensuel */}
          <MonthlyHistory />
          </div>
        )}

        {currentSection === 'transactions' && (
          <div className="space-y-8">
            <TransactionList 
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </div>
        )}

        {currentSection === 'analytics' && (
          <div className="space-y-8">
            <AnalyticsSection />
          </div>
        )}

        {currentSection === 'goals' && (
          <div className="space-y-8">
            <GoalsSection />
          </div>
        )}

        {currentSection === 'history' && (
          <div className="space-y-8">
            <MonthlyHistory />
          </div>
        )}

        {currentSection === 'settings' && (
          <div className="space-y-8">
            <SettingsSection />
          </div>
        )}
        </main>
      </div>

      {/* Modal pour ajouter une transaction */}
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAddTransactionOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddTransactionModal 
        open={isAddTransactionOpen} 
        onClose={() => setIsAddTransactionOpen(false)}
      />

      <EditTransactionModal 
        transaction={editingTransaction}
        open={isEditTransactionOpen} 
        onClose={handleCloseEditModal}
      />
    </div>
  );
}