export const appConfig = {
  port: process.env.PORT || 4001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4000',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
  database: {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Akim12345',
    database: process.env.DB_NAME || 'budget_plus',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: process.env.NODE_ENV === 'production',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
};
