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
 * @param {string} perfil - Tipo de perfil (motorista, ajudante, transportadora)
 */
async function incrementCampaignCounter(perfil) {
  try {
    const campaignRef = db.collection('campaigns').doc('pioneer_launch');
    
    // Buscar campanha atual
    const campaignDoc = await campaignRef.get();
    if (!campaignDoc.exists) {
      console.warn('⚠️ Campanha não encontrada');
      return;
    }
    
    const campaign = campaignDoc.data();
    const totalSignups = campaign.stats.totalSignups + 1;
    
    // Determinar tier
    let tierToUpdate = null;
    if (totalSignups <= 500) {
      tierToUpdate = 'founder';
    } else if (totalSignups <= 1500) {
      tierToUpdate = 'pioneer';
    } else if (totalSignups <= 5000) {
      tierToUpdate = 'early';
    }
    
    // Atualizar campanha
    const updates = {
      'stats.totalSignups': totalSignups,
      'stats.updatedAt': firebase.firestore.FieldValue.serverTimestamp(),
    };
    
    if (tierToUpdate) {
      updates[`tiers.${tierToUpdate}.currentSlots`] = firebase.firestore.FieldValue.increment(1);
    }
    
    await campaignRef.update(updates);
    
    console.log(`✅ Contador incrementado: ${totalSignups} (tier: ${tierToUpdate || 'none'})`);
    
  } catch (error) {
    console.error('❌ Erro ao incrementar contador:', error);
  }
}

/**
 * Buscar dados da campanha (contador em tempo real)
 * @returns {Promise<Object>} - Dados da campanha
 */
async function getCampaignData() {
  try {
    const campaignDoc = await db.collection('campaigns').doc('pioneer_launch').get();
    
    if (!campaignDoc.exists) {
      console.warn('⚠️ Campanha não encontrada');
      return null;
    }
    
    return campaignDoc.data();
    
  } catch (error) {
    console.error('❌ Erro ao buscar campanha:', error);
    return null;
  }
}

// Exportar funções
window.LoomperFirebase = {
  registerLead,
  getCampaignData,
};

console.log('🔥 Firebase Loomper Connect pronto!');
