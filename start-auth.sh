#!/bin/bash

# Script de démarrage pour le système d'authentification Budget Plus

echo "🚀 Démarrage du système d'authentification Budget Plus..."

# Tuer les processus existants
echo "🔄 Arrêt des processus existants..."
killall node 2>/dev/null || true

# Attendre un peu
sleep 2

# Démarrer l'API
echo "🔧 Démarrage de l'API (port 3001)..."
cd apps/api
npm run start:dev &
API_PID=$!

# Attendre que l'API démarre
sleep 5

# Démarrer le frontend
echo "🎨 Démarrage du frontend (port 4000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Serveurs démarrés !"
echo "📱 Frontend: http://localhost:4000"
echo "🔧 API: http://localhost:3001"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $API_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    killall node 2>/dev/null || true
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait
