// ============================================
// CellShop - Admin Dashboard JavaScript
// ============================================

// Check admin authentication
document.addEventListener('DOMContentLoaded', () => {
    const adminSession = JSON.parse(localStorage.getItem('adminSession'));
    
    if (!adminSession) {
        window.location.href = 'admin.login.html';
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    loadCharts();
    loadProducts();
    loadCustomers();
    loadAllOrders();
    initCustomerGrowthChart();
    loadSales();
    loadFinancial();
});

// Section Navigation
function showSection(sectionId) {
    // Atualiza links de navegação (remove active de todos e marca o link correspondente)
    document.querySelectorAll('.admin-nav-link').forEach(link => link.classList.remove('active'));
    const navLink = document.querySelector(`.admin-nav-link[href="#${sectionId}"]`);
    if (navLink) navLink.classList.add('active');

    // Atualiza seções (garante que somente a seção solicitada esteja visível)
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) targetSection.classList.add('active');

    // Atualiza título do cabeçalho
    const titles = {
        'dashboard': 'Dashboard',
        'sales': 'Vendas',
        'products': 'Produtos',
        'customers': 'Clientes',
        'orders': 'Pedidos',
        'messages': 'Mensagens',
        'financial': 'Financeiro',
        'settings': 'Configurações'
    };
    const titleEl = document.getElementById('sectionTitle');
    if (titleEl) titleEl.textContent = titles[sectionId] || sectionId;
}

// Load Dashboard Data
function loadDashboardData() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const checkoutCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    // Calculate stats
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today && order.status === 'done'
    );

    const todaySales = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Update UI
    document.getElementById('todaySales').textContent = formatPrice(todaySales, 'USD');
    document.getElementById('totalOrders').textContent = orders.length;
    // Calcular contagem única de clientes combinando usuários legados e clientes do checkout
    try {
        const map = new Map();
        (users || []).forEach(u => {
            const id = u && u.id != null ? 'LEG-' + u.id : ('LEG-' + Math.random().toString(36).slice(2,8));
            map.set(id, true);
        });
        (checkoutCustomers || []).forEach(c => {
            const id = c && c.id ? c.id : (c && c.email ? 'CHK-' + c.email : 'CHK-' + Math.random().toString(36).slice(2,8));
            map.set(id, true);
        });
        document.getElementById('totalCustomers').textContent = String(map.size);
    } catch (e) {
        // Fallback simples: exibe apenas a quantidade de `users`
        document.getElementById('totalCustomers').textContent = users.length;
    }
    updatePendingOrdersBadge(orders);
    
    // Load recent orders
    loadRecentOrders(orders);
}

// Atualiza o sino com quantidade de pedidos pendentes
function updatePendingOrdersBadge(ordersParam) {
    const badge = document.getElementById('pendingOrdersBadge');
    if (!badge) return;

    const orders = ordersParam || JSON.parse(localStorage.getItem('orders') || '[]');
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    badge.textContent = pendingCount;
    badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
}

// Load Recent Orders
function loadRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    Nenhum pedido encontrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.slice(0, 10).map(order => {
        const isDone = order.status === 'done';
        const statusClass = isDone ? 'success' : 'warning';
        const statusText = isDone ? 'Concluído' : 'Pendente';

        const rawPhone = ((order.customer && order.customer.phone) || '').replace(/\D/g, '');
        let formattedPhone = '';
        if (rawPhone.length === 11) {
            formattedPhone = `(${rawPhone.slice(0,2)}) ${rawPhone.slice(2,7)}-${rawPhone.slice(7)}`;
        } else if (rawPhone.length === 10) {
            formattedPhone = `(${rawPhone.slice(0,2)}) ${rawPhone.slice(2,6)}-${rawPhone.slice(6)}`;
        } else if (order.customer && order.customer.phone) {
            formattedPhone = order.customer.phone;
        }

        const addressLine = order.customer && order.customer.address
            ? order.customer.address
            : '';

        const customerBlock = `
            <div><strong>${order.customer?.name || '-'}</strong></div>
            ${formattedPhone ? `<div style="font-size:0.85rem; color:var(--gray-600);">Tel: ${formattedPhone}</div>` : ''}
            ${addressLine ? `<div style="font-size:0.85rem; color:var(--gray-600);">End: ${addressLine}</div>` : ''}
        `;
        
        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${customerBlock}</td>
                <td><strong>${formatPrice(order.total, 'USD')}</strong></td>
                <td>
                    <button class="action-btn" onclick="updateOrderStatus('${order.id}', 'down')">-</button>
                    <span class="status-badge ${statusClass}" data-order-status="${order.id}">${statusText}</span>
                    <button class="action-btn" onclick="updateOrderStatus('${order.id}', 'up')">+</button>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                <td class="action-buttons">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load Charts
function loadCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Vendas',
                    data: [1200, 1900, 3000, 2500, 3200, 4100, 3800],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Products Chart
    const productsCtx = document.getElementById('productsChart');
    if (productsCtx) {
        new Chart(productsCtx, {
            type: 'doughnut',
            data: {
                labels: ['iPhone', 'Áudio', 'Carregadores', 'Crypto', 'Outros'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6',
                        '#6b7280'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// ============================================
// Customer Growth Chart (Clientes por período)
// ============================================

let customerGrowthChart;
let financialChart;

function initCustomerGrowthChart() {
    const ctx = document.getElementById('customerGrowthChart');
    if (!ctx || typeof Chart === 'undefined') return;

    const data = buildCustomerGrowthData('day');

    customerGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Novos clientes',
                data: data.values,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.15)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: '#16a34a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function updateCustomerGrowthChart(mode) {
    if (!customerGrowthChart) {
        initCustomerGrowthChart();
    }
    if (!customerGrowthChart) return;

    const data = buildCustomerGrowthData(mode);
    customerGrowthChart.data.labels = data.labels;
    customerGrowthChart.data.datasets[0].data = data.values;
    customerGrowthChart.update();
}

function buildCustomerGrowthData(mode) {
    const legacyUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const checkoutCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    const events = [];

    legacyUsers.forEach(u => {
        if (u.createdAt) events.push(new Date(u.createdAt));
    });

    checkoutCustomers.forEach(c => {
        if (c.createdAt) events.push(new Date(c.createdAt));
        (c.orderDates || []).forEach(d => {
            try { events.push(new Date(d)); } catch(e) {}
        });
    });

    orders.forEach(o => {
        if (o.createdAt) events.push(new Date(o.createdAt));
    });

    if (!events.length) {
        return { labels: ['Sem dados'], values: [0] };
    }

    const map = new Map();

    events.forEach(date => {
        if (!(date instanceof Date) || isNaN(date)) return;

        let key;
        switch (mode) {
            case 'year':
                key = `${date.getFullYear()}`;
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'week': {
                const year = date.getFullYear();
                const firstDay = new Date(year, 0, 1);
                const pastDaysOfYear = (date - firstDay) / 86400000;
                const week = Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
                key = `${year}-S${String(week).padStart(2, '0')}`;
                break;
            }
            case 'day':
            default:
                key = date.toISOString().slice(0, 10);
        }

        map.set(key, (map.get(key) || 0) + 1);
    });

    const keys = Array.from(map.keys()).sort();

    const labels = keys.map(k => {
        if (mode === 'day') {
            return new Date(k).toLocaleDateString('pt-BR');
        }
        if (mode === 'month') {
            const [y, m] = k.split('-');
            return `${m}/${y}`;
        }
        if (mode === 'year') {
            return k;
        }
        if (mode === 'week') {
            const [y, w] = k.split('-S');
            return `Sem ${w}/${y}`;
        }
        return k;
    });

    const values = keys.map(k => map.get(k));

    return { labels, values };
}

// ============================================
// Financial Chart (Receita x Comissão)
// ============================================

function initFinancialChart() {
    // Gráfico do Financeiro (Financeiro/ADM)
    const ctx = document.getElementById('financialChart');
    if (ctx && typeof Chart !== 'undefined') {
        const data = buildFinancialChartData('month');
        financialChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Receita',
                        data: data.revenue,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.12)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 3,
                        pointBackgroundColor: '#2563eb'
                    },
                    {
                        label: 'Comissão',
                        data: data.commission,
                        borderColor: '#16a34a',
                        backgroundColor: 'rgba(22, 163, 74, 0.12)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 3,
                        pointBackgroundColor: '#16a34a'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Gráfico do Financeiro também no Dashboard/ADM
    const ctxDash = document.getElementById('financialChartDashboard');
    if (ctxDash && typeof Chart !== 'undefined') {
        const data = buildFinancialChartData('month');
        // Evita múltiplas instâncias
        if (ctxDash.financialChartInstance) {
            ctxDash.financialChartInstance.destroy();
        }
        ctxDash.financialChartInstance = new Chart(ctxDash, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Receita',
                        data: data.revenue,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.12)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 3,
                        pointBackgroundColor: '#2563eb'
                    },
                    {
                        label: 'Comissão',
                        data: data.commission,
                        borderColor: '#16a34a',
                        backgroundColor: 'rgba(22, 163, 74, 0.12)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 3,
                        pointBackgroundColor: '#16a34a'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function updateFinancialChart(mode) {
    if (!financialChart) {
        initFinancialChart();
    }
    if (!financialChart) return;

    const data = buildFinancialChartData(mode);
    financialChart.data.labels = data.labels;
    financialChart.data.datasets[0].data = data.revenue;
    financialChart.data.datasets[1].data = data.commission;
    financialChart.update();
}

function buildFinancialChartData(mode) {
    const financial = JSON.parse(localStorage.getItem('financialRecords') || '[]');
    if (!financial.length) {
        return { labels: ['Sem dados'], revenue: [0], commission: [0] };
    }

    const map = new Map();

    financial.forEach(r => {
        const d = new Date(r.consolidatedAt || r.sourceCreatedAt);
        if (!(d instanceof Date) || isNaN(d)) return;

        let key;
        if (mode === 'year') {
            key = String(d.getFullYear());
        } else if (mode === 'day') {
            // dia completo
            key = d.toISOString().slice(0, 10); // AAAA-MM-DD
        } else {
            // mês/ano
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }

        if (!map.has(key)) {
            map.set(key, { revenue: 0, commission: 0 });
        }
        const bucket = map.get(key);
        bucket.revenue += r.amount || 0;
        bucket.commission += r.commission || 0;
    });

    const keys = Array.from(map.keys()).sort();
    const labels = keys.map(k => {
        if (mode === 'year') return k;
        if (mode === 'day') {
            return new Date(k).toLocaleDateString('pt-BR');
        }
        const [y, m] = k.split('-');
        return `${m}/${y}`;
    });

    const revenue = keys.map(k => map.get(k).revenue);
    const commission = keys.map(k => map.get(k).commission);

    return { labels, revenue, commission };
}

// Load Sales (Sales tab)
function loadSales() {
    const tbody = document.getElementById('salesTable');
    const totalEl = document.getElementById('salesTotal');
    const commEl = document.getElementById('salesCommissionTotal');
    if (!tbody || !totalEl || !commEl) return;

    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const today = new Date().toDateString();

    const todaySales = sales.filter(s => new Date(s.createdAt).toDateString() === today);

    if (!todaySales.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:2rem; color:var(--gray-500);">
                    Nenhuma venda computada hoje.
                </td>
            </tr>
        `;
        totalEl.textContent = 'R$ 0,00';
        commEl.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    let totalCommission = 0;
    tbody.innerHTML = todaySales.map(s => {
        const amount = s.amount || 0;
        const commission = s.commission || 0;
        total += amount;
        totalCommission += commission;
        return `
            <tr>
                <td>${new Date(s.createdAt).toLocaleString('pt-BR')}</td>
                <td>${s.customerName || '-'}</td>
                <td>R$ ${formatBRL(amount)}</td>
                <td>R$ ${formatBRL(commission)}</td>
            </tr>
        `;
    }).join('');

    totalEl.textContent = 'R$ ' + formatBRL(total);
    commEl.textContent = 'R$ ' + formatBRL(totalCommission);
}

// Load Financial (consolidated sales after 6h)
function loadFinancial() {
    const tbody = document.getElementById('financialTable');
    const totalEl = document.getElementById('totalRevenue');
    const pendingEl = document.getElementById('pendingRevenue');
    if (!tbody || !totalEl || !pendingEl) return;

    const consolidated = JSON.parse(localStorage.getItem('financialRecords') || '[]');

    if (!consolidated.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:2rem; color:var(--gray-500);">
                    Nenhum valor financeiro consolidado ainda.
                </td>
            </tr>
        `;
        totalEl.textContent = 'R$ 0,00';
        pendingEl.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    let totalCommission = 0;
    tbody.innerHTML = consolidated.map(r => {
        const amount = r.amount || 0;
        const commission = r.commission || 0;
        total += amount;
        totalCommission += commission;
        return `
            <tr>
                <td>${new Date(r.consolidatedAt || r.sourceCreatedAt).toLocaleString('pt-BR')}</td>
                <td>${r.customerName || '-'}</td>
                <td>R$ ${formatBRL(amount)}</td>
                <td>R$ ${formatBRL(commission)}</td>
            </tr>
        `;
    }).join('');

    totalEl.textContent = 'R$ ' + formatBRL(total);
    // Card de Comissão mostra o total de comissões consolidadas
    pendingEl.textContent = 'R$ ' + formatBRL(totalCommission);

    // Atualiza gráfico financeiro
    if (!financialChart) {
        initFinancialChart();
    } else {
        updateFinancialChart('month');
    }
}

// Copy financial summary helpers
function _getMonthKeyFromDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
}

function _buildFinancialSummaryForMonth(monthKey) {
    const consolidated = JSON.parse(localStorage.getItem('financialRecords') || '[]');
    const rows = consolidated.filter(r => {
        const d = new Date(r.consolidatedAt || r.sourceCreatedAt);
        if (isNaN(d)) return false;
        const key = _getMonthKeyFromDate(d);
        return key === monthKey;
    });

    let total = 0;
    let totalCommission = 0;
    const details = rows.map(r => {
        const d = new Date(r.consolidatedAt || r.sourceCreatedAt);
        const dateStr = isNaN(d) ? '-' : d.toLocaleDateString('pt-BR');
        const amount = Number(r.amount || 0);
        const commission = Number(r.commission || 0);
        total += amount;
        totalCommission += commission;
        return { date: dateStr, customer: r.customerName || '-', amount, commission };
    });

    return { monthKey, total, totalCommission, count: details.length, details };
}

function _formatFinancialSummaryText(summary) {
    const [y, m] = summary.monthKey.split('-');
    const monthLabel = `${m}/${y}`;
    let text = `Resumo Financeiro — ${monthLabel}\n`;
    text += `Receita Total: R$ ${formatBRL(summary.total)}\n`;
    text += `Comissão Total: R$ ${formatBRL(summary.totalCommission)}\n`;
    text += `Registros consolidados: ${summary.count}\n\n`;
    if (summary.count > 0) {
        text += `Detalhes:\n`;
        summary.details.forEach(d => {
            text += `- ${d.date} | ${d.customer} | R$ ${formatBRL(d.amount)} | Comissão: R$ ${formatBRL(d.commission)}\n`;
        });
    }
    return text;
}

async function _copyTextToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (e) {
        // fallback
    }
    // fallback for older browsers
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
    } catch (e) {
        return false;
    }
}

function copyFinancialSummaryCurrentMonth() {
    const now = new Date();
    const key = _getMonthKeyFromDate(now);
    const summary = _buildFinancialSummaryForMonth(key);
    const text = _formatFinancialSummaryText(summary);
    _copyTextToClipboard(text).then(ok => {
        if (ok) alert('Resumo do mês atual copiado para a área de transferência.');
        else alert('Falha ao copiar o resumo.');
    });
}

function copyFinancialSummaryPreviousMonth() {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const key = _getMonthKeyFromDate(now);
    const summary = _buildFinancialSummaryForMonth(key);
    const text = _formatFinancialSummaryText(summary);
    _copyTextToClipboard(text).then(ok => {
        if (ok) alert('Resumo do mês anterior copiado para a área de transferência.');
        else alert('Falha ao copiar o resumo.');
    });
}

// Helpers de moeda BRL
function formatBRL(value) {
    const n = Number(value) || 0;
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function maskBRL(input) {
    let v = input.value.replace(/[^0-9]/g, '');
    if (!v) {
        input.value = '';
        return;
    }
    // trabalha em centavos: últimos 2 dígitos são as casas decimais
    if (v.length === 1) {
        v = '0,0' + v;
    } else if (v.length === 2) {
        v = '0,' + v;
    } else {
        const inteiros = v.slice(0, -2);
        const centavos = v.slice(-2);
        const inteirosFmt = Number(inteiros).toLocaleString('pt-BR');
        v = inteirosFmt + ',' + centavos;
    }
    input.value = v;
}


// Load Products
function loadProducts() {
    const tbody = document.getElementById('productsTable');
    
    if (!tbody) return;

    // Produtos base vindos do arquivo products.js (quando disponível)
    const baseProducts = Array.isArray(window.products) ? window.products : (typeof products !== 'undefined' && Array.isArray(products) ? products : []);
    // Produtos personalizados cadastrados pelo admin
    const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

    // Evita duplicar itens: se um custom tiver mesmo id de base, mantém apenas o custom
    const baseWithoutCustom = baseProducts.filter(bp => !customProducts.some(cp => cp.id === bp.id));
    const allProducts = [...baseWithoutCustom, ...customProducts];

    if (!allProducts.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:2rem; color:var(--gray-500);">
                    Nenhum produto cadastrado ainda.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = allProducts.map(product => {
        return `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="product-image-small"></td>
                <td><strong class="product-name">${product.name}</strong></td>
                <td>${getCategoryName(product.category)}</td>
                <td class="action-buttons">
                    <button class="action-btn view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Modal de adicionar produto (Admin)
function openAdminAddProductModal() {
    const modal = document.getElementById('adminAddProductModal');
    if (!modal) return;
    // Limpa modo de edição
    modal.removeAttribute('data-edit-id');
    const form = document.getElementById('adminAddProductForm');
    if (form) form.reset();
    modal.classList.add('active');
}

function closeAdminAddProductModal() {
    const modal = document.getElementById('adminAddProductModal');
    if (!modal) return;
    modal.classList.remove('active');
}

function saveAdminNewProduct(event) {
    event.preventDefault();
    const form = event.target;

    // Se o modal estiver em modo edição, usamos este id
    const modal = document.getElementById('adminAddProductModal');
    const editingIdAttr = modal ? modal.getAttribute('data-edit-id') : null;
    const editingId = editingIdAttr ? Number(editingIdAttr) : null;

    const name = form.name.value.trim();
    // Normaliza o valor de preço aceitando formatos BRL (1.234,56) ou ponto (1234.56)
    const priceRaw = (form.price.value || '').toString().trim();
    let price = 0;
    if (priceRaw) {
        const cleaned = priceRaw.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.\-]/g, '');
        const n = Number(cleaned);
        price = isNaN(n) ? 0 : n;
    }
    const image = form.image.value.trim();
    const extraImagesRaw = form.extraImages.value.trim();
    const video = form.video.value.trim();
    const badge = form.badge.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value || 'industrial';

    if (!name || !image || !description) {
        alert('Preencha pelo menos nome, imagem e descrição.');
        return;
    }

    const extraImages = extraImagesRaw
        ? extraImagesRaw.split(',').map(u => u.trim()).filter(Boolean)
        : [];

    // Produtos base do site
    const baseProducts = Array.isArray(window.products) ? window.products : [];
    let existingCustom = JSON.parse(localStorage.getItem('customProducts') || '[]');
    // Normaliza entries existentes: garante flag `_isCustom` e preço numérico
    if (!Array.isArray(existingCustom)) existingCustom = [];
    existingCustom = existingCustom.map(ec => ({ ...ec, _isCustom: true, price: ec && ec.price != null ? Number(ec.price) : undefined }));

    // Se estiver editando, mantemos o id original; senão, calculamos o próximo id
    const nextId = editingId || (
        Math.max(
            0,
            ...baseProducts.map(p => p.id || 0),
            ...existingCustom.map(p => p.id || 0)
        ) + 1
    );

    const newProduct = {
        id: nextId,
        name,
        price,
        image,
        // garante que a imagem principal esteja sempre na primeira posição do array `images`
        images: Array.from(new Set([image, ...extraImages].filter(Boolean))),
        description,
        category,
        badge: badge || undefined,
        video: video || undefined,
        rating: 5,
        reviews: 0
    };

    // Marca produto personalizado explicitamente
    newProduct._isCustom = true;

    // Se for edição, substitui; se for novo, adiciona
    if (editingId) {
        existingCustom = existingCustom.filter(p => p.id !== editingId);
    }
    const updatedCustom = [...existingCustom, newProduct];
    localStorage.setItem('customProducts', JSON.stringify(updatedCustom));

    // Atualiza array global de produtos (home)
    if (Array.isArray(window.products)) {
        window.products = [...baseProducts.filter(p => !existingCustom.some(c => c.id === p.id)), ...updatedCustom];
    }

    // Atualiza tabela de produtos no admin
    loadProducts();

    alert('✅ Produto salvo com sucesso! Ele já pode aparecer na área da loja.');
    closeAdminAddProductModal();
    form.reset();
}

// Load All Orders (Orders tab)
function loadAllOrders() {
    const tbody = document.getElementById('ordersTable');
    if (!tbody) return;

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    if (!orders.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:2rem; color:var(--gray-500);">
                    Nenhum pedido encontrado
                </td>
            </tr>
        `;
        updatePendingOrdersBadge(orders);
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const c = order.customer || {};
        const rawPhone = (c.phone || '').replace(/\D/g, '');
        let formattedPhone = '';
        if (rawPhone.length === 11) {
            formattedPhone = `(${rawPhone.slice(0,2)}) ${rawPhone.slice(2,7)}-${rawPhone.slice(7)}`;
        } else if (rawPhone.length === 10) {
            formattedPhone = `(${rawPhone.slice(0,2)}) ${rawPhone.slice(2,6)}-${rawPhone.slice(6)}`;
        } else if (c.phone) {
            formattedPhone = c.phone;
        }

        const addressLine = c.address || '-';
        const isDone = order.status === 'done';
        const statusClass = isDone ? 'success' : 'warning';
        const statusText = isDone ? 'Concluído' : 'Pendente';

        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                    <button class="link-button" onclick="viewOrderItems('${order.id}')">
                        ${c.name || '-'}
                    </button>
                </td>
                <td>${formattedPhone || '-'}</td>
                <td>${addressLine}</td>
                <td>
                    <input type="text"
                           value="${formatBRL(order.total || 0)}" 
                           oninput="maskBRL(this)"
                           onblur="updateOrderTotal('${order.id}', this.value)"
                           style="width:100%; max-width:140px; background:#0b0b0b; color:var(--primary); border:1px solid rgba(191,161,74,0.4); border-radius:6px; padding:0.25rem 0.5rem; display:inline-block;">
                </td>
                <td>
                    <input type="text"
                           value="${formatBRL(order.commission || 0)}" 
                           oninput="maskBRL(this)"
                           onblur="updateOrderCommission('${order.id}', this.value)"
                           style="width:100%; max-width:140px; background:#0b0b0b; color:#22c55e; border:1px solid rgba(34,197,94,0.5); border-radius:6px; padding:0.25rem 0.5rem; display:inline-block;">
                </td>
                <td>
                    <button class="action-btn" onclick="updateOrderStatus('${order.id}', 'down')">-</button>
                    <span class="status-badge ${statusClass}" data-order-status="${order.id}">${statusText}</span>
                    <button class="action-btn" onclick="updateOrderStatus('${order.id}', 'up')">+</button>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                <td class="action-buttons">
                    <button class="action-btn delete" onclick="deleteCustomer('${order.customerId}')">
                        <i class="fas fa-user-times"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    updatePendingOrdersBadge(orders);
}

// Load Customers
function loadCustomers() {
    const legacyUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const checkoutCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tbody = document.getElementById('customersTable');
    
    if (!tbody) return;

    // Combina clientes antigos (cadastro) com clientes do checkout
    const map = new Map();

    legacyUsers.forEach(u => {
        map.set('LEG-' + u.id, {
            id: 'LEG-' + u.id,
            name: u.name,
            email: u.email,
            country: u.country,
            typeLabel: u.isCNPJ ? 'CNPJ' : 'CPF',
            typeClass: u.isCNPJ ? 'warning' : 'success',
            createdAt: u.createdAt,
            ordersCount: 0,
            orderDates: []
        });
    });

    checkoutCustomers.forEach(c => {
        const id = c.id;
        if (!map.has(id)) {
            map.set(id, {
                id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                country: c.country,
                cnpj: c.cnpj,
                typeLabel: c.cnpj ? 'CNPJ' : 'Cliente',
                typeClass: c.cnpj ? 'warning' : 'success',
                createdAt: c.createdAt,
                ordersCount: c.ordersCount || 0,
                orderDates: c.orderDates || []
            });
        } else {
            const existing = map.get(id);
            existing.ordersCount = (existing.ordersCount || 0) + (c.ordersCount || 0);
            existing.orderDates = (existing.orderDates || []).concat(c.orderDates || []);
        }
    });

    const customers = Array.from(map.values());

    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    Nenhum cliente cadastrado
                </td>
            </tr>
        `;
        return;
    }

    customers.sort((a,b) => (b.ordersCount||0) - (a.ordersCount||0));

    tbody.innerHTML = customers.map(c => {
        const rawPhone = (c.phone || '').replace(/\D/g, '');
        let formattedPhone = '';
        if (rawPhone.length === 11) {
            formattedPhone = `(${rawPhone.slice(0,2)}) ${rawPhone.slice(2,7)}-${rawPhone.slice(7)}`;
        } else if (rawPhone.length === 10) {
            formattedPhone = `(${rawPhone.slice(0,2)}) ${rawPhone.slice(2,6)}-${rawPhone.slice(6)}`;
        } else if (c.phone) {
            formattedPhone = c.phone;
        }

        const phoneBlock = formattedPhone
            ? `<div><strong>Telefone:</strong><br>${formattedPhone}</div>`
            : '';

        return `
        <tr>
            <td>
                <button class="link-button" onclick="viewCustomer('${c.id}')">
                    <strong>${c.name}${(c.ordersCount||0) > 1 ? ' ('+c.ordersCount+')' : ''}</strong>
                </button>
            </td>
            <td>
                <div>${c.email || '-'}</div>
                ${phoneBlock}
            </td>
            <td>${c.country || '-'}</td>
            <td>${c.cnpj || '-'}</td>
            <td>${c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
            <td class="action-buttons">
                <button class="action-btn delete" onclick="deleteCustomer('${c.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

function deleteCustomer(customerId) {
    if (!confirm('Tem certeza que deseja excluir este cliente e seus pedidos?')) return;

    const legacyUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');

    // Remove de customers (checkout)
    customers = customers.filter(c => c.id !== customerId);

    // Se for usuário legado (LEG-id), remover também de users
    if (customerId.startsWith('LEG-')) {
        const rawId = customerId.replace('LEG-','');
        const remainingUsers = legacyUsers.filter(u => String(u.id) !== rawId);
        localStorage.setItem('users', JSON.stringify(remainingUsers));
    }

    // Remove pedidos ligados a esse cliente
    orders = orders.filter(o => o.customerId !== customerId);

    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('orders', JSON.stringify(orders));

    loadCustomers();
    loadDashboardData();
    alert('✅ Cliente e pedidos relacionados excluídos com sucesso.');
}

function updateOrderStatus(orderId, direction) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;

    const current = orders[idx];

    if (direction === 'up') {
        current.status = 'done';
        
        // Registrar venda computada (nome + valor) para a área de Vendas (uma única vez)
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        const alreadyRegistered = sales.some(s => s.id === current.id);
        if (!alreadyRegistered) {
            sales.push({
                id: current.id,
                customerName: (current.customer && current.customer.name) || '-',
                amount: current.total || 0,
                commission: current.commission || 0,
                createdAt: new Date().toISOString(),
                consolidated: false,
                willConsolidateAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
            });
            localStorage.setItem('sales', JSON.stringify(sales));
        }

    } else if (direction === 'down') {
        current.status = 'pending';

        // Ao voltar para pendente, remover venda correspondente da área de Vendas
        let sales = JSON.parse(localStorage.getItem('sales') || '[]');
        sales = sales.filter(s => s.id !== current.id);
        localStorage.setItem('sales', JSON.stringify(sales));
    }

    orders[idx] = current;
    localStorage.setItem('orders', JSON.stringify(orders));

    // Atualiza status visual nas duas listas (recentes e todos)
    const isNowDone = current.status === 'done';
    const label = isNowDone ? 'Concluído' : 'Pendente';
    const cssClass = isNowDone ? 'success' : 'warning';

    const els = document.querySelectorAll('[data-order-status="' + orderId + '"]');
    els.forEach(el => {
        el.textContent = label;
        el.classList.remove('success', 'warning');
        el.classList.add(cssClass);
    });

    // Atualiza sino de pendentes
    updatePendingOrdersBadge(orders);

    // Atualiza a aba de Vendas sempre que status mudar
    loadSales();
    // Atualiza financeiro (caso alguma venda tenha passado de 6h)
    consolidateSalesToFinancial();
}

function updateOrderTotal(orderId, newValue) {
    // newValue vem no formato BRL (ex: 1.234,56)
    let cleaned = String(newValue)
        .replace(/[^0-9]/g, ''); // apenas dígitos

    if (!cleaned) return;

    // últimos 2 dígitos são centavos
    let value = 0;
    if (cleaned.length === 1) {
        value = Number(cleaned) / 100;
    } else if (cleaned.length === 2) {
        value = Number(cleaned) / 100;
    } else {
        value = Number(cleaned.slice(0, -2) + '.' + cleaned.slice(-2));
    }
    if (isNaN(value) || value < 0) return;

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;

    orders[idx].total = value;
    localStorage.setItem('orders', JSON.stringify(orders));

    // Atualiza cards de resumo, lista de pedidos recentes e vendas
    loadDashboardData();
    loadSales();
    consolidateSalesToFinancial();
}

function updateOrderCommission(orderId, newValue) {
    // newValue vem no formato BRL (ex: 1.234,56)
    let cleaned = String(newValue).replace(/[^0-9]/g, '');
    if (!cleaned) cleaned = '0';

    let value = 0;
    if (cleaned.length === 1) {
        value = Number(cleaned) / 100;
    } else if (cleaned.length === 2) {
        value = Number(cleaned) / 100;
    } else {
        value = Number(cleaned.slice(0, -2) + '.' + cleaned.slice(-2));
    }
    if (isNaN(value) || value < 0) return;

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;

    orders[idx].commission = value;
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Consolida vendas com mais de 6h na aba Financeiro
function consolidateSalesToFinancial() {
    let sales = JSON.parse(localStorage.getItem('sales') || '[]');
    let financial = JSON.parse(localStorage.getItem('financialRecords') || '[]');
    const now = Date.now();

    const remainingSales = [];

    sales.forEach(s => {
        const willAt = s.willConsolidateAt ? Date.parse(s.willConsolidateAt) : null;
        if (s.consolidated || (willAt && willAt <= now)) {
            if (!s.consolidated) {
                financial.push({
                    id: s.id,
                    customerName: s.customerName,
                    amount: s.amount,
                    commission: s.commission || 0,
                    sourceCreatedAt: s.createdAt,
                    consolidatedAt: new Date().toISOString()
                });
            }
            // não mantém em sales (sai da aba Vendas do Dia)
        } else {
            remainingSales.push(s);
        }
    });

    localStorage.setItem('sales', JSON.stringify(remainingSales));
    localStorage.setItem('financialRecords', JSON.stringify(financial));

    // Recarrega visual das abas afetadas
    loadSales();
    loadFinancial();
}

// Utility Functions
function viewOrder(orderId) {
    viewOrderItems(orderId);
}

function viewOrderItems(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        alert('Pedido não encontrado.');
        return;
    }

    const infoEl = document.getElementById('orderItemsInfo');
    const tbody = document.getElementById('orderItemsTable');
    const modal = document.getElementById('orderItemsModal');
    if (!infoEl || !tbody || !modal) return;

    infoEl.innerHTML = `
        <p><strong>ID do Pedido:</strong> ${order.id}</p>
        <p><strong>Cliente:</strong> ${(order.customer && order.customer.name) || '-'}</p>
        <p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleString('pt-BR')}</p>
    `;

    const items = Array.isArray(order.items) ? order.items : [];

    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:1rem; color:var(--gray-500);">
                    Nenhum item registrado neste pedido.
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = items.map(it => {
            const qty = Number(it.quantity) || 1;
            const price = Number(it.price) || 0;
            const total = qty * price;
            return `
                <tr>
                    <td>${it.name || it.title || '-'}</td>
                    <td>${qty}</td>
                    <td>R$ ${price.toFixed(2).replace('.', ',')}</td>
                    <td>R$ ${total.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        }).join('');
    }

    modal.classList.add('active');
}

function closeOrderItems() {
    const modal = document.getElementById('orderItemsModal');
    if (modal) modal.classList.remove('active');
}

function viewProduct(productId) {
    const source = Array.isArray(window.products) ? window.products : (typeof products !== 'undefined' && Array.isArray(products) ? products : []);
    const product = source.find(p => p.id === productId);
    if (product) {
        // abre galeria de imagens do produto no dashboard
        openProductGallery(product);
    }
}

function editProduct(productId) {
    const source = Array.isArray(window.products) ? window.products : (typeof products !== 'undefined' && Array.isArray(products) ? products : []);
    const product = source.find(p => p.id === productId);
    if (!product) {
        alert('Produto não encontrado para edição.');
        return;
    }

    const modal = document.getElementById('adminAddProductModal');
    const form = document.getElementById('adminAddProductForm');
    if (!modal || !form) {
        alert('Formulário de produto não encontrado.');
        return;
    }

    // Marca o modal como edição
    modal.setAttribute('data-edit-id', String(product.id));

    // Preenche campos básicos (usa os nomes dos inputs do formulário)
    form.name.value = product.name || '';
    form.price.value = product.price != null ? String(product.price) : '';
    form.image.value = product.image || '';
    form.category.value = product.category || '';
    form.badge.value = product.badge || '';
    form.description.value = product.description || '';
    form.video.value = product.video || '';

    // Imagens extras: junta o array em string separada por vírgulas, sem a principal
    const extraImages = Array.isArray(product.images) ? product.images.filter(u => u && u !== product.image) : [];
    form.extraImages.value = extraImages.join(', ');

    modal.classList.add('active');
}

function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto da lista?')) return;

    // Remove apenas dos produtos personalizados salvos pelo admin
    let customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    const beforeLength = customProducts.length;
    customProducts = customProducts.filter(p => p.id !== productId);
    localStorage.setItem('customProducts', JSON.stringify(customProducts));

    // Atualiza window.products (base + custom) para refletir a exclusão
    try {
        const baseProducts = typeof products !== 'undefined' && Array.isArray(products) ? products : [];
        const baseWithoutCustom = baseProducts.filter(bp => !customProducts.some(cp => cp.id === bp.id));
        window.products = [...baseWithoutCustom, ...customProducts];
    } catch (e) {
        console.warn('Falha ao atualizar lista global de produtos após exclusão:', e);
    }

    // Recarrega tabela de produtos no admin
    loadProducts();

    if (beforeLength !== customProducts.length) {
        alert('✅ Produto personalizado excluído com sucesso.');
    } else {
        alert('Este produto faz parte do catálogo base e não pode ser removido pelo painel.');
    }
}

function viewCustomer(customerId) {
    const legacyUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const checkoutCustomers = JSON.parse(localStorage.getItem('customers') || '[]');

    let customer = checkoutCustomers.find(c => c.id === customerId);

    if (!customer && customerId.startsWith('LEG-')) {
        const rawId = customerId.replace('LEG-','');
        const u = legacyUsers.find(x => String(x.id) === rawId);
        if (u) {
            customer = {
                id: customerId,
                name: u.name,
                email: u.email,
                phone: u.phone,
                country: u.country,
                state: u.state,
                city: u.city,
                address: u.address,
                createdAt: u.createdAt,
                ordersCount: 0,
                orderDates: []
            };
        }
    }

    if (!customer) {
        alert('Cliente não encontrado.');
        return;
    }

    const infoEl = document.getElementById('customerDetailsInfo');
    const ordersTbody = document.getElementById('customerOrdersTable');
    const modal = document.getElementById('customerDetailsModal');
    if (!infoEl || !ordersTbody || !modal) return;

    infoEl.innerHTML = `
        <p><strong>Nome:</strong> ${customer.name || '-'}</p>
        <p><strong>E-mail:</strong> ${customer.email || '-'}</p>
        <p><strong>Telefone:</strong> ${customer.phone || '-'}</p>
        <p><strong>País:</strong> ${customer.country || '-'}</p>
        <p><strong>Estado:</strong> ${customer.state || '-'}</p>
        <p><strong>Cidade:</strong> ${customer.city || '-'}</p>
        <p><strong>Endereço:</strong> ${customer.address || '-'}</p>
        <p><strong>Total de pedidos:</strong> ${customer.ordersCount || 0}</p>
    `;

    const dates = customer.orderDates || [];
    const ids = customer.orderIds || [];

    if (!dates.length) {
        ordersTbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:1rem; color:var(--gray-500);">
                    Nenhum pedido registrado para este cliente.
                </td>
            </tr>
        `;
    } else {
        ordersTbody.innerHTML = dates.map((d, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${new Date(d).toLocaleString('pt-BR')}</td>
                <td>${ids[idx] || '-'}</td>
            </tr>
        `).join('');
    }

    modal.classList.add('active');
}

function closeCustomerDetails() {
    const modal = document.getElementById('customerDetailsModal');
    if (modal) modal.classList.remove('active');
}

// (Área de mensagens removida do painel admin)

function showAddProductModal() {
    openAdminAddProductModal();
}

function showTransferModal() {
    alert('Modal de transferência (em desenvolvimento)');
}

function showBankAccountModal() {
    alert('Modal de conta bancária (em desenvolvimento)');
}

// Galeria de imagens do produto no admin
function openProductGallery(product){
    const modal = document.getElementById('productGalleryModal');
    const titleEl = document.getElementById('galleryProductTitle');
    const container = document.getElementById('galleryImages');
    if (!modal || !titleEl || !container) return;

    titleEl.textContent = `Imagens - ${product.name}`;

    // Coleção básica de imagens: imagem principal + variações conhecidas (se existirem)
    const urls = [];
    if (product.image) urls.push(product.image);
    if (Array.isArray(product.images)) {
        product.images.forEach(u => { if (u && !urls.includes(u)) urls.push(u); });
    }

    if (!urls.length){
        container.innerHTML = '<p style="color:var(--gray-500)">Nenhuma imagem cadastrada para este produto.</p>';
    } else {
        container.innerHTML = urls.map(u => `<img src="${u}" alt="${product.name}">`).join('');
    }

    modal.style.display = 'flex';
}

function closeProductGallery(){
    const modal = document.getElementById('productGalleryModal');
    if (modal) modal.style.display = 'none';
}

function showNotifications() {
    alert('Notificações:\n\n- 3 novos pedidos\n- 5 produtos com estoque baixo\n- 2 mensagens não respondidas');
}

function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('adminSession');
        window.location.href = 'admin.login.html';
    }
}

// Settings Form
document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✅ Configurações salvas com sucesso!');
});

// Change Password Form
document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const current = (formData.get('currentPassword') || '').toString();
    const next = (formData.get('newPassword') || '').toString();
    const confirm = (formData.get('confirmPassword') || '').toString();

    if (!window.AdminAuth || typeof window.AdminAuth.getPassword !== 'function') {
        alert('❌ Módulo de autenticação do admin não encontrado.');
        return;
    }

    const stored = window.AdminAuth.getPassword();
    if (!current || current !== stored) {
        alert('❌ A senha atual não confere.');
        return;
    }

    if (!next || next.length < 4) {
        alert('❌ A nova senha deve ter pelo menos 4 caracteres.');
        return;
    }

    if (next !== confirm) {
        alert('❌ A confirmação da nova senha não confere.');
        return;
    }

    try {
        window.AdminAuth.setPassword(next);
        // Opcional: derrubar sessão atual para exigir novo login
        window.AdminAuth.logout();
        alert('✅ Senha alterada com sucesso! Faça login novamente com a nova senha.');
        e.target.reset();
        // Redireciona para tela de login do admin
        window.location.href = 'admin.login.html';
    } catch (err) {
        console.error('Erro ao alterar senha do admin:', err);
        alert('❌ Ocorreu um erro ao salvar a nova senha. Tente novamente.');
    }
});

// Add message card styles
if (!document.getElementById('message-card-styles')) {
    const styles = document.createElement('style');
    styles.id = 'message-card-styles';
    styles.textContent = `
        .message-card {
            background: var(--gray-50);
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
            border-left: 4px solid var(--primary);
        }
        
        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        
        .message-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--gray-200);
        }
        
        .btn-sm {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(styles);
}

console.log('✅ Admin Dashboard loaded successfully!');