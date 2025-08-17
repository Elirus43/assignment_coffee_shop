// Equipment page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initEquipmentCategories();
    applyEquipmentSearchFromLanding();
});

// Apply search query from other pages to filter equipment and show results
function applyEquipmentSearchFromLanding() {
    const q = (localStorage.getItem('searchQuery') || '').trim().toLowerCase();
    if (!q) return;

    const cards = Array.from(document.querySelectorAll('.equipment-card'));
    const matched = [];
    cards.forEach(card => {
        const name = card.querySelector('.equipment-name')?.textContent || '';
        const desc = card.querySelector('.equipment-description')?.textContent || '';
        const all = `${name} ${desc}`.toLowerCase();
        const isMatch = all.includes(q);
        card.style.display = isMatch ? 'block' : 'none';
        if (isMatch) matched.push(card);
    });

    // Insert search results banner
    const productsContainer = document.querySelector('.products .container');
    if (!productsContainer) return;

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
        productsContainer.prepend(banner);
    }
    const title = banner.querySelector('h3');
    const subtitle = banner.querySelector('p');
    title.textContent = `Results for: "${q}"`;
    subtitle.textContent = matched.length ? `${matched.length} item(s) found` : 'No matching items';

    // Clear button restores all items
    const clearBtn = banner.querySelector('.clear-search-btn');
    clearBtn.onclick = () => {
        localStorage.removeItem('searchQuery');
        document.querySelectorAll('.equipment-card').forEach(c => c.style.display = 'block');
        banner.remove();
    };
}

// Category filtering functionality
function initEquipmentCategories() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const equipmentCards = document.querySelectorAll('.equipment-card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter equipment cards
            equipmentCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // Add animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Add equipment-specific styles
const equipmentStyles = document.createElement('style');
equipmentStyles.textContent = `
    .categories {
        background: #f8f9fa;
        padding: 2rem 0;
        border-bottom: 1px solid #e9ecef;
    }

    .category-tabs {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .category-tab {
        background: white;
        border: 2px solid #ddd;
        color: #666;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .category-tab:hover {
        border-color: #d4a574;
        color: #d4a574;
    }

    .category-tab.active {
        background: #d4a574;
        border-color: #d4a574;
        color: white;
    }

    .equipment-features {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .feature {
        background: #e9ecef;
        color: #495057;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .why-choose {
        background: #f8f9fa;
        padding: 4rem 0;
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .benefit-card {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .benefit-card:hover {
        transform: translateY(-5px);
    }

    .benefit-card i {
        font-size: 2.5rem;
        color: #d4a574;
        margin-bottom: 1rem;
    }

    .benefit-card h3 {
        color: #2c1810;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .benefit-card p {
        color: #666;
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .category-tabs {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 1rem;
        }
        
        .category-tab {
            white-space: nowrap;
            flex-shrink: 0;
        }
    }
`;
document.head.appendChild(equipmentStyles);