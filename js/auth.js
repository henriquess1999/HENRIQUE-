// ============================================
// CellShop - Authentication System
// User registration, login, profile management
// ============================================

class AuthManager {
    constructor() {
        this.currentUser = this.loadUser();
        this.users = this.loadUsers();
    }

    // Load current user from localStorage
    loadUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Load all users
    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Register new user
    register(data) {
        // Validate email not already registered
        if (this.users.find(u => u.email === data.email)) {
            return { success: false, message: 'Email já cadastrado!' };
        }

        // Validate document format
        const docNumber = data.document.replace(/\D/g, '');
        if (docNumber.length !== 11 && docNumber.length !== 14) {
            return { success: false, message: 'CPF ou CNPJ inválido!' };
        }

        const newUser = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            password: this.hashPassword(data.password), // Simple hash
            document: data.document,
            isCNPJ: docNumber.length === 14,
            country: data.country,
            city: data.city,
            addresses: [],
            orders: [],
            phone: data.phone || '',
            birthDate: data.birthDate || '',
            createdAt: new Date().toISOString(),
            preferredCurrency: localStorage.getItem('currency') || 'USD'
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Login user
        this.login(data.email, data.password);

        return { success: true, message: 'Cadastro realizado com sucesso!' };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'Usuário não encontrado!' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Senha incorreta!' };
        }

        // Remove password from stored user
        const userToStore = { ...user };
        delete userToStore.password;
        
        this.currentUser = userToStore;
        localStorage.setItem('currentUser', JSON.stringify(userToStore));

        return { success: true, message: 'Login realizado com sucesso!' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        return { success: true, message: 'Logout realizado com sucesso!' };
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) {
            return { success: false, message: 'Usuário não autenticado!' };
        }

        // Find and update user in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado!' };
        }

        // Update user data (except password)
        const updatedUser = { ...this.users[userIndex], ...updates };
        delete updatedUser.password; // Never update password this way

        this.users[userIndex] = updatedUser;
        this.currentUser = updatedUser;

        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        return { success: true, message: 'Perfil atualizado com sucesso!' };
    }

    // Add address
    addAddress(address) {
        if (!this.currentUser) {
            return { success: false, message: 'Usuário não autenticado!' };
        }

        const newAddress = {
            id: Date.now(),
            ...address,
            createdAt: new Date().toISOString()
        };

        this.currentUser.addresses = this.currentUser.addresses || [];
        this.currentUser.addresses.push(newAddress);

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].addresses = this.currentUser.addresses;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { success: true, message: 'Endereço adicionado com sucesso!', address: newAddress };
    }

    // Remove address
    removeAddress(addressId) {
        if (!this.currentUser) {
            return { success: false, message: 'Usuário não autenticado!' };
        }

        this.currentUser.addresses = this.currentUser.addresses.filter(a => a.id !== addressId);

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].addresses = this.currentUser.addresses;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { success: true, message: 'Endereço removido com sucesso!' };
    }

    // Add order
    addOrder(order) {
        if (!this.currentUser) {
            return { success: false, message: 'Usuário não autenticado!' };
        }

        const newOrder = {
            id: 'ORD-' + Date.now(),
            ...order,
            userId: this.currentUser.id,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        this.currentUser.orders = this.currentUser.orders || [];
        this.currentUser.orders.push(newOrder);

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].orders = this.currentUser.orders;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { success: true, message: 'Pedido criado com sucesso!', order: newOrder };
    }

    // Get user orders
    getOrders() {
        if (!this.currentUser) return [];
        return this.currentUser.orders || [];
    }

    // Get user addresses
    getAddresses() {
        if (!this.currentUser) return [];
        return this.currentUser.addresses || [];
    }

    // Simple password hash (for demo - use proper hashing in production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(36);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user has CNPJ (wholesale access)
    canAccessWholesale() {
        return this.currentUser && this.currentUser.isCNPJ;
    }

    // Get user display info
    getUserInfo() {
        return this.currentUser ? {
            name: this.currentUser.name,
            email: this.currentUser.email,
            isCNPJ: this.currentUser.isCNPJ
        } : null;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Update UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// Update auth UI
function updateAuthUI() {
    const userBtn = document.getElementById('userBtn');
    if (!userBtn) return;

    if (authManager.isAuthenticated()) {
        userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        userBtn.title = authManager.currentUser.name;
        userBtn.style.color = '#10b981';
    } else {
        userBtn.innerHTML = '<i class="fas fa-user"></i>';
        userBtn.title = 'Login/Cadastro';
        userBtn.style.color = 'inherit';
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'loginModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-sign-in-alt"></i> Login</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="loginForm">
                    <div class="form-group">
                        <label>E-mail</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Senha</label>
                        <input type="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Entrar</button>
                </form>
            </div>
            <div class="modal-footer">
                <p>Não tem conta? <a href="#" onclick="this.closest('.modal').remove(); showRegisterModal()">Cadastre-se</a></p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const result = authManager.login(formData.get('email'), formData.get('password'));
        
        if (result.success) {
            showNotification(result.message, 'success');
            modal.remove();
            updateAuthUI();
        } else {
            showNotification(result.message, 'error');
        }
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, authManager };
}
