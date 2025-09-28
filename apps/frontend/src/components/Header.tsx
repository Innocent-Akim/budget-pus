'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import {
  DollarSign,
  Calendar,
  User,
  LogOut as LogOutIcon,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function Header({ currentSection, onSectionChange }: HeaderProps) {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentDate = new Date();

  const quickSections = [
    { id: 'dashboard', label: 'Tableau de bord', icon: DollarSign },
    { id: 'analytics', label: 'Analyses', icon: Calendar },
    { id: 'goals', label: 'Objectifs', icon: Calendar },
    { id: 'settings', label: 'Paramètres', icon: Calendar },
  ];

  return (
    <header className="glass sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Budget Plus
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {currentDate.toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>

          {/* Barre de recherche (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
            >
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
            </Button>

            {/* Profil utilisateur */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Photo de profil" 
                  className="h-6 w-6 rounded-full object-cover border border-blue-200 dark:border-blue-700"
                />
              ) : (
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
              <span className="text-sm text-blue-700 dark:text-blue-300 max-w-32 truncate font-medium">
                {session?.user?.name || session?.user?.email || 'Utilisateur'}
              </span>
            </div>

            {/* Menu mobile */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="outline"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Déconnexion */}
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="icon"
              className="hidden sm:flex h-10 w-10 rounded-lg border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
            >
              <LogOutIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
            </Button>

            <ThemeToggle />
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des transactions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {/* Navigation rapide */}
              <div className="grid grid-cols-2 gap-2">
                {quickSections.map((section) => (
                  <Button
                    key={section.id}
                    onClick={() => {
                      onSectionChange(section.id);
                      setIsMobileMenuOpen(false);
                    }}
                    variant={currentSection === section.id ? "default" : "outline"}
                    className={`justify-start ${
                      currentSection === section.id 
                        ? 'gradient-primary text-white' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {section.label}
                  </Button>
                ))}
              </div>

              {/* Actions utilisateur mobile */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 mb-2">
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Photo de profil" 
                      className="h-6 w-6 rounded-full object-cover border border-blue-200 dark:border-blue-700"
                    />
                  ) : (
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    {session?.user?.name || session?.user?.email || 'Utilisateur'}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full justify-start border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
