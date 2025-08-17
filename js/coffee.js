// Coffee page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initCoffeeFilters();
    initQuickView();
    applySearchFromLanding();
});

// Apply search query from other pages to filter and show results banner
function applySearchFromLanding() {
    const q = (localStorage.getItem('searchQuery') || '').trim().toLowerCase();
    if (!q) return;

    // Filter visible products by name, description, origin, roast, notes, and methods
    const cards = Array.from(document.querySelectorAll('.product-card'));
    const matched = [];
    cards.forEach(card => {
        const text = [
            card.querySelector('.product-name')?.textContent || '',
            card.querySelector('.product-description')?.textContent || '',
            card.querySelector('.roast-level')?.textContent || '',
            card.querySelector('.origin')?.textContent || '',
            ...Array.from(card.querySelectorAll('.note')).map(n => n.textContent),
            ...Array.from(card.querySelectorAll('.method')).map(m => m.textContent)
        ].join(' ').toLowerCase();
        const isMatch = text.includes(q);
        card.style.display = isMatch ? 'block' : 'none';
        if (isMatch) matched.push(card);
    });

    // Insert search results banner above grid
    const productsSection = document.querySelector('.products .container');
    if (!productsSection) return;

    let banner = document.querySelector('.search-results-message');
    if (!banner) {
        banner = document.createElement('div');
        banner.className = 'search-results-message';
        banner.innerHTML = `
          <div class="search-results-content">
            <h3></h3>
            <p></p>
            <button class="clear-search-btn" type="button">Clear</button>
          </div>
        `;
        productsSection.prepend(banner);
    }
    const title = banner.querySelector('h3');
    const subtitle = banner.querySelector('p');
    title.textContent = `Results for: "${q}"`;
    subtitle.textContent = matched.length ? `${matched.length} item(s) found` : 'No matching items';

    // Clear button restores all items and removes searchQuery
    const clearBtn = banner.querySelector('.clear-search-btn');
    clearBtn.onclick = () => {
        localStorage.removeItem('searchQuery');
        document.querySelectorAll('.product-card').forEach(c => c.style.display = 'block');
        banner.remove();
    };
}

// Filter functionality
function initCoffeeFilters() {
    const roastFilter = document.getElementById('roast-filter');
    const originFilter = document.getElementById('origin-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productsGrid = document.getElementById('products-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    // Add event listeners to all filters
    [roastFilter, originFilter, priceFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    function applyFilters() {
        let filteredProducts = [...productCards];

        // Apply roast filter
        const roastValue = roastFilter.value;
        if (roastValue) {
            filteredProducts = filteredProducts.filter(card => 
                card.dataset.roast === roastValue
            );
        }

        // Apply origin filter
        const originValue = originFilter.value;
        if (originValue) {
            filteredProducts = filteredProducts.filter(card => 
                card.dataset.origin === originValue
            );
        }

        // Apply price filter
        const priceValue = priceFilter.value;
        if (priceValue) {
            const [minPrice, maxPrice] = priceValue.split('-').map(Number);
            filteredProducts = filteredProducts.filter(card => {
                const price = parseFloat(card.dataset.price);
                return price >= minPrice && price <= maxPrice;
            });
        }

        // Apply sorting
        const sortValue = sortFilter.value;
        filteredProducts.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.querySelector('.product-name').textContent.localeCompare(
                        b.querySelector('.product-name').textContent
                    );
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'rating':
                    // For demo purposes, sort by rating count
                    const aRating = parseInt(a.querySelector('.rating-count').textContent.match(/\d+/)[0]);
                    const bRating = parseInt(b.querySelector('.rating-count').textContent.match(/\d+/)[0]);
                    return bRating - aRating;
                default:
                    return 0;
            }
        });

        // Update DOM order and visibility so grid reflects the sort order
        productCards.forEach(card => {
            card.style.display = 'none';
        });

        if (filteredProducts.length === 0) {
            showNoResultsMessage();
            return;
        }
        hideNoResultsMessage();

        // Re-append in sorted order and make them visible
        filteredProducts.forEach(card => {
            card.style.display = 'block';
            productsGrid.appendChild(card);
        });
    }

    function showNoResultsMessage() {
        let noResultsMsg = document.querySelector('.no-results-message');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters to see more results.</p>
                </div>
            `;
            noResultsMsg.style.cssText = `
                text-align: center;
                padding: 4rem 2rem;
                grid-column: 1 / -1;
            `;
            productsGrid.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    }

    function hideNoResultsMessage() {
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Quick view functionality
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            showQuickView(productCard);
        });
    });

    function showQuickView(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        const roastLevel = productCard.querySelector('.roast-level').textContent;
        const origin = productCard.querySelector('.origin').textContent;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="${productImage}" alt="${productName}">
                        </div>
                        <div class="modal-info">
                            <h2>${productName}</h2>
                            <div class="modal-price">${productPrice}</div>
                            <p class="modal-description">${productDescription}</p>
                            <div class="modal-details">
                                <div class="detail-item">
                                    <strong>Roast Level:</strong> ${roastLevel}
                                </div>
                                <div class="detail-item">
                                    <strong>Origin:</strong> ${origin}
                                </div>
                                <div class="detail-item">
                                    <strong>Grind Options:</strong> Whole Bean, Fine, Medium, Coarse
                                </div>
                                <div class="detail-item">
                                    <strong>Size:</strong> 12oz bag
                                </div>
                            </div>
                            <div class="modal-actions">
                                <div class="quantity-selector">
                                    <label for="quantity">Quantity:</label>
                                    <select id="quantity">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <button class="add-to-cart-btn modal-add-to-cart">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Add to cart from modal
        const modalAddToCart = modal.querySelector('.modal-add-to-cart');
        modalAddToCart.addEventListener('click', function() {
            const quantityEl = modal.querySelector('#quantity');
            const qty = parseInt(quantityEl ? quantityEl.value : '1', 10) || 1;
            const price = parseFloat(String(productPrice).replace(/[^0-9.]/g, '')) || 0;
            const item = {
                id: Date.now(),
                name: productName,
                price: price,
                image: productImage,
                quantity: qty,
                description: productDescription,
                roast: roastLevel,
                origin: origin
            };
            if (window.addToCart) {
                window.addToCart(item);
            } else {
                // Fallback: direct localStorage update
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existing = cart.find(p => p.name === item.name);
                if (existing) {
                    existing.quantity = (existing.quantity || 1) + qty;
                } else {
                    cart.push(item);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                if (window.updateCartCount) window.updateCartCount();
            }
            closeModal();
        });

        function closeModal() {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    }
}

// Add modal styles to the page
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        z-index: 1;
    }

    .modal-close:hover {
        color: #333;
    }

    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }

    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 10px;
    }

    .modal-info h2 {
        color: #2c1810;
        margin-bottom: 1rem;
        font-size: 1.8rem;
    }

    .modal-price {
        font-size: 1.8rem;
        font-weight: bold;
        color: #d4a574;
        margin-bottom: 1rem;
    }

    .modal-description {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .modal-details {
        margin-bottom: 2rem;
    }

    .detail-item {
        margin-bottom: 0.5rem;
        color: #555;
    }

    .detail-item strong {
        color: #2c1810;
    }

    .modal-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .quantity-selector select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: white;
    }

    .modal-add-to-cart {
        flex: 1;
        max-width: 200px;
    }

    @media (max-width: 768px) {
        .modal-body {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
        }
        
        .modal-actions {
            flex-direction: column;
            align-items: stretch;
        }
        
        .modal-add-to-cart {
            max-width: none;
        }
    }
`;
document.head.appendChild(modalStyles);