# Budget Plus

Un monorepo contenant une application de gestion de budget avec un frontend Next.js et une API NestJS.

## Structure du projet

```
budget-plus/
├── apps/
│   ├── frontend/          # Application Next.js (React)
│   └── api/               # API NestJS
├── packages/              # Packages partagés (à venir)
├── package.json           # Configuration du monorepo
└── tsconfig.json          # Configuration TypeScript globale
```

## Prérequis

- Node.js >= 18.0.0
- npm >= 8.0.0

## Installation

```bash
# Installer toutes les dépendances
npm run install:all

# Ou installer manuellement
npm install
cd apps/frontend && npm install
cd ../api && npm install
```

## Scripts disponibles

### Développement
```bash
# Démarrer le frontend et l'API en parallèle
npm run dev

# Démarrer seulement le frontend (port 3000)
npm run dev:frontend

# Démarrer seulement l'API (port 3001)
npm run dev:api
```

### Build
```bash
# Build complet (frontend + API)
npm run build

# Build frontend seulement
npm run build:frontend

# Build API seulement
npm run build:api
```

### Production
```bash
# Démarrer en production
npm run start

# Démarrer frontend seulement
npm run start:frontend

# Démarrer API seulement
npm run start:api
```

### Autres
```bash
# Linter
npm run lint

# Tests
npm run test

# Nettoyer les node_modules
npm run clean
```

## URLs

- **Frontend**: http://localhost:3000 (Next.js)
- **API**: http://localhost:3001 (NestJS)
- **API Health Check**: http://localhost:3001/health

## Configuration des ports

Les ports sont configurés de manière explicite :

- **Frontend (Next.js)** : Port 3000
  - Configuré dans `apps/frontend/next.config.ts`
  - Scripts avec `--port 3000`

- **API (NestJS)** : Port 3001
  - Configuré dans `apps/api/config/app.config.ts`
  - Variable d'environnement `PORT=3001`
  - CORS configuré pour accepter les requêtes du frontend

## Développement

### Frontend (Next.js)
Le frontend est situé dans `apps/frontend/` et utilise Next.js 15 avec React 19.

### API (NestJS)
L'API est située dans `apps/api/` et utilise NestJS avec TypeScript.

### Packages partagés
Les packages partagés peuvent être ajoutés dans le dossier `packages/` pour du code commun entre le frontend et l'API.