// ============================================
// CellShop - Shopping Cart System
// ============================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    quantity = parseInt(quantity, 10) || 1;
    if (quantity <= 0) return;

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`Quantidade ${quantity} adicionada ao carrinho!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart UI (count badge)
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Get cart subtotal
function getCartSubtotal() {
    const currency = localStorage.getItem('currency') || 'USD';
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { amount: total, formatted: formatPrice(total, currency) };
}

// Show cart modal
function showCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    modal.classList.add('active');
    renderCartItems();
}

// Close cart modal
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    modal.classList.remove('active');
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartSummaryEl = document.querySelector('.cart-summary');
    const summaryRows = cartSummaryEl ? cartSummaryEl.querySelectorAll('.summary-row') : null;
    const subtotalRow = summaryRows && summaryRows[0] ? summaryRows[0] : null;
    const shippingRow = summaryRows && summaryRows[1] ? summaryRows[1] : null;
    const totalRow = summaryRows && summaryRows[2] ? summaryRows[2] : null;
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--gray-500);">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                <p data-translate="cart_empty">Seu carrinho está vazio</p>
            </div>
        `;
        if (cartSummaryEl) cartSummaryEl.style.display = 'none';
        return;
    }
    
    const currency = localStorage.getItem('currency') || 'USD';
    
    cartItemsContainer.innerHTML = cart.map(item => {
        const priceHtml = (item.price && item.price > 0)
            ? `<div class="cart-item-price">${formatPrice(item.price, currency)}</div>`
            : '';
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${priceHtml}
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    }).join('');
    
    const subtotal = getCartSubtotal();
    if (shippingRow) shippingRow.style.display = 'none'; // remover "Frete: Calculado no checkout"
    if (subtotal.amount <= 0) {
        if (cartSummaryEl) cartSummaryEl.style.display = 'none'; // ocultar subtotal/total quando 0
    } else {
        if (cartSummaryEl) cartSummaryEl.style.display = '';
        if (subtotalRow) subtotalRow.style.display = '';
        if (totalRow) totalRow.style.display = '';
        if (cartSubtotal) cartSubtotal.textContent = subtotal.formatted;
        if (cartTotal) cartTotal.textContent = subtotal.formatted;
    }
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    // Save cart data for checkout
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not exists
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                color: #000; /* texto preto na notificação */
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10001;
                animation: slideIn 0.3s ease;
            }
            .notification span { color: #000; }
            
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid #3b82f6; }
            
            .notification i {
                font-size: 1.25rem;
            }
            
            .notification-success i { color: #10b981; }
            .notification-error i { color: #ef4444; }
            .notification-info i { color: #3b82f6; }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cart modal listeners
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count on load
    updateCartUI();
    
    // Cart button click
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCartModal);
    }
    
    // Close modal when clicking outside
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        cart,
        getCartSubtotal
    };
}