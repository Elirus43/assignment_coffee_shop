// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSlider();
    initCart();
    initSearch();
    initBackToTop();

});

// Image Slider Functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Start auto slide
    startAutoSlide();
}

// Cart Functionality
function initCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.coffee-card');
            const product = {
                id: Date.now(),
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price').textContent,
                image: card.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
        }
    });

    function addToCart(product) {
        // Check if product already exists in cart
        const existingProduct = cart.find(item => item.name === product.name);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCartNotification(product.name);
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function showCartNotification(productName) {
        // Create or get notification container
        let container = document.querySelector('.cart-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'cart-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                z-index: 1001;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;
        notification.style.cssText = `
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 220px;
            animation: slideInRight 0.3s ease;
        `;

        // Add notification to container (newest at bottom)
        container.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                    // If container is empty, remove it
                    if (container.children.length === 0) {
                        container.parentNode.removeChild(container);
                    }
                }
            }, 300);
        }, 3000);
    }
}

// Back To Top Functionality
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    };

    // Initial state
    toggleVisibility();

    // Show/hide on scroll
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    // Smooth scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Store search query and redirect to coffee page
            localStorage.setItem('searchQuery', query);
            window.location.href = 'coffee.html';
        }
    }

    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Search suggestions (basic implementation)
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        // This could be expanded to show dropdown suggestions
    });
}



// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-list.mobile-active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #2c1810;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    @media (max-width: 768px) {
        .nav-list {
            display: none;
        }
    }
`;
document.head.appendChild(style);
