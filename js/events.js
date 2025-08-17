// Events page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initEventRegistration();
});

// Event registration functionality
function initEventRegistration() {
    const registerBtns = document.querySelectorAll('.register-btn');
    
    registerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('.event-title').textContent;
            const eventDate = eventCard.querySelector('.event-date').textContent;
            const eventPrice = eventCard.querySelector('.detail-item:last-child span').textContent;
            
            showRegistrationModal(eventTitle, eventDate, eventPrice);
        });
    });
}

function showRegistrationModal(title, date, price) {
    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h2>Event Registration</h2>
                </div>
                <div class="modal-body">
                    <div class="event-summary">
                        <h3>${title}</h3>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Price:</strong> ${price}</p>
                    </div>
                    <form class="registration-form">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="participants">Number of Participants</label>
                            <select id="participants" name="participants">
                                <option value="1">1 Person</option>
                                <option value="2">2 People</option>
                                <option value="3">3 People</option>
                                <option value="4">4 People</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dietary">Dietary Restrictions or Special Requests</label>
                            <textarea id="dietary" name="dietary" rows="3" placeholder="Please let us know about any allergies or special requirements..."></textarea>
                        </div>
                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="newsletter" name="newsletter">
                                <span class="checkmark"></span>
                                Subscribe to our newsletter for event updates
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="cancel-btn">Cancel</button>
                            <button type="submit" class="submit-btn">Register & Pay</button>
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

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Form submission
    const form = modal.querySelector('.registration-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration(form, title);
    });

    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
}

function handleRegistration(form, eventTitle) {
    const formData = new FormData(form);
    const registrationData = {
        event: eventTitle,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        participants: formData.get('participants'),
        dietary: formData.get('dietary'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString()
    };

    // Store registration data (in a real app, this would be sent to a server)
    let registrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
    registrations.push(registrationData);
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

    // Show success message
    showSuccessMessage(registrationData);
}

function showSuccessMessage(data) {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Registration Successful!</h2>
                <p>Thank you, ${data.fullName}! Your registration for <strong>${data.event}</strong> has been confirmed.</p>
                <div class="next-steps">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>You'll receive a confirmation email shortly</li>
                        <li>Payment instructions will be included</li>
                        <li>Event details and location map will be provided</li>
                    </ul>
                </div>
                <button class="close-success-btn">Close</button>
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

    // Remove the registration modal first
    const registrationModal = document.querySelector('.registration-modal');
    if (registrationModal) {
        document.body.removeChild(registrationModal);
    }

    document.body.appendChild(successModal);

    // Close success modal
    const closeSuccessBtn = successModal.querySelector('.close-success-btn');
    closeSuccessBtn.addEventListener('click', function() {
        document.body.removeChild(successModal);
        document.body.style.overflow = '';
    });
}
