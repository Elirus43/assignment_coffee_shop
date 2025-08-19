// Cart functionality bootstrap for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize global cart handlers once
    initCart();

    // Only run cart-page specific logic when relevant elements exist
    if (document.getElementById('cart-items')) {
        loadCartItems();
        initDiscountCode();
        initCheckout();
        initClearCart();
    }

    if (document.getElementById('recommended-grid')) {
        loadRecommendedProducts();
    }
});

// Load cart items from localStorage
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        showEmptyCart();
        updateCartSummary();
        return;
    }

    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    const unitPrice = typeof item.price === 'number' ? item.price : (parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0);
    const lineTotal = unitPrice * (item.quantity || 1);
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <h4>${item.name}</h4>
        </div>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="cart-item-price">
            ${lineTotal.toFixed(2)}
        </div>
        <button class="remove-item" onclick="removeItem(${index})" aria-label="Remove item">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return cartItem;
}

function showEmptyCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a href="coffee.html" class="shop-now-btn">Start Shopping</a>
        </div>
    `;
    
    // Hide checkout button when cart is empty
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.style.display = 'none';
    }
}

// Update item quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems(); // Reload the cart display
    }
}

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

// Update cart summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // When cart is empty, zero out all summary values and hide discount/checkout
    if (cart.length === 0) {
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping');
        const taxEl = document.getElementById('cart-tax');
        const totalEl = document.getElementById('cart-total');
        const discountRow = document.getElementById('discount-row');
        const discountValueEl = document.getElementById('cart-discount');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (subtotalEl) subtotalEl.textContent = '0.00';
        if (shippingEl) shippingEl.textContent = '0.00';
        if (taxEl) taxEl.textContent = '0.00';
        if (totalEl) totalEl.textContent = '0.00';
        if (discountRow) discountRow.style.display = 'none';
        if (discountValueEl) discountValueEl.textContent = '0.00';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const price = typeof item.price === 'number' ? item.price : (parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0);
        const qty = item.quantity || 1;
        subtotal += price * qty;
    });

    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax

    // Check for applied discount
    const appliedDiscount = JSON.parse(localStorage.getItem('appliedDiscount')) || null;
    let discount = 0;

    const discountRow = document.getElementById('discount-row');
    const discountValueEl = document.getElementById('cart-discount');

    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            discount = subtotal * (appliedDiscount.value / 100);
        } else if (appliedDiscount.type === 'shipping') {
            // For shipping discount, we handle by setting shipping cost to 0
        } else {
            discount = appliedDiscount.value;
        }
        if (discountRow) discountRow.style.display = 'flex';
        if (discountValueEl) discountValueEl.textContent = `-${discount.toFixed(2)}`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    const total = subtotal + shipping + tax - discount;

    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)}`;

    // Show/hide checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Load recommended products
function loadRecommendedProducts() {
    const recommendedProducts = [
        {
            name: 'Sunset Roast',
            price: 19.99,
            image: '../imgs/coffee2.jpg'
        },
        {
            name: 'Ethiopian Bloom',
            price: 13.99,
            image: '../imgs/coffee3.webp'
        },
        {
            name: 'Premium French Press',
            price: 49.99,
            image: '../imgs/FrenchPress.png'
        }
    ];

    const recommendedGrid = document.getElementById('recommended-grid');
    if (!recommendedGrid) return;
    recommendedGrid.innerHTML = '';

    recommendedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'recommended-item';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="recommended-info">
                <h5>${product.name}</h5>
                <div class="recommended-price">${product.price}</div>
                <button class="add-recommended-btn" onclick="addRecommendedToCart('${product.name}', ${product.price}, '${product.image}')">
                    Add to Cart
                </button>
            </div>
        `;
        recommendedGrid.appendChild(productElement);
    });
}

// Cart Functionality
function initCart() {
    if (window.__cartInitialized) return;
    window.__cartInitialized = true;

    updateCartCount();

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const card = btn.closest('.coffee-card, .product-card, .equipment-card');
            if (!card) return;

            const nameEl = card.querySelector('h3, .cart-product-title');
            const priceEl = card.querySelector('.price, .cart-price, .product-price, .equipment-price');
            const imgEl = card.querySelector('img');

            const name = nameEl ? nameEl.textContent.trim() : 'Product';
            const priceText = priceEl ? priceEl.textContent : '0';
            const price = parseFloat(String(priceText).replace(/[^0-9.]/g, '')) || 0;
            const image = imgEl ? imgEl.src : '';

            const product = {
                id: Date.now(),
                name,
                price,
                image,
                quantity: 1
            };
            addToCart(product);
        }
    });
}

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
        // Normalize price to number
        existing.price = typeof existing.price === 'number' ? existing.price : (parseFloat(String(existing.price).replace(/[^0-9.]/g, '')) || 0);
    } else {
        // Normalize price to number
        product.price = typeof product.price === 'number' ? product.price : (parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0);
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartNotification(product.name);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
}

function showCartNotification(productName) {
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

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
                if (container.children.length === 0) {
                    container.parentNode.removeChild(container);
                }
            }
        }, 300);
    }, 3000);
}

// Add recommended product to cart
function addRecommendedToCart(name, price, image) {
    const item = {
        name: name,
        price: price,
        image: image,
        quantity: 1,
        description: 'Premium coffee blend'
    };

    addToCart(item);
    updateCartCount();
    loadCartItems(); // Refresh cart display
}

// Discount code functionality
function initDiscountCode() {
    const applyBtn = document.getElementById('apply-discount');
    const discountInput = document.getElementById('discount-code');
    if (!applyBtn || !discountInput) return;

    // Check if there's an active discount code from special offers
    const activeCode = localStorage.getItem('activeDiscountCode');
    if (activeCode) {
        discountInput.value = activeCode;
        localStorage.removeItem('activeDiscountCode'); // Remove after using
    }

    applyBtn.addEventListener('click', applyDiscountCode);

    discountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyDiscountCode();
        }
    });
}

function applyDiscountCode() {
    const code = document.getElementById('discount-code').value.trim().toUpperCase();
    const messageDiv = document.getElementById('discount-message');
    
    // Valid discount codes
    const discountCodes = {
        'SUBSCRIBE30': { type: 'percentage', value: 30, description: '30% off subscription' },
        'BUY2GET1': { type: 'percentage', value: 20, description: '20% off (Buy 2 Get 1 equivalent)' },
        'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' },
        'BREW25': { type: 'percentage', value: 25, description: '25% off brewing equipment' },
        'STUDENT20': { type: 'percentage', value: 20, description: '20% student discount' },
        'DOUBLE': { type: 'percentage', value: 10, description: '10% loyalty bonus' },
        'WELCOME10': { type: 'percentage', value: 10, description: '10% welcome discount' }
    };
    
    if (discountCodes[code]) {
        const discount = discountCodes[code];
        localStorage.setItem('appliedDiscount', JSON.stringify(discount));
        
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> Discount applied: ${discount.description}`;
        messageDiv.className = 'discount-message success';
        
        updateCartSummary();
    } else {
        messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> Invalid discount code`;
        messageDiv.className = 'discount-message error';
        
        // Clear any existing discount
        localStorage.removeItem('appliedDiscount');
        updateCartSummary();
    }
}

// Clear all items functionality
function initClearCart() {
    const clearBtn = document.getElementById('clear-cart-btn');
    if (!clearBtn) return;
    clearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedDiscount');
        updateCartCount();
        loadCartItems();
        updateCartSummary();
    });
}

// Checkout functionality
function initCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.innerHTML = 'Proceed Checkout';
        checkoutBtn.addEventListener('click', proceedToCheckout);
        // Prepare reCAPTCHA container and preload script to avoid double-click
        ensureRecaptchaSection();
        loadRecaptchaScript();
    }
}

// reCAPTCHA integration helpers
const recaptcha = { widgetId: null, verified: false };

function ensureRecaptchaSection() {
    const btn = document.getElementById('checkout-btn');
    if (!btn) return null;
    let section = document.getElementById('recaptcha-section');
    if (!section) {
        section = document.createElement('div');
        section.id = 'recaptcha-section';
        section.style.cssText = 'margin-top: 12px; display: none;';
        const label = document.createElement('div');
        label.textContent = 'Verify you are human to continue';
        label.style.cssText = 'font-size: 0.9rem; margin-bottom: 8px; color: #555;';
        const container = document.createElement('div');
        container.id = 'recaptcha-container';
        section.appendChild(label);
        section.appendChild(container);
        btn.insertAdjacentElement('afterend', section);
    }
    return section;
}

function showRecaptcha() {
    const section = ensureRecaptchaSection();
    if (!section) return;
    section.style.display = 'block';
    if (typeof grecaptcha !== 'undefined') {
        renderRecaptcha();
    } else {
        loadRecaptchaScript();
    }
}

function loadRecaptchaScript() {
    if (document.getElementById('recaptcha-api')) return;
    const s = document.createElement('script');
    s.id = 'recaptcha-api';
    s.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    s.async = true;
    s.defer = true;
    s.onload = function() {
        renderRecaptcha();
    };
    document.head.appendChild(s);
}

function renderRecaptcha() {
    if (recaptcha.widgetId !== null) return;
    const container = document.getElementById('recaptcha-container');
    if (!container) return;
    recaptcha.widgetId = grecaptcha.render(container, {
        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google test site key for development
        callback: onRecaptchaSuccess,
        'expired-callback': onRecaptchaExpired
    });
}

function onRecaptchaSuccess(token) {
    const section = document.getElementById('recaptcha-section');
    if (section) section.style.display = 'none';
    showCheckoutModal();
    // Reset so the challenge appears again on next click
    if (typeof grecaptcha !== 'undefined' && recaptcha.widgetId !== null) {
        grecaptcha.reset(recaptcha.widgetId);
    }
    recaptcha.verified = false;
}

function onRecaptchaExpired() {
    recaptcha.verified = false;
    if (typeof grecaptcha !== 'undefined' && recaptcha.widgetId !== null) {
        grecaptcha.reset(recaptcha.widgetId);
    }
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before checkout.');
        return;
    }
    
    // Always show reCAPTCHA on click
    showRecaptcha();
}

function showCheckoutModal() {
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <div class="modal-header">
                    <i class="fas fa-credit-card"></i>
                    <h2>Proceed Checkout</h2>
                </div>
                <div class="modal-body">
                    <form id="checkout-form" class="checkout-form">
                        <div class="form-row">
                            <input type="text" id="full-name" placeholder="Full Name" required>
                            <input type="email" id="email" placeholder="Email" required>
                        </div>
                        <div class="form-row">
                            <input type="text" id="phone" placeholder="Phone" required>
                        </div>
                        <div class="form-row">
                            <input type="text" id="address" placeholder="Address" required>
                        </div>
                        <div class="form-row">
                            <input type="text" id="city" placeholder="City" required>
                            <input type="text" id="state" placeholder="State/Province" required>
                            <input type="text" id="zip" placeholder="ZIP/Postal" required maxlength="10">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="demo-cancel-btn" id="cancel-checkout">Cancel</button>
                            <button type="submit" class="demo-complete-btn" id="pay-btn">Pay</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

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

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const form = modal.querySelector('#checkout-form');
    const cancelBtn = modal.querySelector('#cancel-checkout');

    function closeCheckoutModal() {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
        document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
        if (e.key === 'Escape') closeCheckoutModal();
    }

    // Bind events
    closeBtn.addEventListener('click', closeCheckoutModal);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCheckoutModal(); });
    if (cancelBtn) cancelBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeCheckoutModal(); });
    document.addEventListener('keydown', onKeydown);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = modal.querySelector('#full-name')?.value.trim();
            const email = modal.querySelector('#email')?.value.trim();
            const phone = modal.querySelector('#phone')?.value.trim();
            const address = modal.querySelector('#address')?.value.trim();
            const city = modal.querySelector('#city')?.value.trim();
            const state = modal.querySelector('#state')?.value.trim();
            const zip = modal.querySelector('#zip')?.value.trim();

            if (!name || !email || !phone || !address || !city || !state || !zip) {
                alert('Please complete all fields.');
                return;
            }

            localStorage.removeItem('cart');
            localStorage.removeItem('appliedDiscount');
            updateCartCount();
            closeCheckoutModal();
            showOrderSuccess();
        });
    }
}

function showOrderSuccess() {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.setAttribute('role', 'dialog');
    successModal.setAttribute('aria-modal', 'true');
    successModal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Successful!</h2>
                <p>Thank you for your order! Your coffee is being prepared and will be shipped soon.</p>
                <div class="order-details">
                    <p><strong>Order #:</strong> AC${Date.now()}</p>
                    <p><strong>Estimated Delivery:</strong> Within Office Hours</p>
                </div>
                <button class="continue-shopping-btn" type="button">Continue Shopping</button>
            </div>
        </div>
    `;

    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2001;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(successModal);
    document.body.style.overflow = 'hidden';

    const overlay = successModal.querySelector('.modal-overlay');
    const closeBtn = successModal.querySelector('.continue-shopping-btn');

    function closeSuccess() {
        if (document.body.contains(successModal)) {
            document.body.removeChild(successModal);
            document.body.style.overflow = '';
            loadCartItems();
        }
        document.removeEventListener('keydown', onKeydown);
    }
    function onKeydown(e) { if (e.key === 'Escape') closeSuccess(); }

    closeBtn.addEventListener('click', closeSuccess);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSuccess(); });
    document.addEventListener('keydown', onKeydown);
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.addRecommendedToCart = addRecommendedToCart;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
