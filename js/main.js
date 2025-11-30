// ============================================
// CellShop - Main JavaScript
// All interactive functionality
// ============================================

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
    slideInterval = setInterval(nextSlide, 12000);
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
            if (authManager.isAuthenticated()) {
                showUserMenu();
            } else {
                showLoginModal();
            }
        });
    }
    
    // Check for logged in user
    updateAuthUI();
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
