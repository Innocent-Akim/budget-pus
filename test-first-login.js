const axios = require('axios');

const API_URL = 'http://localhost:4001';

async function testFirstLogin() {
  try {
    console.log('🧪 Test du système de première connexion...\n');

    // 1. Créer un nouvel utilisateur
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;
    
    console.log('1. Création d\'un nouvel utilisateur...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Utilisateur créé avec succès');
    console.log('User ID:', registerResponse.data.user.id);
    console.log('Email:', registerResponse.data.user.email);
    console.log('');

    // 2. Se connecter pour la première fois
    console.log('2. Première connexion...');
    const firstLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Première connexion réussie');
    console.log('Access Token:', firstLoginResponse.data.accessToken.substring(0, 20) + '...');
    console.log('');

    // 3. Se connecter une deuxième fois
    console.log('3. Deuxième connexion...');
    const secondLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Deuxième connexion réussie');
    console.log('Access Token:', secondLoginResponse.data.accessToken.substring(0, 20) + '...');
    console.log('');

    // 4. Vérifier les informations de l'utilisateur
    console.log('4. Vérification des informations utilisateur...');
    const userResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${firstLoginResponse.data.accessToken}`
      }
    });
    
    console.log('✅ Informations utilisateur récupérées');
    console.log('Nom:', userResponse.data.name);
    console.log('Email:', userResponse.data.email);
    console.log('Dernière connexion:', userResponse.data.lastLoginAt);
    console.log('');

    console.log('🎉 Test terminé avec succès !');
    console.log('📧 Vérifiez les logs de l\'API pour voir les messages d\'email de bienvenue.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Attendre que l'API soit prête
setTimeout(() => {
  testFirstLogin();
}, 3000);
