#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Akim12345',
  database: 'postgres', // Connect to default database first
});

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    const dbName = process.env.DB_NAME || 'budget_plus';
    
    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rows.length === 0) {
      console.log(`📦 Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database ${dbName} created successfully`);
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run migration:run');
    console.log('2. Run: npm run start:dev');
    console.log('3. Check health: http://localhost:3001/health');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
