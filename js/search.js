// ============================================
// CellShop - Advanced Search & Filtering
// Product search, filtering by price, sorting
// ============================================

class ProductFilter {
    constructor() {
        const src = Array.isArray(window.products) ? window.products : products;
        this.currentFilters = {
            category: 'all',
            searchText: '',
            priceMin: 0,
            priceMax: Infinity,
            rating: 0,
            sortBy: 'popular'
        };
        this.filteredProducts = [...src];
        this.source = src;
    }

    // Search by text
    search(text) {
        this.currentFilters.searchText = text.toLowerCase();
        return this.applyFilters();
    }

    // Filter by category
    filterByCategory(category) {
        this.currentFilters.category = category;
        return this.applyFilters();
    }

    // Filter by price range
    filterByPrice(min, max) {
        this.currentFilters.priceMin = min;
        this.currentFilters.priceMax = max;
        return this.applyFilters();
    }

    // Filter by rating
    filterByRating(minRating) {
        this.currentFilters.rating = minRating;
        return this.applyFilters();
    }

    // Sort products
    sort(sortBy) {
        this.currentFilters.sortBy = sortBy;
        return this.applyFilters();
    }

    // Apply all filters
    applyFilters() {
        const list = Array.isArray(window.products) ? window.products : this.source;
        this.filteredProducts = list.filter(product => {
            // Excluir produtos 'brasilcr' das buscas globais (categoria 'all')
            if (this.currentFilters.category === 'all' && product.category === 'brasilcr') return false;
            // Category filter
            if (this.currentFilters.category !== 'all' && product.category !== this.currentFilters.category) {
                return false;
            }

            // Search filter
            if (this.currentFilters.searchText) {
                const searchText = this.currentFilters.searchText;
                const productText = (
                    product.name + ' ' + 
                    product.description + ' ' + 
                    getCategoryName(product.category)
                ).toLowerCase();

                if (!productText.includes(searchText)) {
                    return false;
                }
            }

            // Price filter
            if (product.price < this.currentFilters.priceMin || 
                product.price > this.currentFilters.priceMax) {
                return false;
            }

            // Rating filter
            if (product.rating < this.currentFilters.rating) {
                return false;
            }

            return true;
        });

        // Apply sorting
        this.applySorting();

        return this.filteredProducts;
    }

    // Apply sorting
    applySorting() {
        const sortBy = this.currentFilters.sortBy;

        switch(sortBy) {
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
            default:
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
                break;
        }
    }

    // Get unique price range
    getPriceRange() {
        const list = Array.isArray(window.products) ? window.products : this.source;
        const prices = list.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    // Reset filters
    reset() {
        this.currentFilters = {
            category: 'all',
            searchText: '',
            priceMin: 0,
            priceMax: Infinity,
            rating: 0,
            sortBy: 'popular'
        };
        return this.applyFilters();
    }

    // Get results count
    getCount() {
        return this.filteredProducts.length;
    }

    // Get filtered results
    getResults() {
        return this.filteredProducts;
    }
}

// Create global filter instance
const productFilter = new ProductFilter();

// Initialize advanced search UI
function initializeAdvancedSearch() {
    const productsSection = document.getElementById('products');
    if (!productsSection) return;

    // Create search bar if it doesn't exist
    if (!document.getElementById('advancedSearchBar')) {
        const searchBar = document.createElement('div');
        searchBar.id = 'advancedSearchBar';
        searchBar.className = 'advanced-search-bar';
        searchBar.innerHTML = `
            <div class="container">
                <div class="search-wrapper">
                    <div class="search-input-group">
                        <i class="fas fa-search"></i>
                        <input 
                            type="text" 
                            id="searchInput" 
                            placeholder="Buscar produtos..."
                            class="search-input"
                        >
                        <button id="clearSearchBtn" class="clear-search-btn" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="search-filters">
                        <select id="sortSelect" class="filter-select">
                            <option value="popular">Mais Populares</option>
                            <option value="newest">Mais Novos</option>
                            <option value="price-asc">Preço: Menor para Maior</option>
                            <option value="price-desc">Preço: Maior para Menor</option>
                            <option value="rating">Melhor Avaliação</option>
                        </select>
                    </div>
                </div>
                <div class="search-results-info" id="searchResultsInfo"></div>
            </div>
        `;

        // Insert after section header
        const sectionHeader = document.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.parentNode.insertBefore(searchBar, sectionHeader.nextSibling);
        }

        // Add styles
        if (!document.getElementById('advanced-search-styles')) {
            const styles = document.createElement('style');
            styles.id = 'advanced-search-styles';
            styles.textContent = `
                .advanced-search-bar {
                    background: var(--gray-50);
                    padding: 1.5rem 0;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--gray-200);
                }

                .search-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .search-input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .search-input-group i {
                    position: absolute;
                    left: 1rem;
                    color: var(--gray-400);
                }

                .search-input {
                    flex: 1;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    border: 1px solid var(--gray-300);
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: all 0.2s;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .clear-search-btn {
                    position: absolute;
                    right: 1rem;
                    background: none;
                    color: var(--gray-400);
                    cursor: pointer;
                    font-size: 1.25rem;
                    transition: all 0.2s;
                }

                .clear-search-btn:hover {
                    color: var(--gray-600);
                }

                .search-filters {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .filter-select {
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--gray-300);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--primary);
                }

                .search-results-info {
                    font-size: 0.875rem;
                    color: var(--gray-600);
                    padding: 0.5rem 0;
                }

                @media (max-width: 768px) {
                    .search-filters {
                        flex-direction: column;
                    }

                    .filter-select {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Set up event listeners
    setupSearchListeners();
}

// Set up search event listeners
function setupSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const resultsInfo = document.getElementById('searchResultsInfo');

    if (!searchInput) return;

    // Search input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        if (query.length > 0) {
            clearBtn.style.display = 'block';
            productFilter.search(query);
        } else {
            clearBtn.style.display = 'none';
            productFilter.reset();
        }

        renderFilteredProducts();
        updateResultsInfo();
    });

    // Clear search
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            productFilter.reset();
            renderFilteredProducts();
            updateResultsInfo();
        });
    }

    // Sort
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            productFilter.sort(e.target.value);
            renderFilteredProducts();
        });
    }

    // Update results info
    function updateResultsInfo() {
        const count = productFilter.getCount();
        const baseList = Array.isArray(window.products) ? window.products : products;
        const total = baseList.length;
        
        if (count !== total) {
            resultsInfo.innerHTML = `Mostrando <strong>${count}</strong> de <strong>${total}</strong> produtos`;
        } else {
            resultsInfo.innerHTML = `Total de <strong>${total}</strong> produtos`;
        }
    }

    updateResultsInfo();
}

// Render filtered products
function renderFilteredProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filtered = productFilter.getResults();
    const currentCurrency = localStorage.getItem('currency') || 'USD';

    if (filtered.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <p style="color: var(--gray-500);">Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image" onclick="showProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" loading="lazy" style="cursor: pointer;">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price, currentCurrency)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show advanced filters modal
function showAdvancedFiltersModal() {
    const priceRange = productFilter.getPriceRange();
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'advancedFiltersModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-filter"></i> Filtros Avançados</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <!-- Price Range -->
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 1rem;">
                        Faixa de Preço: $<span id="priceMin">${Math.floor(priceRange.min)}</span> - $<span id="priceMax">${Math.ceil(priceRange.max)}</span>
                    </label>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <input 
                            type="number" 
                            id="filterPriceMin" 
                            placeholder="Preço mínimo"
                            min="${priceRange.min}"
                            max="${priceRange.max}"
                            value="${priceRange.min}"
                            style="flex: 1; padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 0.5rem;"
                        >
                        <input 
                            type="number" 
                            id="filterPriceMax" 
                            placeholder="Preço máximo"
                            min="${priceRange.min}"
                            max="${priceRange.max}"
                            value="${priceRange.max}"
                            style="flex: 1; padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 0.5rem;"
                        >
                    </div>
                </div>

                <!-- Rating Filter -->
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 1rem;">Avaliação Mínima</label>
                    <div style="display: flex; gap: 0.5rem;">
                        ${[1, 2, 3, 4, 5].map(rating => `
                            <button 
                                class="rating-filter-btn ${rating === 1 ? 'active' : ''}"
                                onclick="filterByRating(${rating}, this)"
                                style="
                                    padding: 0.5rem 1rem;
                                    border: 2px solid var(--gray-300);
                                    border-radius: 0.5rem;
                                    background: white;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                "
                            >
                                ${rating}+ <i class="fas fa-star"></i>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Categories -->
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 1rem;">Categorias</label>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="all" checked onchange="filterByCategory('all')">
                            Todas
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="iphone" onchange="filterByCategory('iphone')">
                            iPhone & Acessórios
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="audio" onchange="filterByCategory('audio')">
                            Áudio
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="power" onchange="filterByCategory('power')">
                            Carregadores
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="storage" onchange="filterByCategory('storage')">
                            Armazenamento
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="security" onchange="filterByCategory('security')">
                            Segurança
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="radio" name="category" value="crypto" onchange="filterByCategory('crypto')">
                            Cripto
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fechar</button>
                <button class="btn btn-primary" onclick="applyAdvancedFilters(); this.closest('.modal').remove()">Aplicar Filtros</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Filter functions
function filterByRating(rating, btn) {
    document.querySelectorAll('.rating-filter-btn').forEach(b => {
        b.style.borderColor = 'var(--gray-300)';
        b.style.background = 'white';
    });
    btn.style.borderColor = 'var(--primary)';
    btn.style.background = 'var(--primary)';
    btn.style.color = 'white';
}

function filterByCategory(category) {
    productFilter.filterByCategory(category);
    renderFilteredProducts();
    document.getElementById('advancedFiltersModal').remove();
}

function applyAdvancedFilters() {
    const minPrice = parseFloat(document.getElementById('filterPriceMin').value) || 0;
    const maxPrice = parseFloat(document.getElementById('filterPriceMax').value) || Infinity;

    productFilter.filterByPrice(minPrice, maxPrice);
    renderFilteredProducts();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay to ensure products are loaded
    setTimeout(initializeAdvancedSearch, 100);
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductFilter, productFilter };
}
