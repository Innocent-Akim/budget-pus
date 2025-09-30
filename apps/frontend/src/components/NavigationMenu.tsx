'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Home,
  BarChart3,
  Target,
  Calendar,
  Settings,
  Menu,
  X,
  Wallet
} from 'lucide-react';

interface NavigationMenuProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

export function NavigationMenu({ currentSection = 'dashboard', onSectionChange }: NavigationMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'analytics', label: 'Analyses', icon: BarChart3 },
    { id: 'goals', label: 'Objectifs', icon: Target },
    { id: 'history', label: 'Historique', icon: Calendar },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handleItemClick = (itemId: string) => {
    onSectionChange?.(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 
                   bg-white/90 dark:bg-gray-800/90 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20
                   hover:border-blue-300 dark:hover:border-blue-700
                   text-gray-600 dark:text-gray-400
                   hover:text-blue-600 dark:hover:text-blue-400
                   transition-all duration-200"
      >
        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budget Plus</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gestion financière</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentSection === item.id ? "default" : "ghost"}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full justify-start items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentSection === item.id
                      ? 'gradient-primary text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Plus</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gestion financière</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentSection === item.id ? "default" : "ghost"}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full justify-start items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentSection === item.id
                          ? 'gradient-primary text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
