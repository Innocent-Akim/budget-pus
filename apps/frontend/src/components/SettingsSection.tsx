'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useTheme } from 'next-themes';
import {
    User, Shield,
    Palette,
    Database,
    Download,
    Upload,
    Trash2,
    Save
} from 'lucide-react';

export function SettingsSection() {
  const { theme, setTheme } = useTheme();
  const { monthlyIncome, setMonthlyIncome, clearAllData } = useBudgetStore();
  const [income, setIncome] = useState(monthlyIncome?.toString() || '');
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  const handleSaveIncome = () => {
    const incomeValue = parseFloat(income);
    if (!isNaN(incomeValue) && incomeValue >= 0) {
      setMonthlyIncome(incomeValue);
    }
  };

  const handleExportData = () => {
    const data = {
      monthlyIncome,
      budgetGoals: JSON.parse(localStorage.getItem('budgetGoals') || '[]'),
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-plus-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.monthlyIncome) setMonthlyIncome(data.monthlyIncome);
          if (data.budgetGoals) localStorage.setItem('budgetGoals', JSON.stringify(data.budgetGoals));
          if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions));
          if (data.categories) localStorage.setItem('categories', JSON.stringify(data.categories));
          window.location.reload();
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil utilisateur */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profil utilisateur
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Gérez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenu mensuel</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveIncome} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Préférences */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Préférences
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Personnalisez l'apparence et le comportement
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Thème sombre</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Activer le mode sombre</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="flex items-center gap-2"
              >
                {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des rappels</p>
              </div>
              <Button
                variant={notifications ? "default" : "outline"}
                onClick={() => setNotifications(!notifications)}
              >
                {notifications ? 'Activé' : 'Désactivé'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sauvegarde et restauration */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            Sauvegarde et restauration
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Gérez vos données et sauvegardes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Exporter les données</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Télécharger une sauvegarde</p>
              </div>
              <Button onClick={handleExportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Importer des données</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Restaurer depuis un fichier</p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Importer
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone dangereuse */}
      <Card className="border border-red-200 dark:border-red-800 shadow-sm">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-red-900 dark:text-red-300 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Zone dangereuse
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-400">
            Actions irréversibles - Procédez avec prudence
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-300">Supprimer toutes les données</h4>
              <p className="text-sm text-red-700 dark:text-red-400">Cette action supprimera définitivement toutes vos données</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleClearAllData}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer tout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
