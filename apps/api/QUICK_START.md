# 🚀 Guide de Démarrage Rapide - Base de Données

## 1. Installation des dépendances

```bash
cd apps/api
npm install
```

## 2. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `apps/api/` :

```env
# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=budget_plus
```

## 3. Installation de PostgreSQL

### Option A: Docker (Recommandé)
```bash
docker run --name budget-plus-db \
  -e POSTGRES_DB=budget_plus \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Akim12345 \
  -p 5432:5432 \
  -d postgres:15
```

### Option B: Installation locale
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 4. Configuration de la base de données

```bash
# Créer la base de données
npm run db:setup

# Générer la migration initiale
npm run migration:generate -- src/migrations/InitialMigration

# Exécuter les migrations
npm run migration:run
```

## 5. Démarrage de l'application

```bash
npm run start:dev
```

## 6. Vérification

- **API Health**: http://localhost:3001/health
- **Database Health**: http://localhost:3001/health/database

## Commandes utiles

```bash
# Voir l'état des migrations
npm run migration:show

# Revenir en arrière d'une migration
npm run migration:revert

# Réinitialiser la base de données
npm run db:reset

# Synchroniser le schéma (développement uniquement)
npm run schema:sync
```

## Structure de la base de données

### Tables créées :
- `users` - Gestion des utilisateurs
- `transactions` - Revenus et dépenses
- `goals` - Objectifs financiers
- `migrations` - Historique des migrations

### Relations :
- User → Transactions (1:N)
- User → Goals (1:N)

## Dépannage

### Erreur de connexion
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les variables d'environnement
3. Testez la connexion : `psql -h localhost -U postgres -d budget_plus`

### Erreur de migration
1. Vérifiez que la base de données existe
2. Vérifiez les permissions de l'utilisateur
3. Consultez les logs : `npm run migration:show`

## Prochaines étapes

1. Créer des contrôleurs pour les entités
2. Implémenter l'authentification
3. Ajouter la validation des données
4. Créer des tests unitaires
5. Configurer le monitoring
