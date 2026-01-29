/* ==========================================================================
   LOOMPER LOGIC - VERSÃO FINAL (MOTOR COMPLETO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicia API do IBGE
    carregarEstados();
    
    // 2. Verifica se veio por Indicação (MGM)
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('convite');
    
    if (ref) {
        const inputIndicacao = document.getElementById('input-indicado-por');
        if (inputIndicacao) {
            inputIndicacao.value = ref;
            console.log("Indicação detectada:", ref);
        }
    }
});

// --- API IBGE (CIDADES E ESTADOS) ---
function carregarEstados() {
    const selectUF = document.getElementById('uf-select');
    if(!selectUF) return;

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => response.json())
        .then(estados => {
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.sigla;
                selectUF.appendChild(option);
            });
        })
        .catch(err => console.error("Erro IBGE:", err));
}

function buscarCidades() {
    const uf = document.getElementById('uf-select').value;
    const selectCidade = document.getElementById('cidade-select');
    
    if(!selectCidade) return;

    selectCidade.innerHTML = '<option value="">Carregando...</option>';
    selectCidade.disabled = true;

    if (uf) {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => response.json())
            .then(cidades => {
                selectCidade.innerHTML = '<option value="">Selecione a Cidade</option>';
                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome;
                    option.textContent = cidade.nome;
                    selectCidade.appendChild(option);
                });
                selectCidade.disabled = false;
            });
    } else {
        selectCidade.innerHTML = '<option value="">Aguardando UF...</option>';
    }
}

// --- CONTEÚDO DOS MODAIS DE RODAPÉ (MENU) ---
const footerContent = {
    'sobre': `
        <h3>Sobre o Loomper</h3>
        <p>Somos o primeiro ecossistema dedicado a resolver a "última milha" da logística de cegonhas. Não substituímos pessoas; organizamos as relações entre motoristas, chapas e transportadoras para gerar valor, segurança e dignidade.</p>
    `,
    
    'praque': `
        <h3>Para que Serve</h3>
        <ul style="list-style:none; padding:0;">
            <li style="margin-bottom:10px;">🚚 <strong>Para o Motorista:</strong> Encontrar apoio local confiável e qualificado.</li>
            <li style="margin-bottom:10px;">🤝 <strong>Para o Chapa:</strong> Ter serviço constante, previsível e pagamento justo.</li>
            <li style="margin-bottom:10px;">🏢 <strong>Para a Transportadora:</strong> Reduzir riscos de avaria, custos jurídicos e atrasos.</li>
        </ul>
    `,
    
    'duvidas': `
        <h3>Dúvidas Frequentes</h3>
        
        <div style="margin-bottom: 20px;">
            <p style="font-weight: 700; color: var(--flag-red); margin-bottom: 8px;">❓ O que é o Loomper?</p>
            <p style="margin-left: 20px; color: var(--ink-black-light);">
                O Loomper é o primeiro ecossistema digital que conecta motoristas cegonheiros, chapas (ajudantes) e transportadoras. 
                Nossa plataforma organiza a "última milha" da logística de veículos, oferecendo segurança, rastreabilidade e dignidade para todos os envolvidos.
            </p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p style="font-weight: 700; color: var(--flag-red); margin-bottom: 8px;">💰 Quanto custa para usar?</p>
            <p style="margin-left: 20px; color: var(--ink-black-light);">
                Durante a fase Beta (até Junho/2026), o uso é <strong>100% GRATUITO</strong> para motoristas e chapas pioneiros. 
                Transportadoras têm condições especiais. Após o lançamento oficial, manteremos planos acessíveis que cabem no bolso de quem trabalha na estrada.
            </p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p style="font-weight: 700; color: var(--flag-red); margin-bottom: 8px;">🛡️ É seguro? Como funciona a validação?</p>
            <p style="margin-left: 20px; color: var(--ink-black-light);">
                <strong>Sim, 100% seguro!</strong> Todos os cadastros são validados por nossa equipe. 
                Monitoramos a reputação de cada usuário através de avaliações mútuas após cada operação. 
                Chapas com histórico comprovado ganham selos de confiança. Motoristas e transportadoras avaliam os ajudantes, criando um círculo de responsabilidade.
            </p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p style="font-weight: 700; color: var(--flag-red); margin-bottom: 8px;">📅 Quando o App será lançado oficialmente?</p>
            <p style="margin-left: 20px; color: var(--ink-black-light);">
                <strong>Junho/2026</strong> nas lojas Google Play e Apple App Store. 
                Agora estamos na <strong>fase de Pioneiros</strong>, testando e aperfeiçoando com profissionais reais da estrada. 
                Quem entrar agora terá vantagens exclusivas no lançamento oficial!
            </p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p style="font-weight: 700; color: var(--flag-red); margin-bottom: 8px;">🎁 O que os Pioneiros ganham?</p>
            <p style="margin-left: 20px; color: var(--ink-black-light);">
                • Acesso vitalício gratuito às funcionalidades básicas<br>
                • Selo de "Pioneiro" no perfil (destaque na plataforma)<br>
                • Créditos grátis para testar serviços premium<br>
                • Participação na construção do produto (seu feedback molda o app)<br>
                • Prioridade em novos recursos e funcionalidades
            </p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p style="font-weight: 700; color: var(--flag-red); margin-bottom: 8px;">📱 Já posso usar o App?</p>
            <p style="margin-left: 20px; color: var(--ink-black-light);">
                Sim! A <strong>versão Web Beta</strong> já está disponível em <a href="https://app.loomper.com.br" target="_blank" style="color: var(--oxford-navy); text-decoration: underline;">app.loomper.com.br</a>. 
                Clique em "Testar Versão Web" no topo da página para começar agora mesmo!
            </p>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 0.9rem; color: var(--ink-black-lighter);">
            Ainda tem dúvidas? Fale conosco pelo WhatsApp: <strong>(11) 96585-8142</strong>
        </p>
    `,
    
    'legal': `
        <h3>Informações Legais</h3>
        <p><strong>LOOMPER®</strong><br>Uma empresa do Grupo Ajud.ai Brasil Inova Simples (I.S.)</p>
        <p>CNPJ: 59.150.688/0001-39</p>
        <p style="margin-top:20px;">
            <a href="termos.html" target="_blank" style="color:#d4af37; text-decoration:underline;">Termos de Uso</a> | 
            <a href="privacidade.html" target="_blank" style="color:#d4af37; text-decoration:underline;">Política de Privacidade</a>
        </p>
    `,
    
    'stakeholders': `
        <h3>Investidores & Parceiros</h3>
        <p>Selecione seu perfil para contato direto com a diretoria:</p>
        <div class="investor-grid">
            <a href="mailto:contato@loomper.com.br?subject=Sou Anjo/Investidor - Gostaria de infos" class="investor-btn">👼 Anjo / Investidor</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Governo - Gostaria de infos" class="investor-btn">🏛️ Governo</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Montadora - Gostaria de infos" class="investor-btn">🏭 Montadora</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Transportadora - Gostaria de infos" class="investor-btn">🚚 Transportadora</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Seguradora - Gostaria de infos" class="investor-btn">🛡️ Seguradora</a>
        </div>
    `,
    
    'fale': `
        <h3>Fale Conosco</h3>
        <p>Estamos prontos para te ouvir.</p>
        <p><strong>WhatsApp:</strong> (11) 96585-8142</p>
        <p><strong>E-mail:</strong> contato@loomper.com.br</p>
        <p style="font-size:0.8rem; color:#888; margin-top:10px;">Atendimento de Seg a Sex, das 9h às 18h.</p>
    `,
    
    'apoie': `
        <h3><i class="fas fa-heart" style="color:#ff6b35"></i> Apoie o Projeto</h3>
        <p>O Loomper é uma iniciativa independente. Sua contribuição ajuda a manter a tecnologia gratuita para quem precisa.</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
            <button class="donate-btn" onclick="copyPix()">Apoiar R$ 20</button>
            <button class="donate-btn" onclick="copyPix()">Apoiar R$ 50</button>
            <button class="donate-btn outline" onclick="copyPix()">Outro Valor</button>
        </div>
        <p id="pix-msg-modal" style="color:#25d366; display:none; margin-top:15px; font-weight:bold; text-align:center;">
            <i class="fas fa-check"></i> Chave PIX copiada: contato@loomper.com.br
        </p>
    `
};

// Função que abre os modais do rodapé
function openFooterModal(key) {
    const content = footerContent[key];
    const contentDiv = document.getElementById('footer-modal-content');
    const modal = document.getElementById('modal-footer');
    
    if(contentDiv && modal && content) {
        contentDiv.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Trava scroll
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO E UX ---

function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function openTimelineModal() {
    const modal = document.getElementById('modal-timeline');
    if(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Destrava scroll
    }
}

// Fecha ao clicar fora
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function copyPix() {
    navigator.clipboard.writeText("contato@loomper.com.br").then(() => {
        // Tenta achar feedback no rodapé ou no modal
        const feedbackFooter = document.getElementById('pix-feedback');
        const feedbackModal = document.getElementById('pix-msg-modal');
        
        if (feedbackFooter && feedbackFooter.offsetParent !== null) {
            feedbackFooter.style.display = 'block';
            setTimeout(() => { feedbackFooter.style.display = 'none'; }, 3000);
        } else if (feedbackModal) {
            feedbackModal.style.display = 'block';
            setTimeout(() => { feedbackModal.style.display = 'none'; }, 3000);
        } else {
            alert("Chave PIX copiada: contato@loomper.com.br");
        }
    });
}

// --- FLUXO DE CADASTRO (CARDS PRINCIPAIS) ---

const modalData = {
    'motorista': {
        title: 'Motorista Cegonheiro',
        btnText: 'Quero operar com segurança',
        intro: 'Se você vive a estrada, sabe:',
        bullets: ['Já perdeu tempo procurando chapa confiável?', 'Improviso na descarga gera risco de avaria?', 'Quer previsibilidade na rota?'],
        turn: 'A logística não precisa ser no grito.'
    },
    'ajudante': {
        title: 'Ajudante / Chapa',
        btnText: 'Quero mais oportunidades',
        intro: 'Na descarga, a realidade é dura:',
        bullets: ['O trabalho aparece só de vez em quando?', 'Falta reconhecimento profissional?', 'Quer sair da informalidade total?'],
        turn: 'Quem trabalha bem merece constância.'
    },
    'transportadora': {
        title: 'Transportadora',
        btnText: 'Quero controle total',
        intro: 'Pequenos ruídos viram grandes prejuízos:',
        bullets: ['Atrasos na ponta final?', 'Risco jurídico e operacional?', 'Falta de padronização nos processos?'],
        turn: 'Organização é lucro e proteção.'
    }
};

function openFlow(profileKey) {
    const data = modalData[profileKey];
    if(!data) return;

    // Popula textos
    document.getElementById('modal-title-pain').innerText = data.title;
    document.getElementById('modal-intro-text').innerText = data.intro;
    document.getElementById('modal-bullets-pain').innerHTML = data.bullets.map(t => `<li>${t}</li>`).join('');
    document.getElementById('modal-turn-text').innerText = data.turn;
    document.getElementById('btn-to-step-2').innerText = data.btnText;
    
    // Define input oculto
    document.getElementById('input-perfil').value = profileKey;

    // Reseta telas
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    
    // Abre
    document.getElementById('modal-flow').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function goToStep2() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

// --- SUBM ISSÃO DO FORMULÁRIO ---

function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    // Pega dados para validação
    const phoneInput = document.getElementById('phone-input').value;
    const userId = phoneInput.replace(/\D/g, ''); // Apenas números = ID ÚNICO
    const perfil = document.getElementById('input-perfil').value;
    const emailInput = document.getElementById('email-input').value;
    
    // Validação
    if (userId.length < 10) {
        alert('Por favor, digite um WhatsApp válido.');
        return false;
    }

    // CHECK DE DUPLICIDADE (Local)
    const savedUser = localStorage.getItem('loomper_user_id');
    const savedProfile = localStorage.getItem('loomper_user_profile');

    if (savedUser === userId && savedProfile === perfil) {
        // Já cadastrado, redireciona direto para o app
        window.location.href = `https://app.loomper.com.br`;
        return false;
    }

    // Prepara envio
    btn.innerText = 'Processando...';
    btn.disabled = true;
    
    // Timestamp do aceite
    const dataAceiteInput = document.getElementById('input-data-aceite');
    if(dataAceiteInput) dataAceiteInput.value = new Date().toLocaleString('pt-BR');
    
    // Define o ID único no campo hidden
    const userIdInput = document.getElementById('input-user-id');
    if(userIdInput) userIdInput.value = userId;

    const formData = new FormData(form);

    // Envio Netlify + Make.com Webhook
    Promise.all([
        // 1. Netlify Forms
        fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        }),
        
        // 2. Make.com Webhook (correto)
        fetch('https://hook.us2.make.com/hcapulq1ylyfosn3fqpg5m3w9vw3aeaj', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: formData.get('nome'),
                whatsapp: phoneInput,
                email: emailInput,
                uf: formData.get('uf'),
                cidade: formData.get('cidade'),
                perfil: perfil,
                user_id: userId,
                indicado_por: formData.get('indicado_por') || '',
                data_aceite: new Date().toISOString()
            })
        }),
    // 3. Firebase Firestore (NOVO)
        window.LoomperFirebase.registerLead({
            nome: formData.get('nome'),
            whatsapp: phoneInput,
            email: emailInput,
            uf: formData.get('uf'),
            cidade: formData.get('cidade'),
            perfil: perfil,
            user_id: userId,
            indicado_por: formData.get('indicado_por') || null,
        })
    ])
    .then(() => {
        // Salva localmente
        localStorage.setItem('loomper_user_id', userId);
        localStorage.setItem('loomper_user_profile', perfil);
        
        // Redireciona para o app web (NOVO - Corrigido)
        window.location.href = `https://app.loomper.com.br`;
    })
    .catch((err) => {
        console.error(err);
        alert('Erro de conexão. Tente novamente.');
        btn.innerText = originalText;
        btn.disabled = false;
    });
    
    return false;
}

function showSuccessScreen(userId) {
    const siteUrl = window.location.origin;
    const inviteLink = `${siteUrl}/?ref=${userId}`;
    
    document.getElementById('my-referral-link').value = inviteLink;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'block';
}

function shareOnWhatsapp() {
    const link = document.getElementById('my-referral-link').value;
    const msg = `Fala parceiro!
Tô participando da construção do Loomper - um app criado pra organizar a logística e valorizar quem faz o transporte acontecer.

Estamos formando um grupo seleto de pioneiros pra testar a versão beta e ajudar a moldar o app do nosso jeito.

Se fizer sentido pra você, entra aqui 👇
${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// MÁSCARA TELEFONE
const phoneInp = document.getElementById('phone-input');
if (phoneInp) {
    phoneInp.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

// ===============================================
// RASTREAMENTO DE DOWNLOADS DO APK BETA
// ===============================================

// Detectar clique no botão de download do APK
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.querySelector('.download-apk-float');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // Registrar download no Firebase ou localStorage
            const downloadData = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                page: window.location.href
            };
            
            // Salvar no localStorage para rastreamento local
            const downloads = JSON.parse(localStorage.getItem('loomper_apk_downloads') || '[]');
            downloads.push(downloadData);
            localStorage.setItem('loomper_apk_downloads', JSON.stringify(downloads));
            
            // Enviar para analytics (se configurado)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'apk_download', {
                    'event_category': 'engagement',
                    'event_label': 'Beta APK v1.18.0',
                    'value': 1
                });
            }
            
            // Mostrar modal de convite para WhatsApp Beta
            setTimeout(function() {
                showWhatsAppBetaInvite();
            }, 2000); // 2 segundos após o download
        });
    }
});

// Mostrar convite automático para grupo WhatsApp Beta
function showWhatsAppBetaInvite() {
    const whatsappGroupUrl = 'https://chat.whatsapp.com/GuZYBWoSJqVHGWuUCS04Sr';
    
    // Verificar se já mostrou antes
    const alreadyInvited = localStorage.getItem('loomper_whatsapp_invite_shown');
    
    if (!alreadyInvited) {
        // Criar modal personalizado
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(218, 165, 32, 0.3);
                border: 2px solid #DAA520;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #DAA520; font-size: 28px; margin-bottom: 15px; font-weight: 900;">
                    Download Iniciado!
                </h2>
                <p style="color: #fff; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                    Você acabou de baixar o <strong>Loomper Beta APK v1.18.0</strong>!<br><br>
                    Quer fazer parte do <strong>grupo exclusivo de testadores Beta</strong> e ajudar a construir o futuro da logística?
                </p>
                <a href="${whatsappGroupUrl}" target="_blank" style="
                    display: inline-block;
                    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                    color: #fff;
                    padding: 15px 40px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 18px;
                    margin: 10px;
                    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fab fa-whatsapp" style="margin-right: 10px;"></i>
                    Entrar no Grupo Beta
                </a>
                <button onclick="this.parentElement.parentElement.remove(); localStorage.setItem('loomper_whatsapp_invite_shown', 'true');" style="
                    display: inline-block;
                    background: transparent;
                    color: #999;
                    padding: 15px 40px;
                    border: 2px solid #444;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.borderColor='#DAA520'; this.style.color='#DAA520'" onmouseout="this.style.borderColor='#444'; this.style.color='#999'">
                    Agora não
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Marcar como mostrado
        localStorage.setItem('loomper_whatsapp_invite_shown', 'true');
    }
}

// CSS para animação do modal
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
