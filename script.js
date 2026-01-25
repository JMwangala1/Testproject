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

// 2. Form Submission Simulation (Measurement & Feedback Loop)
const bookingForm = document.getElementById('bookingForm');
const msgBox = document.getElementById('formMessage');

if(bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop actual page reload
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;

        // Change button state to indicate processing (Technical Direction)
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Simulate network request delay (2 seconds)
        setTimeout(() => {
            // Success Feedback
            msgBox.innerHTML = 'Thank you! Your request has been sent securely. We will contact you shortly.';
            msgBox.classList.add('success');
            
            // Reset form
            bookingForm.reset();
            
            // Restore button
            submitBtn.innerText = 'Sent ✔';
            submitBtn.style.backgroundColor = 'green';
            
            // Reset button style after 3 seconds
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                msgBox.innerHTML = '';
            }, 5000);
            
        }, 1500);
    });
}