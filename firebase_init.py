#!/usr/bin/env python3
"""
🔥 LOOMPER - FIREBASE INITIALIZATION SCRIPT
============================================

Este script inicializa toda a estrutura do Firebase Firestore para o projeto Loomper.

ESTRUTURA CRIADA:
1. Coleção 'campaigns' com documento 'pioneer_launch'
2. Coleção 'leads' com 5 exemplos
3. Coleção 'users' com 3 exemplos (Founders aprovados)
4. Coleção 'referrals' (estrutura vazia)

REQUISITOS:
- Firebase Admin SDK instalado: pip install firebase-admin==7.1.0
- Arquivo de credenciais: /opt/flutter/firebase-admin-sdk.json

USO:
    python3 firebase_init.py

AUTOR: Loomper Team
DATA: 29/01/2026
VERSÃO: 1.0
"""

import sys
from datetime import datetime, timedelta

# Verificar Firebase Admin SDK
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    print("✅ firebase-admin importado com sucesso")
except ImportError as e:
    print(f"❌ Erro: firebase-admin não encontrado!")
    print(f"📦 Instale com: pip install firebase-admin==7.1.0")
    sys.exit(1)

# ============================================
# CONFIGURAÇÃO
# ============================================

CREDENTIALS_PATH = "/opt/flutter/firebase-admin-sdk.json"

# ============================================
# INICIALIZAÇÃO FIREBASE
# ============================================

def init_firebase():
    """Inicializa conexão com Firebase"""
    try:
        # Verificar se já foi inicializado
        firebase_admin.get_app()
        print("✅ Firebase já inicializado")
    except ValueError:
        # Inicializar pela primeira vez
        print(f"🔥 Inicializando Firebase...")
        cred = credentials.Certificate(CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase inicializado com sucesso!")
    
    return firestore.client()

# ============================================
# 1️⃣ COLEÇÃO CAMPAIGNS
# ============================================

def create_campaigns_collection(db):
    """Cria coleção campaigns com documento pioneer_launch"""
    print("\n" + "="*50)
    print("1️⃣ CRIANDO COLEÇÃO 'campaigns'")
    print("="*50)
    
    campaign_ref = db.collection('campaigns').document('pioneer_launch')
    
    campaign_data = {
        'name': 'Campanha Pioneiros - Founder 500',
        'description': 'Campanha exclusiva para os primeiros 7.000 usuários do Loomper',
        'status': 'active',
        'startDate': firestore.SERVER_TIMESTAMP,
        'endDate': None,
        'stats': {
            'totalSignups': 13,  # 13 cadastros iniciais (exemplo)
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'lastSignupAt': firestore.SERVER_TIMESTAMP,
        },
        'tiers': {
            'founder': {
                'name': 'Founder',
                'maxSlots': 500,
                'currentSlots': 13,
                'benefits': {
                    'creditsPerMonth': 1500,
                    'discountPercent': 20,
                    'mlmLimitMonthly': -1,  # -1 = ilimitado
                    'badge': 'Founder',
                    'vipGroup': True,
                    'earlyAccess': True,
                    'referralBonus': 200,  # vs 100 normal
                },
                'status': 'active',
                'description': 'Os primeiros 500 fundadores do Loomper',
            },
            'pioneer': {
                'name': 'Pioneer',
                'maxSlots': 1500,
                'currentSlots': 0,
                'benefits': {
                    'creditsPerMonth': 1000,
                    'discountPercent': 15,
                    'mlmLimitMonthly': 50000,
                    'badge': 'Pioneer',
                    'vipGroup': False,
                    'earlyAccess': True,
                    'referralBonus': 100,
                },
                'status': 'active',
                'description': 'Os primeiros 1.500 pioneiros',
            },
            'early': {
                'name': 'Early Adopter',
                'maxSlots': 5000,
                'currentSlots': 0,
                'benefits': {
                    'creditsPerMonth': 500,
                    'discountPercent': 10,
                    'mlmLimitMonthly': 20000,
                    'badge': 'Early Adopter',
                    'vipGroup': False,
                    'earlyAccess': False,
                    'referralBonus': 100,
                },
                'status': 'active',
                'description': 'Os primeiros 5.000 early adopters',
            },
        },
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
    }
    
    campaign_ref.set(campaign_data)
    print("✅ Documento 'pioneer_launch' criado!")
    print(f"   - Total cadastros: 13")
    print(f"   - Founders: 13/500")
    print(f"   - Pioneers: 0/1500")
    print(f"   - Early Adopters: 0/5000")
    
    return campaign_ref

# ============================================
# 2️⃣ COLEÇÃO LEADS
# ============================================

def create_leads_collection(db):
    """Cria coleção leads com exemplos"""
    print("\n" + "="*50)
    print("2️⃣ CRIANDO COLEÇÃO 'leads'")
    print("="*50)
    
    leads_ref = db.collection('leads')
    
    # Exemplos de leads
    leads_data = [
        {
            'user_id': 'LMP-000001',
            'nome': 'João Silva',
            'whatsapp': '11987654321',
            'email': 'joao.silva@email.com',
            'uf': 'SP',
            'cidade': 'São Paulo',
            'perfil': 'motorista',
            'indicado_por': None,
            'data_aceite': datetime.now(),
            'status': 'pending',  # pending, contacted, converted, rejected
            'source': 'landing_page',
            'tier': 'founder',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'user_id': 'LMP-000002',
            'nome': 'Maria Santos',
            'whatsapp': '11976543210',
            'email': 'maria.santos@email.com',
            'uf': 'RJ',
            'cidade': 'Rio de Janeiro',
            'perfil': 'ajudante',
            'indicado_por': 'LMP-000001',
            'data_aceite': datetime.now(),
            'status': 'contacted',
            'source': 'landing_page',
            'tier': 'founder',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'user_id': 'LMP-000003',
            'nome': 'Carlos Oliveira',
            'whatsapp': '11965432109',
            'email': 'carlos.oliveira@email.com',
            'uf': 'MG',
            'cidade': 'Belo Horizonte',
            'perfil': 'transportadora',
            'indicado_por': 'LMP-000001',
            'data_aceite': datetime.now(),
            'status': 'converted',
            'source': 'landing_page',
            'tier': 'founder',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'user_id': 'LMP-000004',
            'nome': 'Ana Costa',
            'whatsapp': '11954321098',
            'email': 'ana.costa@email.com',
            'uf': 'SP',
            'cidade': 'Campinas',
            'perfil': 'motorista',
            'indicado_por': 'LMP-000002',
            'data_aceite': datetime.now(),
            'status': 'pending',
            'source': 'landing_page',
            'tier': 'founder',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'user_id': 'LMP-000005',
            'nome': 'Pedro Almeida',
            'whatsapp': '11943210987',
            'email': 'pedro.almeida@email.com',
            'uf': 'PR',
            'cidade': 'Curitiba',
            'perfil': 'ajudante',
            'indicado_por': None,
            'data_aceite': datetime.now(),
            'status': 'pending',
            'source': 'landing_page',
            'tier': 'founder',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
    ]
    
    # Criar leads
    for lead in leads_data:
        doc_ref = leads_ref.add(lead)
        print(f"✅ Lead criado: {lead['nome']} ({lead['user_id']}) - {lead['perfil']}")
    
    print(f"\n✅ Total de leads criados: {len(leads_data)}")
    
    return leads_ref

# ============================================
# 3️⃣ COLEÇÃO USERS (Founders Aprovados)
# ============================================

def create_users_collection(db):
    """Cria coleção users com exemplos de Founders aprovados"""
    print("\n" + "="*50)
    print("3️⃣ CRIANDO COLEÇÃO 'users'")
    print("="*50)
    
    users_ref = db.collection('users')
    
    # Exemplos de usuários aprovados
    users_data = [
        {
            'uid': 'founder001',
            'profile': {
                'nome': 'João Silva',
                'cpf': '123.456.789-00',
                'email': 'joao.silva@email.com',
                'telefone': '11987654321',
                'perfil': 'motorista',
                'uf': 'SP',
                'cidade': 'São Paulo',
            },
            'tier': 'founder',
            'referral': {
                'myCode': 'LMP-000001',
                'referredBy': None,
                'totalReferrals': 2,  # Maria e Carlos
                'referralEarnings': 0,
            },
            'credits': {
                'paid': 0,
                'promotional': 0,
                'campaign': 1500,  # Créditos mensais Founder
                'total': 1500,
                'lastRenewal': firestore.SERVER_TIMESTAMP,
            },
            'status': 'active',
            'emailVerified': True,
            'phoneVerified': True,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'uid': 'founder002',
            'profile': {
                'nome': 'Maria Santos',
                'cpf': '987.654.321-00',
                'email': 'maria.santos@email.com',
                'telefone': '11976543210',
                'perfil': 'ajudante',
                'uf': 'RJ',
                'cidade': 'Rio de Janeiro',
            },
            'tier': 'founder',
            'referral': {
                'myCode': 'LMP-000002',
                'referredBy': 'LMP-000001',
                'totalReferrals': 1,  # Ana
                'referralEarnings': 0,
            },
            'credits': {
                'paid': 0,
                'promotional': 50,  # Bônus de indicação
                'campaign': 1500,
                'total': 1550,
                'lastRenewal': firestore.SERVER_TIMESTAMP,
            },
            'status': 'active',
            'emailVerified': True,
            'phoneVerified': True,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'uid': 'founder003',
            'profile': {
                'nome': 'Carlos Oliveira',
                'cpf': '456.789.123-00',
                'email': 'carlos.oliveira@email.com',
                'telefone': '11965432109',
                'perfil': 'transportadora',
                'uf': 'MG',
                'cidade': 'Belo Horizonte',
            },
            'tier': 'founder',
            'referral': {
                'myCode': 'LMP-000003',
                'referredBy': 'LMP-000001',
                'totalReferrals': 0,
                'referralEarnings': 0,
            },
            'credits': {
                'paid': 0,
                'promotional': 50,  # Bônus de indicação
                'campaign': 1500,
                'total': 1550,
                'lastRenewal': firestore.SERVER_TIMESTAMP,
            },
            'status': 'active',
            'emailVerified': True,
            'phoneVerified': True,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        },
    ]
    
    # Criar usuários
    for user in users_data:
        uid = user['uid']
        user_doc_ref = users_ref.document(uid)
        user_doc_ref.set(user)
        print(f"✅ Usuário criado: {user['profile']['nome']} ({user['referral']['myCode']}) - {user['tier'].upper()}")
    
    print(f"\n✅ Total de usuários criados: {len(users_data)}")
    
    return users_ref

# ============================================
# 4️⃣ COLEÇÃO REFERRALS
# ============================================

def create_referrals_collection(db):
    """Cria coleção referrals com exemplos"""
    print("\n" + "="*50)
    print("4️⃣ CRIANDO COLEÇÃO 'referrals'")
    print("="*50)
    
    referrals_ref = db.collection('referrals')
    
    # Exemplos de referências (indicações)
    referrals_data = [
        {
            'referrerId': 'founder001',  # João indicou Maria
            'referredUserId': 'founder002',
            'referredLeadId': 'LMP-000002',
            'status': 'confirmed',  # pending, confirmed, rejected
            'bonusGranted': 200,  # Founder recebe 200 (vs 100 normal)
            'createdAt': firestore.SERVER_TIMESTAMP,
            'confirmedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'referrerId': 'founder001',  # João indicou Carlos
            'referredUserId': 'founder003',
            'referredLeadId': 'LMP-000003',
            'status': 'confirmed',
            'bonusGranted': 200,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'confirmedAt': firestore.SERVER_TIMESTAMP,
        },
        {
            'referrerId': 'founder002',  # Maria indicou Ana (ainda pendente)
            'referredUserId': None,
            'referredLeadId': 'LMP-000004',
            'status': 'pending',
            'bonusGranted': 0,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'confirmedAt': None,
        },
    ]
    
    # Criar referências
    for referral in referrals_data:
        doc_ref = referrals_ref.add(referral)
        print(f"✅ Referência criada: {referral['referredLeadId']} - Status: {referral['status']}")
    
    print(f"\n✅ Total de referências criadas: {len(referrals_data)}")
    
    return referrals_ref

# ============================================
# MAIN
# ============================================

def main():
    """Função principal"""
    print("\n" + "="*60)
    print("🔥 LOOMPER - FIREBASE INITIALIZATION SCRIPT")
    print("="*60)
    
    # Inicializar Firebase
    db = init_firebase()
    
    # Criar coleções
    create_campaigns_collection(db)
    create_leads_collection(db)
    create_users_collection(db)
    create_referrals_collection(db)
    
    # Resumo final
    print("\n" + "="*60)
    print("✅ INICIALIZAÇÃO COMPLETA!")
    print("="*60)
    print("\n📊 RESUMO:")
    print("   ✅ Coleção 'campaigns' criada (1 documento)")
    print("   ✅ Coleção 'leads' criada (5 exemplos)")
    print("   ✅ Coleção 'users' criada (3 Founders)")
    print("   ✅ Coleção 'referrals' criada (3 exemplos)")
    print("\n🔗 PRÓXIMOS PASSOS:")
    print("   1. Configure Firestore Rules (firestore_rules.txt)")
    print("   2. Teste contador Founder 500 na landing page")
    print("   3. Teste cadastro de leads via landing page")
    print("\n🎉 Firebase pronto para produção!")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
