// Popup functionality
        const popup = document.getElementById('emailPopup');
        const closeBtn = document.getElementById('closePopup');
        const form = document.getElementById('emailSubscriptionForm');
        const emailInput = document.getElementById('emailInput');
        const submitBtn = form.querySelector('.popup-submit-btn');

        // Show popup function
        function showPopup() {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        // Hide popup function
        function hidePopup() {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Reset form after animation completes
            setTimeout(() => {
                resetForm();
            }, 300);
        }

        // Reset form to initial state
        function resetForm() {
            form.reset();
            submitBtn.classList.remove('btn-loading');
            
            // Reset to original form content if it was changed to success state
            const popupContent = document.querySelector('.popup-content');
            if (popupContent.querySelector('.popup-success')) {
                location.reload(); // Simple way to reset - in production you'd restore the original HTML
            }
        }

        // Close popup when clicking the X button
        closeBtn.addEventListener('click', hidePopup);

        // Close popup when clicking outside of it
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePopup();
            }
        });

        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                hidePopup();
            }
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                emailInput.focus();
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                emailInput.focus();
                return;
            }

            // Show loading state
            submitBtn.classList.add('btn-loading');
            
            try {
                // Simulate API call
                await simulateAPICall(email);
                
                // Show success state
                showSuccessState();
                
                // Auto-close after 3 seconds
                setTimeout(() => {
                    hidePopup();
                }, 3000);
                
            } catch (error) {
                console.error('Subscription error:', error);
                alert('Something went wrong. Please try again.');
                submitBtn.classList.remove('btn-loading');
            }
        });

        // Simulate API call
        function simulateAPICall(email) {
            return new Promise((resolve) => {
                console.log('Subscribing email:', email);
                // Simulate network delay
                setTimeout(resolve, 1500);
            });
        }

        // Show success state
        function showSuccessState() {
            const popupContent = document.querySelector('.popup-content');
            popupContent.innerHTML = `
                <div class="popup-success">
                    <div class="success-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <h2 class="success-title">Welcome from Bean Boutique!</h2>
                    <p class="success-message">
                        Thank you for subscribing! Check your email for your 15% discount code. 
                        We'll be in touch with exclusive offers and coffee tips.
                    </p>
                </div>
            `;
        }
        
       window.addEventListener('load', () => {
    if (!localStorage.getItem('popupShown')) {
        setTimeout(() => {
            showPopup();
            localStorage.setItem('popupShown', 'true');
        }, 3000); // Show after 2 seconds
    }
});
