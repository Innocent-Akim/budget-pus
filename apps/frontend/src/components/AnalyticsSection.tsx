'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useUserSettings } from '@/hooks/useUserSettings';
import { formatCurrency } from '@/lib/utils';
import { TransactionType } from '@/types/budget';
import {
  TrendingUp,
  TrendingDown,
  DollarSign, BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Settings
} from 'lucide-react';

export function AnalyticsSection() {
  const { 
    transactions, 
    getTransactionsByMonth, 
    getTotalsByMonth, 
    getExpensesByCategory
  } = useTransactions();
  
  const { monthlyIncome } = useUserSettings();
  
  // S'assurer que monthlyIncome est un nombre valide
  const safeMonthlyIncome = Number(monthlyIncome) || 0;

  const [selectedPeriod, setSelectedPeriod] = useState('6'); // 6 derniers mois par défaut
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculer les données pour la période sélectionnée
  const analyticsData = useMemo(() => {
    const months = [];
    let startDateObj: Date;
    let endDateObj: Date;
    
    if (customDateRange && startDate && endDate) {
      // Utiliser les dates personnalisées
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
    } else {
      // Utiliser la période prédéfinie
      const currentDate = new Date();
      const periodMonths = parseInt(selectedPeriod);
      startDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth() - periodMonths + 1, 1);
      // Inclure le jour actuel dans la période
      endDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    
    // Générer tous les mois dans la plage et filtrer ceux qui ont des données
    const currentMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);
    const endMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1);
    
    while (currentMonth <= endMonth) {
      const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      const totals = getTotalsByMonth(monthKey);
      const expensesByCategory = getExpensesByCategory(monthKey);
      const transactionCount = getTransactionsByMonth(monthKey).length;
      
      // Utiliser soit les revenus des transactions, soit le revenu mensuel fixe
      // Éviter le double comptage si l'utilisateur a déjà enregistré son salaire
      const hasIncomeTransactions = totals.income > 0;
      const totalIncome = hasIncomeTransactions ? totals.income : safeMonthlyIncome;
      const safeExpenses = Number(totals.expenses) || 0;
      const totalSavings = totalIncome - safeExpenses;
      
      // Ne garder que les mois qui ont des données réelles (transactions ou revenu mensuel)
      const hasData = transactionCount > 0 || (safeMonthlyIncome > 0 && !hasIncomeTransactions);
      
      if (hasData) {
        months.push({
          ...transactions,
          month: monthName,
          monthKey,
          income: totalIncome,
          expenses: totals.expenses,
          savings: totalSavings,
          expensesByCategory,
          transactionCount
        });
      }
      
      // Passer au mois suivant
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    return months;
  }, [selectedPeriod, customDateRange, startDate, endDate, getTransactionsByMonth, getTotalsByMonth, getExpensesByCategory, safeMonthlyIncome]);

  // Calculer les moyennes et tendances
  const averages = useMemo(() => {
    if (analyticsData.length === 0) {
      return {
        avgIncome: 0,
        avgExpenses: 0,
        avgSavings: 0,
        avgTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        totalTransactions: 0
      };
    }
    
    const totalIncome = transactions.reduce((sum, month) => {
      const income = Number(month.type === TransactionType.INCOME ? month.amount : 0) || 0;
      return sum + income;
    }, 0);
    const totalExpenses = transactions.reduce((sum, month) => {
      const expenses = Number(month.type === TransactionType.EXPENSE ? month.amount : 0) || 0;
      return sum + expenses;
    }, 0);
    const totalSavings = transactions.reduce((sum, month) => {
      const savings = Number(month.type === TransactionType.INCOME ? month.amount : 0) || 0;
      return sum + savings;
    }, 0);
    const totalTransactions = analyticsData.reduce((sum, month) => {
      const count = Number(month.transactionCount) || 0;
      return sum + count;
    }, 0);
    
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
    
    // Trier les données par ordre chronologique pour une comparaison correcte
    const sortedData = [...analyticsData].sort((a, b) => {
      const dateA = new Date(a.monthKey + '-01');
      const dateB = new Date(b.monthKey + '-01');
      return dateA.getTime() - dateB.getTime();
    });
    
    const current = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];
    
    const currentIncome = Number(current.income) || 0;
    const previousIncome = Number(previous.income) || 0;
    const currentExpenses = Number(current.expenses) || 0;
    const previousExpenses = Number(previous.expenses) || 0;
    
    const incomeTrend = previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0;
    const expensesTrend = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;
    
    // Calcul plus intuitif pour l'épargne
    const currentSavings = Number(current.savings) || 0;
    const previousSavings = Number(previous.savings) || 0;
    
    let savingsTrend = 0;
    if (previousSavings !== 0) {
      if (previousSavings > 0) {
        // Épargne positive : calcul normal
        savingsTrend = ((currentSavings - previousSavings) / previousSavings) * 100;
      } else {
        // Épargne négative : calcul basé sur l'amélioration absolue
        const improvement = currentSavings - previousSavings;
        savingsTrend = improvement > 0 ? 100 : (improvement / Math.abs(previousSavings)) * 100;
      }
    }
    
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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analyses financières</h2>
          <p className="text-gray-600 dark:text-gray-400">Visualisez vos tendances et performances</p>
        </div>
        
        {/* Contrôles de filtrage */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Périodes prédéfinies */}
          {!customDateRange && (
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
          )}
          
          {/* Bouton pour activer le filtrage personnalisé */}
          <Button
            variant={customDateRange ? "default" : "outline"}
            onClick={() => {
              setCustomDateRange(!customDateRange);
              if (!customDateRange) {
                // Initialiser avec les 6 derniers mois
                const currentDate = new Date();
                const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
                setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
                setEndDate(currentDate.toISOString().split('T')[0]);
              }
            }}
            className="px-3 py-1 text-sm flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {customDateRange ? 'Période fixe' : 'Période personnalisée'}
          </Button>
        </div>
      </div>

      {/* Sélecteurs de date personnalisés */}
      {customDateRange && (
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Sélectionner une période
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setCustomDateRange(false)}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              {isNaN(averages.avgIncome) ? '0 €' : formatCurrency(averages.avgIncome)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(trends.income)}
              <span className={getTrendColor(trends.income)}>
                {isNaN(trends.income) ? '0.0' : Math.abs(trends.income).toFixed(1)}%
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
              {isNaN(averages.avgExpenses) ? '0 €' : formatCurrency(averages.avgExpenses)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(trends.expenses)}
              <span className={getTrendColor(trends.expenses)}>
                {isNaN(trends.expenses) ? '0.0' : Math.abs(trends.expenses).toFixed(1)}%
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
              {isNaN(averages.avgSavings) ? '0 €' : formatCurrency(averages.avgSavings)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(trends.savings)}
              <span className={getTrendColor(trends.savings)}>
                {isNaN(trends.savings) ? '0.0' : Math.abs(trends.savings).toFixed(1)}%
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
              {isNaN(averages.avgTransactions) ? '0' : averages.avgTransactions.toFixed(0)}
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
              {customDateRange 
                ? `Revenus et dépenses du ${startDate ? new Date(startDate).toLocaleDateString('fr-FR') : ''} au ${endDate ? new Date(endDate).toLocaleDateString('fr-FR') : ''}`
                : `Revenus et dépenses sur ${selectedPeriod} mois`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {analyticsData.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">Aucune donnée disponible</p>
                <p className="text-gray-400 text-sm">
                  Aucune transaction ou revenu enregistré pour cette période.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.map((month, index) => {
                const [year, monthNum] = month.monthKey.split('-');
                const monthStartDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
                const monthEndDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
                
                // Filtrer les transactions qui correspondent à ce mois
                const monthTransactions = transactions.filter(transaction => {
                  const transactionDate = new Date(transaction.date);
                  return transactionDate >= monthStartDate && transactionDate <= monthEndDate;
                });
                
                // Calculer les totaux basés sur les transactions filtrées par date
                const filteredIncome = monthTransactions
                  .filter(t => t.type === TransactionType.INCOME)
                  .reduce((sum, t) => sum + t.amount, 0);
                const filteredExpenses = monthTransactions
                  .filter(t => t.type === TransactionType.EXPENSE)
                  .reduce((sum, t) => sum + t.amount, 0);
                
                const maxAmount = Math.max(filteredIncome, filteredExpenses);
                const incomePercentage = maxAmount > 0 ? (filteredIncome / maxAmount) * 100 : 0;
                const expensesPercentage = maxAmount > 0 ? (filteredExpenses / maxAmount) * 100 : 0;
                
                return (
                  <div key={month.monthKey} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{month.month}</span>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Revenus: {formatCurrency(filteredIncome)}</span>
                        <span>Dépenses: {formatCurrency(filteredExpenses)}</span>
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
            )}
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
            {topCategories.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">Aucune dépense enregistrée</p>
                <p className="text-gray-400 text-sm">
                  Aucune transaction de dépense trouvée pour cette période.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCategories.map((category, index) => {
                  const total = topCategories.reduce((sum, cat) => sum + cat.amount, 0);
                  const percentage = (category.amount / total) * 100;
                  const gradients = ['gradient-danger', 'gradient-warning', 'gradient-orange', 'gradient-success', 'gradient-info'];
                  
                  return (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white capitalize">{category.category}</span>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white capitalize">{formatCurrency(category.amount)}</div>
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
                })}
              </div>
            )}
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
            {customDateRange 
              ? `Totaux sur la période sélectionnée (${analyticsData.length} mois)`
              : `Totaux sur ${selectedPeriod} mois`
            }
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
