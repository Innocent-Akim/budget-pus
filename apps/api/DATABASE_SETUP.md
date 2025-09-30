# Configuration de la Base de Données

## Vue d'ensemble

Cette application utilise PostgreSQL avec TypeORM pour la gestion de la base de données. La configuration est centralisée dans `config/app.config.ts` et suit les meilleures pratiques de développement.

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=budget_plus
```

### Configuration de production

Pour la production, ajoutez également :

```env
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

## Installation de PostgreSQL

### macOS (avec Homebrew)
```bash
brew install postgresql
brew services start postgresql
createdb budget_plus
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb budget_plus
```

### Docker
```bash
docker run --name budget-plus-db \
  -e POSTGRES_DB=budget_plus \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

## Scripts de migration

### Générer une migration
```bash
npm run migration:generate -- src/migrations/InitialMigration
```

### Exécuter les migrations
```bash
npm run migration:run
```

### Revenir en arrière
```bash
npm run migration:revert
```

### Voir l'état des migrations
```bash
npm run migration:show
```

## Entités

### User
- Gestion des utilisateurs avec authentification
- Métriques financières calculées
- Relations avec les transactions et objectifs

### Transaction
- Gestion des revenus et dépenses
- Catégorisation automatique
- Support des transactions récurrentes
- Système de tags

### Goal
- Objectifs financiers personnalisés
- Calcul automatique du progrès
- Support des objectifs récurrents
- Notifications d'échéance

## Services

### DatabaseService
Service centralisé pour toutes les opérations de base de données :
- CRUD operations pour toutes les entités
- Requêtes analytiques
- Gestion des transactions
- Health checks

## Monitoring

### Health Check
- `GET /health` - État général de l'application
- `GET /health/database` - État spécifique de la base de données

### Logs
En mode développement, TypeORM logge toutes les requêtes SQL.

## Sécurité

- Utilisation de paramètres préparés pour éviter les injections SQL
- Validation des entrées avec des DTOs
- Gestion des erreurs centralisée
- Support SSL en production

## Performance

- Index sur les colonnes fréquemment requêtées
- Relations optimisées avec lazy loading
- Pagination pour les listes
- Cache des requêtes fréquentes (à implémenter)

## Développement

### Structure recommandée
```
src/
├── entities/          # Entités TypeORM
├── database/          # Configuration et services DB
├── migrations/        # Migrations de base de données
├── health/           # Health checks
└── config/           # Configuration de l'application
```

### Bonnes pratiques
1. Toujours utiliser des migrations pour les changements de schéma
2. Tester les requêtes avec des données réalistes
3. Utiliser les transactions pour les opérations complexes
4. Implémenter la pagination pour les listes
5. Valider les données avant insertion
