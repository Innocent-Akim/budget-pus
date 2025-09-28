#!/bin/bash

# Script de démarrage rapide pour le développement
echo "🚀 Démarrage de Budget Plus en mode développement..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js >= 18.0.0"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION détectée. Veuillez utiliser Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js version $(node -v) détectée"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm run install:all
fi

# Démarrer les services
echo "🎯 Démarrage des services..."
echo "   🌐 Frontend: http://localhost:3000"
echo "   🚀 API: http://localhost:3001"
echo "   📊 API Health: http://localhost:3001/health"
echo ""
echo "💡 Les services démarrent en parallèle avec des couleurs distinctes:"
echo "   - FRONTEND (bleu) : Next.js sur le port 3000"
echo "   - API (vert) : NestJS sur le port 3001"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"
echo ""

npm run dev
