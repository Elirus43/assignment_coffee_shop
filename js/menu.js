// Ensure a mobile-only Cart link exists in the burger menu on all pages
function ensureMobileCartLink() {
    const navList = document.querySelector('.nav-list');
    if (!navList) return;
    const hasCart = navList.querySelector('li.mobile-only a[href$="cart.html"]');
    if (!hasCart) {
        const li = document.createElement('li');
        li.className = 'mobile-only';
        const a = document.createElement('a');
        a.href = 'cart.html';
        a.className = 'nav-link';
        li.appendChild(a);
        navList.appendChild(li);
    }
}

// Hamburger menu functionality for all pages
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    if (!mobileToggle || !navList) return;

    mobileToggle.addEventListener('click', function() {
        navList.classList.toggle('mobile-active');
        // Toggle icon
        const icon = this.querySelector('i');
        if (navList.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('mobile-active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Global Search: auto-matching filter
function initGlobalSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    if (!searchBox || !searchInput || !searchBtn) return;
    if (searchBox.dataset.searchInit === '1') return; // guard against duplicate init
    searchBox.dataset.searchInit = '1';

    function debounce(fn, wait) {
        let t;
        return function(...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        }
    }

    function getCards() {
        const products = Array.from(document.querySelectorAll('.product-card'));
        const equipment = Array.from(document.querySelectorAll('.equipment-card'));
        return products.concat(equipment);
    }

    function matchText(card) {
        const parts = [];
        const pick = (sel) => card.querySelector(sel)?.textContent || '';
        // Coffee product fields
        parts.push(pick('.product-name'));
        parts.push(pick('.product-description'));
        parts.push(pick('.roast-level'));
        parts.push(pick('.origin'));
        parts.push(...Array.from(card.querySelectorAll('.note')).map(n => n.textContent));
        parts.push(...Array.from(card.querySelectorAll('.method')).map(m => m.textContent));
        // Equipment fields
        parts.push(pick('.equipment-name'));
        parts.push(pick('.equipment-description'));
        parts.push(pick('.usage-tip'));
        return parts.join(' ').toLowerCase();
    }

    function applyFilter(q) {
        const query = q.trim().toLowerCase();
        const cards = getCards();
        if (!cards.length) return;
        if (!query) {
            cards.forEach(c => c.style.display = 'block');
            return;
        }
        cards.forEach(card => {
            const text = matchText(card);
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    }

    const run = debounce((val) => applyFilter(val), 150);

    // Live filter as user types
    searchInput.addEventListener('input', () => {
        run(searchInput.value);
    });

    // Button acts as clear
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = '';
        applyFilter('');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    ensureMobileCartLink();
    initMobileMenu();
    initGlobalSearch();
});
