// Special offers page functionality
document.addEventListener('DOMContentLoaded', function() {
    initCountdownTimer();
    initOfferClaiming();
    initNewsletterSignup();
});

// Countdown timer for featured deal
function initCountdownTimer() {
    const timer = document.getElementById('deal-timer');
    if (!timer) return;

    // Set the date we're counting down to (5 days from now)
    const countDownDate = new Date().getTime() + (5 * 24 * 60 * 60 * 1000);

    const timerInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // If the count down is finished
        if (distance < 0) {
            clearInterval(timerInterval);
            timer.innerHTML = '<div class="timer-expired">Deal Expired</div>';
        }
    }, 1000);
}

// Offer claiming functionality
function initOfferClaiming() {
    const claimBtns = document.querySelectorAll('.claim-offer-btn, .claim-deal-btn');

    claimBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const offerCard = this.closest('.offer-card') || this.closest('.deal-banner');
            if (!offerCard) return;
            const titleEl = offerCard.querySelector('.offer-title') || offerCard.querySelector('h2');
            const offerTitle = titleEl ? titleEl.textContent.trim() : 'Special Offer';
            const offerCodeEl = offerCard.querySelector('.offer-code');
            const code = offerCodeEl ? offerCodeEl.textContent.replace('Code: ', '').trim() : 'SPECIAL';

            showOfferModal(offerTitle, code);
        });
    });
}

function showOfferModal(title, code) {
    const modal = document.createElement('div');
    modal.className = 'offer-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <div class="modal-header">
                    <i class="fas fa-gift"></i>
                    <h2>Claim Your Offer</h2>
                </div>
                <div class="modal-body">
                    <div class="offer-details">
                        <h3>${title}</h3>
                        <div class="code-display">
                            <label>Your Discount Code:</label>
                            <div class="code-box">
                                <span class="code-text" id="offer-code">${code}</span>
                                <button class="copy-btn" type="button">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                        <div class="instructions">
                            <h4>How to use this code:</h4>
                            <ol>
                                <li>Add items to your cart</li>
                                <li>Proceed to checkout</li>
                                <li>Enter the code in the "Discount Code" field</li>
                                <li>Click "Apply" to see your savings</li>
                            </ol>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="shop-now-btn" type="button">Shop Now</button>
                        <button class="save-later-btn" type="button">Save for Later</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Container to ensure overlay covers entire viewport
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const saveLaterBtn = modal.querySelector('.save-later-btn');
    const shopNowBtn = modal.querySelector('.shop-now-btn');
    const copyBtn = modal.querySelector('.copy-btn');

    function closeModal() {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
        document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
        if (e.key === 'Escape') closeModal();
    }

    // Event bindings
    closeBtn.addEventListener('click', closeModal);
    saveLaterBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', onKeydown);

    shopNowBtn.addEventListener('click', function() {
        localStorage.setItem('activeDiscountCode', code);
        closeModal();
        window.location.href = 'coffee.html';
    });

    copyBtn.addEventListener('click', function() {
        const codeText = document.getElementById('offer-code').textContent;
        navigator.clipboard.writeText(codeText).then(function() {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#28a745';
            setTimeout(function() { copyBtn.innerHTML = original; copyBtn.style.background = ''; }, 2000);
        });
    });
}

// Newsletter signup functionality
function initNewsletterSignup() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        const consent = document.getElementById('newsletter-consent').checked;
        
        if (!consent) {
            alert('Please agree to receive promotional emails to subscribe.');
            return;
        }

        // Store subscription (in a real app, this would be sent to a server)
        const subscription = {
            email: email,
            timestamp: new Date().toISOString(),
            source: 'special-offers-page'
        };

        let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
        
        // Check if email already exists
        if (subscribers.some(sub => sub.email === email)) {
            showSubscriptionMessage('You are already subscribed to our newsletter!', 'info');
            return;
        }

        subscribers.push(subscription);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));

        showSubscriptionMessage('Thank you for subscribing! Check your email for a welcome discount code.', 'success');
        form.reset();
    });
}

function showSubscriptionMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `subscription-message ${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(function() {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}
