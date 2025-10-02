#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 Diagnostic Email - Configuration actuelle\n');

// Vérifier .env.local
if (fs.existsSync('.env.local')) {
  console.log('✅ Fichier .env.local trouvé');
  const content = fs.readFileSync('.env.local', 'utf8');
  
  const hasApiKey = content.includes('NEXT_PUBLIC_NOVU_API_KEY');
  const hasFrontendUrl = content.includes('NEXT_PUBLIC_FRONTEND_URL');
  
  console.log('   - NEXT_PUBLIC_NOVU_API_KEY:', hasApiKey ? '✅ Configuré' : '❌ Manquant');
  console.log('   - NEXT_PUBLIC_FRONTEND_URL:', hasFrontendUrl ? '✅ Configuré' : '❌ Manquant');
  
  if (hasApiKey) {
    const match = content.match(/NEXT_PUBLIC_NOVU_API_KEY=(.+)/);
    if (match) {
      const key = match[1].trim();
      console.log('   - Format clé:', key.startsWith('nv_') ? '✅ Valide (nv_)' : '❌ Invalide (doit commencer par nv_)');
      console.log('   - Clé actuelle:', key.substring(0, 10) + '...');
    }
  }
} else {
  console.log('❌ Fichier .env.local non trouvé');
}

// Vérifier package.json
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasNovu = pkg.dependencies && pkg.dependencies['@novu/node'];
  console.log('\n✅ package.json trouvé');
  console.log('   - @novu/node:', hasNovu ? '✅ Installé' : '❌ Non installé');
} else {
  console.log('\n❌ package.json non trouvé');
}

// Vérifier les fichiers de service
const files = [
  'src/services/email.service.ts',
  'src/templates/email-templates.ts',
  'src/components/EmailDebugPanel.tsx'
];

console.log('\n📁 Fichiers de service:');
files.forEach(file => {
  console.log(`   - ${file}:`, fs.existsSync(file) ? '✅ Trouvé' : '❌ Manquant');
});

console.log('\n💡 Prochaines étapes:');
console.log('1. Vérifiez que votre clé API Novu commence par "nv_"');
console.log('2. Allez sur https://novu.co pour obtenir une clé valide');
console.log('3. Configurez un fournisseur d\'email dans Novu');
console.log('4. Créez les templates d\'email requis');
console.log('5. Redémarrez l\'application (npm run dev)');
console.log('6. Utilisez le panneau de debug dans l\'app pour tester');

