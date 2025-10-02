#!/usr/bin/env node

/**
 * Script de vérification de la configuration email
 * Usage: node check-email-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration email...\n');

// 1. Vérifier le fichier .env.local
const envPath = path.join(__dirname, 'apps/frontend/.env.local');
console.log('1. Vérification du fichier .env.local:');
if (fs.existsSync(envPath)) {
  console.log('   ✅ Fichier .env.local trouvé');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('NEXT_PUBLIC_NOVU_API_KEY');
  const hasFrontendUrl = envContent.includes('NEXT_PUBLIC_FRONTEND_URL');
  
  console.log('   - NEXT_PUBLIC_NOVU_API_KEY:', hasApiKey ? '✅ Configuré' : '❌ Manquant');
  console.log('   - NEXT_PUBLIC_FRONTEND_URL:', hasFrontendUrl ? '✅ Configuré' : '❌ Manquant');
  
  if (hasApiKey) {
    const apiKeyMatch = envContent.match(/NEXT_PUBLIC_NOVU_API_KEY=(.+)/);
    if (apiKeyMatch) {
      const apiKey = apiKeyMatch[1].trim();
      console.log('   - Format API Key:', apiKey.startsWith('nv_') ? '✅ Valide' : '❌ Invalide (doit commencer par nv_)');
    }
  }
} else {
  console.log('   ❌ Fichier .env.local non trouvé');
  console.log('   💡 Créez le fichier apps/frontend/.env.local avec:');
  console.log('      NEXT_PUBLIC_NOVU_API_KEY=your-novu-api-key-here');
  console.log('      NEXT_PUBLIC_FRONTEND_URL=http://localhost:4000');
}

console.log('\n2. Vérification des dépendances:');
const packageJsonPath = path.join(__dirname, 'apps/frontend/package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasNovu = packageJson.dependencies && packageJson.dependencies['@novu/node'];
  console.log('   - @novu/node:', hasNovu ? '✅ Installé' : '❌ Non installé');
} else {
  console.log('   ❌ package.json non trouvé');
}

console.log('\n3. Vérification des fichiers de service:');
const emailServicePath = path.join(__dirname, 'apps/frontend/src/services/email.service.ts');
console.log('   - email.service.ts:', fs.existsSync(emailServicePath) ? '✅ Trouvé' : '❌ Manquant');

const emailTemplatesPath = path.join(__dirname, 'apps/frontend/src/templates/email-templates.ts');
console.log('   - email-templates.ts:', fs.existsSync(emailTemplatesPath) ? '✅ Trouvé' : '❌ Manquant');

console.log('\n4. Instructions pour configurer Novu:');
console.log('   1. Allez sur https://novu.co');
console.log('   2. Créez un compte et une application');
console.log('   3. Copiez votre clé API (commence par nv_)');
console.log('   4. Ajoutez-la dans apps/frontend/.env.local');
console.log('   5. Configurez un fournisseur d\'email (SendGrid, Mailgun, etc.)');
console.log('   6. Créez les templates d\'email requis');
console.log('   7. Redémarrez l\'application (npm run dev)');

console.log('\n5. Templates requis dans Novu:');
console.log('   - welcome-email');
console.log('   - password-reset-email');
console.log('   - email-verification');
console.log('   - transaction-notification');
console.log('   - goal-achievement');
console.log('   - budget-alert');

console.log('\n✅ Vérification terminée !');
console.log('💡 Utilisez le panneau de debug dans l\'application pour tester l\'envoi d\'emails.');
