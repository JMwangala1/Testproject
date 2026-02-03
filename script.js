document.addEventListener('DOMContentLoaded', () => {

    /* ================================
       NAVBAR + STICKY + SCROLL EFFECTS
    ================================= */

    const navbar = document.getElementById('navbar');
    const navMenu = document.querySelector('.nav-menu');
    const activeLink = document.querySelector('.nav-item.active');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;

        /* Sticky nav (NO visual movement) */
        if (navMenu) {
            navMenu.classList.toggle('is-sticky', window.scrollY > 1);
        }

        /* Navbar padding & shadow */
        if (navbar) {
            navbar.style.padding = scrolled ? '10px 0' : '15px 0';
            navbar.style.boxShadow = scrolled
                ? '0 2px 15px rgba(0,0,0,0.1)'
                : '0 2px 10px rgba(0,0,0,0.05)';

            navbar.classList.toggle('scrolled', scrolled);
        }

        /* Remove white HOME box on scroll */
        if (scrolled && activeLink) {
            activeLink.classList.remove('active');
        }

        /* Restore HOME at top */
        if (!scrolled) {
            const homeLink = document.querySelector('.nav-links li:first-child');
            if (homeLink) homeLink.classList.add('active');
        }
    });

    /* ================================
       MOBILE HAMBURGER MENU
    ================================= */

    const hamburger = document.querySelector('.hamburger');
    const menuBar = document.querySelector('.menu-bar');

    if (hamburger && menuBar) {
        hamburger.addEventListener('click', () => {
            menuBar.classList.toggle('mobile-open');
        });
    }

    /* ================================
       FORMSPREE FORM SUBMISSION
    ================================= */

    const bookingForm = document.getElementById('bookingForm');
    const msgBox = document.getElementById('formMessage');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            msgBox.innerHTML = '';

            const formData = new FormData(this);

            try {
                const response = await fetch(this.action, {
                    method: this.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    msgBox.innerHTML = 'Thank you! Your inquiry has been sent successfully.';
                    msgBox.style.color = 'green';

                    this.reset();
                    submitBtn.innerText = 'Sent ✔';
                    submitBtn.style.backgroundColor = 'green';
                } else {
                    msgBox.innerHTML = 'Oops! There was a problem submitting your form.';
                    msgBox.style.color = 'red';
                }

            } catch (error) {
                msgBox.innerHTML = 'Network error. Please try again later.';
                msgBox.style.color = 'red';
            }

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.backgroundColor = '';
            }, 5000);
        });
    }

});
