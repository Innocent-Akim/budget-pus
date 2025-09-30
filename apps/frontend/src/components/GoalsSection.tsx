'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddGoalModal } from '@/components/AddGoalModal';
import { useGoals } from '@/hooks/useGoals';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Target, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Goal } from '@/types/budget';

export function GoalsSection() {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const { goals: budgetGoals, deleteGoal } = useGoals();


  const calculateProgress = (goal: Goal) => {
    const currentAmount = goal.currentAmount || 0;
    const targetAmount = goal.targetAmount || 0;
    if (targetAmount === 0) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  const calculateMonthsRemaining = (targetDate: Date | string) => {
    const now = new Date();
    const target = new Date(targetDate);
    
    // Check if the date is valid
    if (isNaN(target.getTime())) {
      console.warn('Invalid target date:', targetDate);
      return 0;
    }
    
    const months = (target.getFullYear() - now.getFullYear()) * 12 + 
                  (target.getMonth() - now.getMonth());
    return Math.max(0, months);
  };

  return (
    <>
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Objectifs d&apos;épargne
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Suivez votre progression vers vos objectifs financiers
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddGoalOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvel objectif
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {budgetGoals?.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Aucun objectif d&apos;épargne défini</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Créez votre premier objectif pour commencer à épargner
              </p>
              <Button
                onClick={() => setIsAddGoalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Créer un objectif
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {budgetGoals?.map((goal, index) => {
                if (!goal) return null;
                
                const progress = calculateProgress(goal);
                const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
                const monthlyTarget = monthsRemaining > 0 
                  ? (goal.targetAmount - (goal.currentAmount || 0)) / monthsRemaining
                  : 0;

                return (
                  <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Échéance: {formatDate(goal.targetDate)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteGoal(goal.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{formatCurrency(goal.currentAmount || 0)}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.targetAmount || 0)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{progress.toFixed(1)}% atteint</span>
                        <span>{monthsRemaining} mois restants</span>
                      </div>
                      {monthlyTarget > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-xs text-center text-blue-700 dark:text-blue-300 font-medium">
                            💡 Épargne mensuelle recommandée: {formatCurrency(monthlyTarget)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddGoalModal
        open={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
      />
    </>
  );
}
