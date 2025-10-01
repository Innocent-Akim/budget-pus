# 💰 Budget Plus

A comprehensive personal budget management application built with Next.js and NestJS, offering detailed financial tracking with advanced analytics features and goal management.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

## ✨ Features

### 📊 Transaction Management
- **Transaction types** : Income, expenses, and transfers
- **Automatic categorization** : 10+ predefined categories (food, transport, housing, etc.)
- **Recurring transactions** : Support for monthly, weekly, and yearly payments
- **Tag system** : Flexible organization with custom tags
- **Complete history** : Track all transactions with search and filtering

### 🎯 Financial Goals
- **Goal types** : Savings, debt payoff, emergency fund, vacation, etc.
- **Automatic progress calculation** : Progress percentage and remaining amount
- **Monthly contributions** : Automatic suggestions based on target date
- **Recurring goals** : Support for goals that renew
- **Due date notifications** : Alerts for overdue goals

### 📈 Advanced Analytics
- **Visual dashboards** : Real-time charts and metrics
- **Category analysis** : Expense breakdown by category
- **Monthly history** : Comparison with previous months
- **Financial trends** : Evolution of income and expenses
- **Key metrics** : Savings, savings ratio, average expenses

### 🔐 Secure Authentication
- **Login/Registration** : Complete authentication system
- **Google OAuth** : Quick login with Google
- **JWT Tokens** : Enhanced security with JWT tokens
- **Persistent sessions** : Secure automatic login

### ⚙️ Customizable Settings
- **Monthly income** : Fixed income configuration
- **Dark/light theme** : Adaptive interface
- **User preferences** : Experience personalization

## 🏗️ Architecture

### Monorepo Structure
```
budget-plus/
├── apps/
│   ├── frontend/          # Next.js Application (React 18)
│   └── api/               # NestJS API (TypeScript)
├── packages/              # Shared packages (coming soon)
├── package.json           # Monorepo configuration
└── tsconfig.json          # Global TypeScript configuration
```

### Technology Stack

#### Frontend (Next.js)
- **Framework** : Next.js 14 with App Router
- **UI** : React 18 + TypeScript
- **Styling** : Tailwind CSS + Radix UI
- **State Management** : Zustand + React Query
- **Authentication** : NextAuth.js
- **Charts** : Recharts
- **Icons** : Lucide React + Heroicons

#### Backend (NestJS)
- **Framework** : NestJS with TypeScript
- **Database** : PostgreSQL with TypeORM
- **Authentication** : JWT + Passport
- **Validation** : class-validator + class-transformer
- **Security** : Helmet + CORS
- **Password Hashing** : bcrypt

## 🚀 Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **PostgreSQL** >= 13.0

### 1. Clone the project
```bash
git clone <repository-url>
cd budget-plus
```

### 2. Install dependencies
```bash
# Install all dependencies (recommended)
npm run install:all

# Or install manually
npm install
cd apps/frontend && npm install
cd ../api && npm install
```

### 3. Database configuration

#### PostgreSQL Installation

**macOS (with Homebrew)**
```bash
brew install postgresql
brew services start postgresql
createdb budget_plus
```

**Ubuntu/Debian**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb budget_plus
```

**Docker**
```bash
docker run --name budget-plus-db \
  -e POSTGRES_DB=budget_plus \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Environment variables configuration

#### API (.env in apps/api/)
```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=budget_plus

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Frontend (.env.local in apps/frontend/)
```env
# API configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 5. Initialize the database
```bash
cd apps/api
npm run migration:run
```

## 🎮 Usage

### Development
```bash
# Start frontend and API in parallel
npm run dev

# Start only frontend (port 4000)
npm run dev:frontend

# Start only API (port 3001)
npm run dev:api
```

### Production
```bash
# Complete build
npm run build

# Start in production
npm run start
```

### Available scripts
```bash
# Development
npm run dev                 # Frontend + API
npm run dev:frontend        # Frontend only
npm run dev:api            # API only

# Build
npm run build              # Complete build
npm run build:frontend     # Frontend only
npm run build:api         # API only

# Production
npm run start              # Production start
npm run start:frontend     # Frontend only
npm run start:api         # API only

# Maintenance
npm run lint               # Linter
npm run test              # Tests
npm run clean             # Clean node_modules
```

## 🌐 URLs

- **Frontend** : http://localhost:4000
- **API** : http://localhost:3001
- **API Health Check** : http://localhost:3001/health

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout
- `GET /auth/me` - User profile
- `GET /auth/session` - Current session
- `POST /auth/google` - Google authentication

### Transactions
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/stats` - Transaction statistics

### Goals
- `GET /goals` - List goals
- `POST /goals` - Create goal
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal
- `POST /goals/:id/contribute` - Contribute to goal

### User
- `GET /user/profile` - User profile
- `GET /user/settings` - User settings
- `PUT /user/settings` - Update settings
- `PUT /user/monthly-income` - Update monthly income
- `GET /user/stats` - User statistics

### Accounts
- `GET /accounts` - List accounts
- `POST /accounts` - Create account
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account

### Health
- `GET /health` - Application health status
- `GET /health/database` - Database health status

## 🗄️ Database

### Main entities

#### User
- User information and settings
- Calculated financial metrics
- Relations with transactions and goals

#### Transaction
- Income and expense management
- Recurring transaction support
- Categorization and tagging system

#### Goal
- Custom financial goals
- Automatic progress calculation
- Recurring goal support

#### Account
- Bank accounts and wallets
- Balance tracking
- Transaction organization

### Migrations
```bash
# Generate a migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Rollback
npm run migration:revert

# View migration status
npm run migration:show
```

## 🔧 Configuration

### Ports
- **Frontend** : 4000 (configured in `next.config.js`)
- **API** : 3001 (configured in `config/app.config.ts`)

### CORS
The API is configured to accept requests from the frontend on `http://localhost:4000`.

### Database
- **Type** : PostgreSQL
- **ORM** : TypeORM
- **Migrations** : Automatic on startup
- **Indexes** : Optimized for frequent queries

## 🧪 Testing

```bash
# API tests
cd apps/api
npm run test

# Tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### Production environment variables

#### API
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
JWT_SECRET=your-production-jwt-secret
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=your-production-nextauth-secret
```

### Docker (optional)
```bash
# Database
docker run --name budget-plus-db \
  -e POSTGRES_DB=budget_plus \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# API
cd apps/api
docker build -t budget-plus-api .
docker run -p 3001:3001 budget-plus-api

# Frontend
cd apps/frontend
docker build -t budget-plus-frontend .
docker run -p 4000:4000 budget-plus-frontend
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For any questions or issues:

1. Check application logs
2. Consult API documentation
3. Verify environment variable configuration
4. Test API endpoints individually

## 🔄 Changelog

### v0.1.0
- ✨ Complete authentication system
- ✨ Transaction management (CRUD)
- ✨ Financial goals system
- ✨ Analytics and dashboards
- ✨ Modern user interface
- ✨ Recurring transaction support
- ✨ Dark/light theme
- ✨ Complete REST API with NestJS
- ✨ PostgreSQL database with TypeORM

---

**Budget Plus** - Your companion for intelligent financial management 💰