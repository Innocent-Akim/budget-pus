'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useUserSettings } from '@/hooks/useUserSettings';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  DollarSign, BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

export function AnalyticsSection() {
  const { 
    transactions, 
    getTransactionsByMonth, 
    getTotalsByMonth, 
    getExpensesByCategory
  } = useTransactions();
  
  const { monthlyIncome } = useUserSettings();

  const [selectedPeriod, setSelectedPeriod] = useState('6'); // 6 derniers mois par défaut

  // Calculer les données pour la période sélectionnée
  const analyticsData = useMemo(() => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = parseInt(selectedPeriod) - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      const totals = getTotalsByMonth(monthKey);
      const expensesByCategory = getExpensesByCategory(monthKey);
      
      // Inclure le revenu mensuel fixe dans le calcul des revenus
      const totalIncome = totals.income + monthlyIncome;
      const totalSavings = totalIncome - totals.expenses;
      
      months.push({
        month: monthName,
        monthKey,
        income: totalIncome,
        expenses: totals.expenses,
        savings: totalSavings,
        expensesByCategory,
        transactionCount: getTransactionsByMonth(monthKey).length
      });
    }
    
    return months;
  }, [selectedPeriod, getTransactionsByMonth, getTotalsByMonth, getExpensesByCategory, monthlyIncome]);

  // Calculer les moyennes et tendances
  const averages = useMemo(() => {
    const totalIncome = analyticsData.reduce((sum, month) => sum + month.income, 0);
    const totalExpenses = analyticsData.reduce((sum, month) => sum + month.expenses, 0);
    const totalSavings = analyticsData.reduce((sum, month) => sum + month.savings, 0);
    const totalTransactions = analyticsData.reduce((sum, month) => sum + month.transactionCount, 0);
    
    return {
      avgIncome: totalIncome / analyticsData.length,
      avgExpenses: totalExpenses / analyticsData.length,
      avgSavings: totalSavings / analyticsData.length,
      avgTransactions: totalTransactions / analyticsData.length,
      totalIncome,
      totalExpenses,
      totalSavings,
      totalTransactions
    };
  }, [analyticsData]);

  // Calculer les tendances (comparaison avec la période précédente)
  const trends = useMemo(() => {
    if (analyticsData.length < 2) return { income: 0, expenses: 0, savings: 0 };
    
    const current = analyticsData[analyticsData.length - 1];
    const previous = analyticsData[analyticsData.length - 2];
    
    const incomeTrend = previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0;
    const expensesTrend = previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0;
    const savingsTrend = previous.savings !== 0 ? ((current.savings - previous.savings) / Math.abs(previous.savings)) * 100 : 0;
    
    return {
      income: incomeTrend,
      expenses: expensesTrend,
      savings: savingsTrend
    };
  }, [analyticsData]);

  // Calculer les catégories les plus dépensées
  const topCategories = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    analyticsData.forEach(month => {
      Object.entries(month.expensesByCategory).forEach(([category, amount]) => {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });
    });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [analyticsData]);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de période */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analyses financières</h2>
          <p className="text-gray-600 dark:text-gray-400">Visualisez vos tendances et performances</p>
        </div>
        <div className="flex gap-2">
          {['3', '6', '12'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
              className="px-3 py-1 text-sm"
            >
              {period} mois
            </Button>
          ))}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenus moyens</CardTitle>
            <div className="h-8 w-8 rounded gradient-success flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(averages.avgIncome)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(trends.income)}
              <span className={getTrendColor(trends.income)}>
                {Math.abs(trends.income).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs mois précédent</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Dépenses moyennes</CardTitle>
            <div className="h-8 w-8 rounded gradient-danger flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(averages.avgExpenses)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(trends.expenses)}
              <span className={getTrendColor(trends.expenses)}>
                {Math.abs(trends.expenses).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs mois précédent</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Épargne moyenne</CardTitle>
            <div className="h-8 w-8 rounded gradient-info flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${averages.avgSavings >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600'}`}>
              {formatCurrency(averages.avgSavings)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(trends.savings)}
              <span className={getTrendColor(trends.savings)}>
                {Math.abs(trends.savings).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs mois précédent</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Transactions moyennes</CardTitle>
            <div className="h-8 w-8 rounded gradient-warning flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {averages.avgTransactions.toFixed(0)}
            </div>
            <p className="text-sm text-gray-500">par mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Évolution des revenus et dépenses */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Évolution mensuelle
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Revenus et dépenses sur {selectedPeriod} mois
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analyticsData.map((month, index) => {
                const maxAmount = Math.max(month.income, month.expenses);
                const incomePercentage = maxAmount > 0 ? (month.income / maxAmount) * 100 : 0;
                const expensesPercentage = maxAmount > 0 ? (month.expenses / maxAmount) * 100 : 0;
                
                return (
                  <div key={month.monthKey} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{month.month}</span>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Revenus: {formatCurrency(month.income)}</span>
                        <span>Dépenses: {formatCurrency(month.expenses)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded gradient-success"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Revenus</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full gradient-success transition-all duration-500"
                            style={{ width: `${incomePercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded gradient-danger"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Dépenses</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full gradient-danger transition-all duration-500"
                            style={{ width: `${expensesPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top catégories de dépenses */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Top catégories
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Vos catégories les plus dépensées
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {topCategories.length > 0 ? (
                topCategories.map((category, index) => {
                  const total = topCategories.reduce((sum, cat) => sum + cat.amount, 0);
                  const percentage = (category.amount / total) * 100;
                  const gradients = ['gradient-danger', 'gradient-warning', 'gradient-orange', 'gradient-success', 'gradient-info'];
                  
                  return (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{category.category}</span>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">{formatCurrency(category.amount)}</div>
                          <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${gradients[index % gradients.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune dépense enregistrée</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé des totaux */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Résumé de la période
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Totaux sur {selectedPeriod} mois
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(averages.totalIncome)}</div>
              <div className="text-sm text-gray-500">Total revenus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(averages.totalExpenses)}</div>
              <div className="text-sm text-gray-500">Total dépenses</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${averages.totalSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(averages.totalSavings)}
              </div>
              <div className="text-sm text-gray-500">Total épargne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{averages.totalTransactions}</div>
              <div className="text-sm text-gray-500">Total transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
