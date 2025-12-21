// ============================================
// CellShop - Main JavaScript
// All interactive functionality
// ============================================

// Development: força endpoints locais quando aberto via file://
;(function(){
    try{
        // If running on a different origin (like Live Server :5500), point to local API on port 3001
        const apiHost = 'http://localhost:3001';
        const isFile = (window.location && window.location.protocol === 'file:');
        const isSameOriginAPI = window.location && (window.location.host === 'localhost:3001' || window.location.host === '127.0.0.1:3001' || window.location.host === 'localhost:3001');
        if (!window.CREATE_ORDER_ENDPOINT) {
            window.CREATE_ORDER_ENDPOINT = isFile || !isSameOriginAPI ? `${apiHost}/api/createOrder` : '/api/createOrder';
        }
        if (!window.ORDER_NOTIFY_ENDPOINT) {
            window.ORDER_NOTIFY_ENDPOINT = isFile || !isSameOriginAPI ? `${apiHost}/api/order-complete` : '/api/order-complete';
        }
        if (!window.SMS_NOTIFY_ENDPOINT) {
            window.SMS_NOTIFY_ENDPOINT = isFile || !isSameOriginAPI ? `${apiHost}/api/notify-sms` : '';
        }
    }catch(e){ /* ignore */ }
})();

// Offline / pending orders helper: tenta reenviar pedidos salvos localmente quando a conexão retorna
async function attemptToSendOrder(order) {
    try {
        // Firestore removed — use backend endpoint only

        // fallback to backend endpoint
        const endpoint = window.CREATE_ORDER_ENDPOINT || (window.location.protocol === 'file:' ? 'http://localhost:3001/api/createOrder' : '/api/createOrder');
        try {
            const resp = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) });
            if (resp && resp.ok) return true;
        } catch (e) { /* network error */ }
    } catch (e) {
        // ignore and return false
    }
    return false;
}

async function resendPendingOrders() {
    try {
        const key = 'PENDING_ORDERS';
        let list = JSON.parse(localStorage.getItem(key) || '[]');
        if (!Array.isArray(list) || !list.length) return;
        const remaining = [];
        for (const o of list) {
            try {
                const ok = await attemptToSendOrder(o);
                if (!ok) remaining.push(o);
            } catch(e) { remaining.push(o); }
        }
        if (remaining.length !== list.length) {
            localStorage.setItem(key, JSON.stringify(remaining.slice(0,200)));
            console.info('[checkout] resent pending orders, remaining=', remaining.length);
        }
    } catch(e){ console.warn('[checkout] resendPendingOrders failed', e); }
}

// Tenta reenviar quando reconectar
window.addEventListener('online', () => { try { resendPendingOrders(); } catch(e){} });
// E tenta ao carregar a página
try { resendPendingOrders(); } catch(e){}

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    
    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance slides
let slideInterval;
function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// Initialize slider
document.addEventListener('DOMContentLoaded', () => {
    // Create slider dots
    const dotsContainer = document.getElementById('sliderDots');
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
                stopSlideshow();
                startSlideshow();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // Slider controls
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    // Start slideshow
    startSlideshow();
    
    // Pause slideshow on hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopSlideshow);
        hero.addEventListener('mouseleave', startSlideshow);
    }
});

// Register Modal
function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Wholesale Modal
function showWholesaleModal() {
    const modal = document.getElementById('wholesaleModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeWholesaleModal() {
    const modal = document.getElementById('wholesaleModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Register Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);
            
            // Check if CNPJ (14 digits) or CPF (11 digits)
            const docNumber = data.document.replace(/\D/g, '');
            const isCNPJ = docNumber.length === 14;
            
            // Save user data
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const newUser = {
                id: Date.now(),
                ...data,
                isCNPJ: isCNPJ,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Show success message
            showNotification(
                isCNPJ 
                    ? 'Cadastro realizado! Acesso ao atacado liberado.' 
                    : 'Cadastro realizado com sucesso!',
                'success'
            );
            
            closeRegisterModal();
            registerForm.reset();
            
            // Update UI
            updateUserUI();
        });
    }
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // User button
    const userBtn = document.getElementById('userBtn');
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                showUserMenu();
            } else {
                showRegisterModal();
            }
        });
    }
    
    // Check for logged in user
    updateUserUI();
});

// Update user UI
function updateUserUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userBtn = document.getElementById('userBtn');
    
    if (currentUser && userBtn) {
        userBtn.innerHTML = `<i class="fas fa-user-check"></i>`;
        userBtn.title = currentUser.name;
    }
}

// User menu
function showUserMenu() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <i class="fas fa-user-circle"></i>
            <div>
                <div class="user-menu-name">${currentUser.name}</div>
                <div class="user-menu-email">${currentUser.email}</div>
            </div>
        </div>
        <div class="user-menu-items">
            <a href="#" onclick="showMyOrders()"><i class="fas fa-box"></i> Meus Pedidos</a>
            ${currentUser.isCNPJ ? '<a href="#wholesale" onclick="closeUserMenu(); document.getElementById(\'wholesale\').scrollIntoView({behavior: \'smooth\'})"><i class="fas fa-warehouse"></i> Área de Atacado</a>' : ''}
            <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Sair</a>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.getElementById('user-menu-styles')) {
        const styles = document.createElement('style');
        styles.id = 'user-menu-styles';
        styles.textContent = `
            .user-menu {
                position: fixed;
                top: 70px;
                right: 20px;
                background: white;
                border-radius: 0.75rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                min-width: 280px;
                z-index: 10001;
                animation: fadeIn 0.2s ease;
            }
            
            .user-menu-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .user-menu-header i {
                font-size: 2.5rem;
                color: var(--primary);
            }
            
            .user-menu-name {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .user-menu-email {
                font-size: 0.875rem;
                color: var(--gray-500);
            }
            
            .user-menu-items a {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
                color: var(--gray-700);
                transition: all 0.2s;
            }
            
            .user-menu-items a:hover {
                background: var(--gray-50);
                color: var(--primary);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Remove existing menu
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) existingMenu.remove();
    
    document.body.appendChild(menu);
    
    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('#userBtn')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function closeUserMenu() {
    const menu = document.querySelector('.user-menu');
    if (menu) menu.remove();
}

function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logout realizado com sucesso!', 'success');
    closeUserMenu();
    updateUserUI();
    location.reload();
}

// Chat System
let chatOpen = false;
let chatMessages = [];
let userName = '';

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatFab = document.querySelector('.chat-fab');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatWidget.classList.add('active');
        chatFab.style.display = 'none';
    } else {
        chatWidget.classList.remove('active');
        chatFab.style.display = 'flex';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Save user name if first message
    if (!userName) {
        userName = message;
        setTimeout(() => {
            addChatMessage(
                `Olá ${userName}! Como posso ajudar você hoje? Use os botões abaixo para navegar ou continue digitando.`,
                'bot'
            );
        }, 500);
    } else {
        // Simple bot response
        setTimeout(() => {
            respondToMessage(message);
        }, 500);
    }
}

function addChatMessage(text, type = 'bot') {
    const chatBody = document.getElementById('chatBody');
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    
    const avatar = type === 'bot' 
        ? '<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lara" alt="Lara">'
        : '<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName + '" alt="User">';
    
    message.innerHTML = `
        ${avatar}
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    chatMessages.push({ text, type, timestamp: new Date() });
}

function respondToMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    let response = '';
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('price') || lowerMessage.includes('quanto')) {
        response = 'Todos os nossos preços estão listados na página de produtos. Use os filtros para encontrar o que procura!';
    } else if (lowerMessage.includes('frete') || lowerMessage.includes('entrega') || lowerMessage.includes('shipping')) {
        response = 'Enviamos para todo o mundo! Brasil → Brasil: 15 dias, EUA → EUA: 15 dias, EUA → Brasil: 26 dias. O frete é calculado no checkout.';
    } else if (lowerMessage.includes('pagamento') || lowerMessage.includes('payment') || lowerMessage.includes('pix')) {
        response = 'Aceitamos cartão de crédito/débito, PIX e parcelamento. Pagamento 100% seguro via Stripe.';
    } else if (lowerMessage.includes('atacado') || lowerMessage.includes('wholesale') || lowerMessage.includes('cnpj')) {
        response = 'Nossa área de atacado oferece 15-20% de desconto para pedidos de 10 a 100 unidades. Exclusivo para CNPJ cadastrado!';
    } else {
        response = 'Obrigado pela sua mensagem! Um de nossos agentes retornará em até 1 hora. Enquanto isso, use os botões abaixo para acessar opções rápidas.';
        
        // Save to admin messages
        saveMessageToAdmin({
            from: userName || 'Visitante',
            message: message,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
    }
    
    addChatMessage(response, 'bot');
}

function chatAction(action) {
    switch(action) {
        case 'reembolso':
            addChatMessage('Solicitação de reembolso', 'user');
            setTimeout(() => {
                addChatMessage(
                    'Por favor, descreva o motivo do reembolso e informe o número do pedido. Retornaremos em até 1 hora.',
                    'bot'
                );
                saveMessageToAdmin({
                    from: userName || 'Visitante',
                    type: 'Reembolso',
                    message: 'Solicitação de reembolso iniciada',
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                });
            }, 500);
            break;
            
        case 'produtos':
            addChatMessage('Tenho dúvidas sobre produtos', 'user');
            setTimeout(() => {
                addChatMessage(
                    'Qual produto você gostaria de saber mais? Digite o nome ou categoria e te ajudarei!',
                    'bot'
                );
            }, 500);
            break;
            
        case 'agente':
            addChatMessage('Gostaria de falar com um agente', 'user');
            setTimeout(() => {
                addChatMessage(
                    'Conectando você com um agente... Retornaremos em até 1 hora. Deixe sua pergunta:',
                    'bot'
                );
                saveMessageToAdmin({
                    from: userName || 'Visitante',
                    type: 'Atendimento',
                    message: 'Solicitou falar com agente',
                    timestamp: new Date().toISOString(),
                    status: 'pending',
                    priority: 'high'
                });
            }, 500);
            break;
    }
}

function saveMessageToAdmin(messageData) {
    const messages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
    messages.unshift({
        id: Date.now(),
        ...messageData
    });
    localStorage.setItem('adminMessages', JSON.stringify(messages));
}

// Chat enter key
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Add mobile nav styles if not exists
            if (!document.getElementById('mobile-nav-styles')) {
                const styles = document.createElement('style');
                styles.id = 'mobile-nav-styles';
                styles.textContent = `
                    @media (max-width: 768px) {
                        .nav {
                            position: fixed;
                            top: 70px;
                            left: 0;
                            right: 0;
                            background: white;
                            flex-direction: column;
                            padding: 1rem;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                            display: none;
                            z-index: 999;
                        }
                        
                        .nav.active {
                            display: flex;
                        }
                    }
                `;
                document.head.appendChild(styles);
            }
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============================================
// Checkout -> salvar pedido para área admin
// ============================================

function getCheckoutCartItems() {
    // Não usar localStorage. Tenta ler transferência transitória via window.name (definida por `goToCheckout`).
    try {
        if (window && window.name) {
            try {
                const w = JSON.parse(window.name || '{}');
                if (w && w.__cart_transfer && Array.isArray(w.items)) {
                    // limpa a janela para não persistir dados
                    window.name = '';
                    return w.items || [];
                }
            } catch (e) {
                // se window.name não for JSON, ignorar
            }
        }
    } catch (e) { /* ignore */ }
    // fallback: nenhum carrinho disponível no front-end (sem persistência)
    return [];
}

function getCheckoutTotals() {
    const subtotalEl = document.getElementById('summarySubtotal');
    const shippingEl = document.getElementById('summaryShipping');
    const totalEl = document.getElementById('summaryTotal');
    const parse = (el) => {
        if (!el) return 0;
        const txt = (el.textContent || '').toString();
        const n = txt
            .replace(/[^0-9,\.]/g, '')
            .replace(/\.(?=\d{3}(\D|$))/g, '')
            .replace(',', '.');
        const v = parseFloat(n);
        return isNaN(v) ? 0 : v;
    };
    return {
        subtotal: parse(subtotalEl),
        shipping: parse(shippingEl),
        total: parse(totalEl)
    };
}

async function placeOrder() {
    const form = document.getElementById('shippingForm');
    if (!form) return;

    // valida campos obrigatórios do endereço
    if (form.reportValidity && !form.reportValidity()) {
        return;
    }

    const data = new FormData(form);
    const rawCustomer = {
        name: (data.get('name') || '').toString().trim(),
        email: (data.get('email') || '').toString().trim(),
        phone: (data.get('phone') || '').toString().trim(),
        country: (data.get('country') || '').toString().trim(),
        state: (data.get('state') || '').toString().trim(),
        city: (data.get('city') || '').toString().trim(),
        address: (data.get('address') || '').toString().trim(),
        cnpj: (data.get('cnpj') || '').toString().trim()
    };

    const items = getCheckoutCartItems() || [];
    const totals = getCheckoutTotals();
    const id = 'ORD-' + Date.now();
    const nowIso = new Date().toISOString();

    // Monta payload mínimo e envia ao servidor. O front-end NÃO persiste nada.
    const order = {
        id,
        customer: rawCustomer,
        items,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total || items.reduce((s,i)=> s + (Number(i.price)||0)*(Number(i.quantity)||1),0),
        status: 'pending',
        createdAt: nowIso,
        shippingDays: 15
    };

    // If a Firebase web config exists, wait a short time for the client SDK to become ready.
    const waitForFirebase = (timeout = 3000) => new Promise(resolve => {
        const start = Date.now();
        const iv = setInterval(() => {
            if (window.FIREBASE_CLIENT_READY) { clearInterval(iv); return resolve(true); }
            if (Date.now() - start > timeout) { clearInterval(iv); return resolve(false); }
        }, 250);
    });

    try {
            if (!navigator.onLine) {
            alert('Sem conexão de rede. Verifique sua internet e tente novamente.');
            return;
        }
        console.log("Pedido enviado:", order);

        const CREATE_ENDPOINT = window.CREATE_ORDER_ENDPOINT || (window.location.protocol === 'file:' ? 'http://localhost:3001/api/createOrder' : '/api/createOrder');
        let res;
        try {
            // Firebase foi removido — enviar sempre ao endpoint backend
            console.info('[placeOrder] firebase removed; sending order to backend endpoint', CREATE_ENDPOINT);
            res = await fetch(CREATE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            });
        } catch (networkErr) {
            console.error('[placeOrder] network error when calling create endpoint', CREATE_ENDPOINT, networkErr);
            // Fallback: save order locally in browser so the user doesn't lose it
            try {
                const key = 'PENDING_ORDERS';
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.unshift(Object.assign({}, order, { savedAt: new Date().toISOString(), offline: true }));
                localStorage.setItem(key, JSON.stringify(existing.slice(0, 200)));
                // Não usar alert bloqueante — preferir notificação no UI ou console
                try {
                    if (typeof showNotification === 'function') {
                        try { showNotification('Pedido salvo localmente. Será enviado automaticamente quando a conexão retornar.', 'warning'); } catch(e) { console.warn('[placeOrder] showNotification falhou', e); }
                    } else {
                        console.warn('Sem conexão com o backend. Pedido salvo localmente.');
                    }
                } catch(e) { console.warn('[placeOrder] fallback notify error', e); }
                window.location.href = `order-success.html?orderId=${encodeURIComponent(order.id)}`;
                return;
            } catch (eLocal) {
                // se não for possível salvar localmente, mostrar mensagem amigável
                if (CREATE_ENDPOINT.includes('/api/createOrder') && window.location.host && !window.location.host.includes('localhost')) {
                    alert('Erro ao enviar pedido: backend não acessível a partir deste site hospedado. Contate o administrador ou tente novamente mais tarde.');
                } else {
                    alert('Erro de rede ao enviar pedido. Verifique a conectividade e tente novamente.');
                }
                return;
            }
        }

        let json;
        try {
            json = await res.json();
            try { console.info('[placeOrder] server response', res && res.status, json); } catch(e){}
        } catch (eParse) {
            const txt = await res.text().catch(() => null);
            console.error('[placeOrder] resposta inválida JSON from', CREATE_ENDPOINT, res.status, res.statusText, txt);
            // envia o texto cru ao servidor para depuração automática
            try {
                await fetch(window.CREATE_ORDER_ENDPOINT.replace('/api/createOrder','/api/log-client-error'), {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: CREATE_ENDPOINT, status: res.status, statusText: res.statusText, raw: txt })
                });
            } catch(e) { console.warn('[placeOrder] falha ao enviar log de cliente', e); }
                // mostra o corpo cru em alert para diagnóstico rápido (trunca)
                try {
                    const preview = (txt || '').toString().slice(0,2000);
                    alert('Resposta do servidor (não-JSON) — início:\n' + preview + (preview.length>=2000? '\n...[truncado]' : ''));
                } catch(e) {}
            alert('Erro inesperado na resposta do servidor. Verifique o console.');
            return;
        }

        if (!res.ok) {
            // tenta extrair texto cru também para diagnóstico
            let raw = null;
            try { raw = await res.text(); } catch (e) { raw = null; }
            console.error('[placeOrder] servidor retornou erro from', CREATE_ENDPOINT, 'status=', res.status, res.statusText, 'json=', json, 'raw=', raw);
            try {
                await fetch(window.CREATE_ORDER_ENDPOINT.replace('/api/createOrder','/api/log-client-error'), {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: CREATE_ENDPOINT, status: res.status, statusText: res.statusText, json: json, raw })
                });
            } catch(e) { console.warn('[placeOrder] falha ao enviar log de cliente', e); }
                // mostra o corpo cru em alert para diagnóstico rápido (trunca)
                try {
                    const preview = ((raw && raw.toString()) || JSON.stringify(json) || '').slice(0,2000);
                    alert('Resposta do servidor (erro) — início:\n' + preview + (preview.length>=2000? '\n...[truncado]' : ''));
                } catch(e) {}
            alert('Erro ao enviar pedido. Veja o console para mais detalhes.');
            return;
        }
        // Ao retornar, servidor deve incluir o pedido salvo. Redireciona para página de sucesso com id.
        const returnedOrder = (json && (json.order || json.savedOrder)) || order;
        const orderId = returnedOrder && returnedOrder.id ? returnedOrder.id : id;
        window.location.href = `order-success.html?orderId=${encodeURIComponent(orderId)}`;
        return;
    } catch (err) {
        console.error('Erro ao chamar /api/createOrder', err);
        alert('Erro de rede ao enviar pedido. Tente novamente.');
        return;
    }

    // Enviar notificação de pedido (SMS) ao admin — configure `SMS_NOTIFY_ENDPOINT` abaixo
    try {
        // endpoint configurável: defina `window.SMS_NOTIFY_ENDPOINT` no HTML (inline) ou substitua aqui
        const SMS_NOTIFY_ENDPOINT = window.SMS_NOTIFY_ENDPOINT || (window.location.protocol === 'file:' ? 'http://localhost:3001/api/notify-sms' : '');
        if (SMS_NOTIFY_ENDPOINT) {
            const payload = { order };

            // Helper: fetch with timeout
            const fetchWithTimeout = (url, options, timeout = 4000) => {
                return Promise.race([
                    fetch(url, options),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeout))
                ]);
            };

            try {
                // Tenta enviar e aguardar resposta curta antes de redirecionar
                await fetchWithTimeout(SMS_NOTIFY_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }, 4000);
            } catch (err) {
                // Se falhar por timeout ou erro de rede, tenta sendBeacon como último recurso (não bloqueante)
                try {
                    if (navigator.sendBeacon) {
                        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                        navigator.sendBeacon(SMS_NOTIFY_ENDPOINT, blob);
                        console.info('Notificação SMS enviada via sendBeacon (fallback).');
                    } else {
                        console.warn('Falha ao enviar notificação SMS e sendBeacon não disponível:', err);
                    }
                } catch (e2) {
                    console.warn('Erro no fallback sendBeacon para notificação SMS:', e2);
                }
            }
        }
    } catch (e) {
        console.warn('Erro ao tentar notificar por SMS:', e);
    }

    // Notificar o servidor para enviar e-mail ao admin com todos os dados do pedido
    try {
        const ORDER_NOTIFY_ENDPOINT = window.ORDER_NOTIFY_ENDPOINT || (window.location.protocol === 'file:' ? 'http://localhost:3001/api/order-complete' : '/api/order-complete');
        const payload = { order };
        // Envia sem bloquear, mas tenta breve timeout antes do redirecionamento
        const fetchWithTimeout = (url, options, timeout = 4000) => {
            return Promise.race([
                fetch(url, options),
                new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeout))
            ]);
        };
        try {
            await fetchWithTimeout(ORDER_NOTIFY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, 3000);
        } catch (err) {
            // Tentativa falhou (timeout/rede) — faz sendBeacon como fallback
            try {
                if (navigator.sendBeacon) {
                    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                    navigator.sendBeacon(ORDER_NOTIFY_ENDPOINT, blob);
                    console.info('Notificação de pedido enviada via sendBeacon (fallback).');
                } else {
                    console.warn('Falha ao notificar servidor do pedido e sendBeacon não disponível:', err);
                }
            } catch (e2) {
                console.warn('Erro no fallback sendBeacon para notificação de pedido:', e2);
            }
        }
    } catch (e) {
        console.warn('Erro ao notificar servidor para envio de e-mail:', e);
    }

    // mensagem de sucesso e voltar para a home
    alert('✅ Pedido finalizado com sucesso!');
    window.location.href = 'index.html';
}

window.placeOrder = placeOrder;
