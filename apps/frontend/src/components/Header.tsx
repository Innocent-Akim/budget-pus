'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import { useTransactions } from '@/hooks/useTransactions';
import {
  FaDollarSign,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaCog,
  FaQuestionCircle,
  FaBullseye
} from 'react-icons/fa';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function Header({ currentSection, onSectionChange }: HeaderProps) {
  const { data: session } = useSession();
  const { transactions } = useTransactions();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const currentDate = new Date();

  const quickSections = [
    { id: 'dashboard', label: 'Tableau de bord', icon: FaDollarSign },
    { id: 'analytics', label: 'Analyses', icon: FaCalendarAlt },
    { id: 'goals', label: 'Objectifs', icon: FaBullseye },
    { id: 'settings', label: 'Paramètres', icon: FaCog },
  ];

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(query.toLowerCase()) ||
        transaction.category.toLowerCase().includes(query.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Fermer les menus en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notifications simulées
  const notifications = [
    {
      id: 1,
      title: 'Objectif mensuel atteint !',
      message: 'Vous avez atteint 80% de votre objectif d\'épargne',
      time: 'Il y a 2h',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'Dépense importante détectée',
      message: 'Une dépense de 150€ a été enregistrée',
      time: 'Il y a 4h',
      type: 'warning',
      unread: true
    },
    {
      id: 3,
      title: 'Rapport hebdomadaire disponible',
      message: 'Votre rapport de la semaine est prêt',
      time: 'Il y a 1 jour',
      type: 'info',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="glass sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des transactions..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
              
              {/* Résultats de recherche */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        onSectionChange('transactions');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'INCOME' ? (
                            <FaArrowUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <FaArrowDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}{transaction.amount}€
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 relative"
              >
                <FaBell className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              
              {/* Menu des notifications */}
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{unreadCount} non lues</span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                              <FaClock className="h-3 w-3" />
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" className="w-full text-sm">
                      Voir toutes les notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Profil utilisateur */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
              >
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Photo de profil" 
                    className="h-6 w-6 rounded-full object-cover border border-blue-200 dark:border-blue-700"
                  />
                ) : (
                  <FaUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
                <span className="text-sm text-blue-700 dark:text-blue-300 max-w-32 truncate font-medium">
                  {session?.user?.name || session?.user?.email || 'Utilisateur'}
                </span>
                <FaChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </button>
              
              {/* Menu dropdown utilisateur */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {session?.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Photo de profil" 
                          className="h-10 w-10 rounded-full object-cover border border-blue-200 dark:border-blue-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FaUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session?.user?.name || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onSectionChange('settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaCog className="h-4 w-4" />
                      Paramètres
                    </button>
                    <button
                      onClick={() => {
                        onSectionChange('analytics');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaDollarSign className="h-4 w-4" />
                      Mes analyses
                    </button>
                    <button
                      onClick={() => {
                        onSectionChange('goals');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaBullseye className="h-4 w-4" />
                      Mes objectifs
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // Ici on pourrait ajouter une fonction d'aide
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaQuestionCircle className="h-4 w-4" />
                      Aide
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="outline"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMobileMenuOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
            </Button>

            <ThemeToggle />
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des transactions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            )}
            
            {/* Résultats de recherche mobile */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                      onSectionChange('transactions');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {transaction.type === 'INCOME' ? (
                          <FaArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <FaArrowDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}{transaction.amount}€
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    <FaUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                  <FaSignOutAlt className="h-4 w-4 mr-2" />
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
