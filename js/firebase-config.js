/**
 * Firebase Configuration - Loomper Connect
 * Configuração do Firebase para Landing Page
 */

// Firebase Configuration (loomper-e4c38)
const firebaseConfig = {
  apiKey: "AIzaSyDxsFjK7wAzGpQFl3QmYyG8TnJ7YlvOqHQ",
  authDomain: "loomper-e4c38.firebaseapp.com",
  projectId: "loomper-e4c38",
  storageBucket: "loomper-e4c38.firebasestorage.app",
  messagingSenderId: "497705466222",
  appId: "1:497705466222:web:ca0c4f8c3ae4a6f2e65f94",
  measurementId: "G-KVYPSTQ94T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

console.log('✅ Firebase inicializado com sucesso');

/**
 * Função para registrar Lead no Firestore
 * @param {Object} leadData - Dados do lead
 * @returns {Promise<string>} - ID do documento criado
 */
async function registerLead(leadData) {
  try {
    console.log('📝 Registrando lead:', leadData);
    
    // Adicionar timestamp e ID único
    const lead = {
      ...leadData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending', // pending, contacted, converted, rejected
      source: 'landing_page',
    };
    
    // Salvar no Firestore
    const docRef = await db.collection('leads').add(lead);
    
    console.log('✅ Lead registrado com ID:', docRef.id);
    
    // Se tem código de indicação, registrar indicação
    if (leadData.indicado_por) {
      await registerReferral(docRef.id, leadData.indicado_por);
    }
    
    // Incrementar contador da campanha
    await incrementCampaignCounter(leadData.perfil);
    
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Erro ao registrar lead:', error);
    throw error;
  }
}

/**
 * Registrar indicação no sistema MLM
 * @param {string} leadId - ID do lead indicado
 * @param {string} referralCode - Código de quem indicou
 */
async function registerReferral(leadId, referralCode) {
  try {
    // Buscar usuário que indicou pelo código
    const usersQuery = await db.collection('users')
      .where('referral.myCode', '==', referralCode)
      .limit(1)
      .get();
    
    if (usersQuery.empty) {
      console.warn('⚠️ Código de indicação não encontrado:', referralCode);
      return;
    }
    
    const referrerDoc = usersQuery.docs[0];
    const referrerId = referrerDoc.id;
    
    // Criar registro de indicação
    await db.collection('referrals').add({
      referrerId: referrerId,
      referredLeadId: leadId,
      status: 'pending', // pending, confirmed, rejected
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmedAt: null,
    });
    
    // Incrementar contador de indicações
    await referrerDoc.ref.update({
      'referral.totalReferrals': firebase.firestore.FieldValue.increment(1),
    });
    
    console.log('✅ Indicação registrada:', referrerId, '->', leadId);
    
  } catch (error) {
    console.error('❌ Erro ao registrar indicação:', error);
  }
}

/**
 * Incrementar contador de cadastros da campanha
 * ATUALIZADO: Não depende mais de collection 'campaigns'
 * O contador é calculado dinamicamente a partir de users aprovados
 * @param {string} perfil - Tipo de perfil (motorista, ajudante, transportadora)
 */
async function incrementCampaignCounter(perfil) {
  try {
    // Não precisa mais incrementar nada - o contador é calculado em tempo real
    // a partir do total de usuários aprovados no Firestore
    console.log(`ℹ️ Contador será atualizado automaticamente (perfil: ${perfil})`);
    
  } catch (error) {
    console.error('❌ Erro ao incrementar contador:', error);
  }
}

/**
 * Buscar dados da campanha (contador em tempo real)
 * ATUALIZADO: Busca diretamente do Firestore (total de usuários aprovados)
 * @returns {Promise<Object>} - Dados da campanha
 */
async function getCampaignData() {
  try {
    console.log('📊 Buscando estatísticas em tempo real...');
    
    // Buscar todos os usuários aprovados do Firestore
    const usersQuery = await db.collection('users')
      .where('status', 'in', ['aprovado', 'approved', 'active'])
      .get();
    
    const totalApprovedUsers = usersQuery.size;
    
    console.log(`✅ Total de usuários aprovados: ${totalApprovedUsers}`);
    
    // Retornar no formato esperado pela landing page
    return {
      stats: {
        totalSignups: totalApprovedUsers,
        totalUsers: totalApprovedUsers,
        updatedAt: new Date().toISOString(),
      },
      tiers: {
        founder: {
          maxSlots: 500,
          currentSlots: Math.min(totalApprovedUsers, 500),
          available: Math.max(0, 500 - totalApprovedUsers),
        },
        pioneer: {
          maxSlots: 1500,
          currentSlots: Math.max(0, Math.min(totalApprovedUsers - 500, 1000)),
          available: totalApprovedUsers > 500 ? Math.max(0, 1500 - totalApprovedUsers) : 1000,
        },
        early: {
          maxSlots: 5000,
          currentSlots: Math.max(0, Math.min(totalApprovedUsers - 1500, 3500)),
          available: totalApprovedUsers > 1500 ? Math.max(0, 5000 - totalApprovedUsers) : 3500,
        },
      },
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar campanha:', error);
    
    // Fallback: retornar estrutura padrão
    return {
      stats: {
        totalSignups: 0,
        totalUsers: 0,
        updatedAt: new Date().toISOString(),
      },
      tiers: {
        founder: { maxSlots: 500, currentSlots: 0, available: 500 },
        pioneer: { maxSlots: 1500, currentSlots: 0, available: 1000 },
        early: { maxSlots: 5000, currentSlots: 0, available: 3500 },
      },
    };
  }
}

// Exportar funções
window.LoomperFirebase = {
  registerLead,
  getCampaignData,
};

console.log('🔥 Firebase Loomper Connect pronto!');
