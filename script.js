// 1. Navbar Scroll Effect (Context of Use)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0'; // Compact on scroll
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    } else {
        navbar.style.padding = '15px 0'; // Expanded at top
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});

// REAL FORMSPREE INTEGRATION
const bookingForm = document.getElementById('bookingForm');
const msgBox = document.getElementById('formMessage');

if(bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the page from reloading
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;

        // 1. Visual Feedback: Show "Sending..."
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        msgBox.innerHTML = ''; // Clear previous messages

        // 2. Gather Data and Send to Formspree
        const formData = new FormData(this);
        
        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // 3. Handle Success
            if (response.ok) {
                msgBox.innerHTML = 'Thank you! Your inquiry has been sent successfully.';
                msgBox.className = 'feedback-msg success'; // Ensure CSS styles this green
                msgBox.style.color = 'green';
                
                this.reset(); // Clear the form fields
                
                submitBtn.innerText = 'Sent ✔';
                submitBtn.style.backgroundColor = 'green';
            } 
            // 4. Handle Errors (Validation or Network)
            else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    msgBox.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    msgBox.innerHTML = "Oops! There was a problem submitting your form.";
                }
                msgBox.style.color = 'red';
            }
        } catch (error) {
            msgBox.innerHTML = "Network error. Please try again later.";
            msgBox.style.color = 'red';
        }

        // 5. Reset Button after delay
        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.backgroundColor = ''; // Reverts to CSS default
        }, 5000);
    });
}

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    // Select the item that has the 'active' class (Home)
    const activeLink = document.querySelector('.nav-item.active');

    if (window.scrollY > 50) {
        // 1. Add Scrolled Class
        navbar.classList.add('scrolled');
        
        // 2. Remove the White Box from 'Home' when scrolling
        if(activeLink) {
            activeLink.classList.remove('active');
        }
    } else {
        // 3. Back to Top: Remove scrolled class
        navbar.classList.remove('scrolled');
        
        // Optional: If you want Home to turn white again when you reach the top:
        const homeLink = document.querySelector('.nav-links li:first-child a');
        if(homeLink) homeLink.classList.add('active');
    }
});