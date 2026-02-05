           document.addEventListener('DOMContentLoaded', () => {

        /* === SMART STICKY NAV (DESKTOP ONLY) === */
        let lastScrollY = window.scrollY;
        const nav = document.querySelector('.nav-menu');

        window.addEventListener('scroll', () => {

            // Disable sticky logic on mobile
            if (window.innerWidth <= 900) return;

            const currentScroll = window.scrollY;

            // Add sticky state after hero
            if (currentScroll > 100) {
                nav.classList.add('is-sticky');

                // Scroll DOWN → hide nav
                if (currentScroll > lastScrollY) {
                    nav.classList.add('nav-hidden');
                } 
                // Scroll UP → show nav
                else {
                    nav.classList.remove('nav-hidden');
                }

            } else {
                // Back to top
                nav.classList.remove('is-sticky', 'nav-hidden');
            }

            lastScrollY = currentScroll;
        });


    /* ================================
       MOBILE HAMBURGER MENU
    ================================= */

        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

        /* Open Menu */
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('menu-open');
        });

        /* Close Menu (X button) */
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        });

        /* Close menu when clicking any nav item */
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });


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

/* === HERO STAGGERED ANIMATION LOGIC === */
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-content');
    const h1 = hero?.querySelector('h1');
    const p = hero?.querySelector('p');
    const buttons = hero?.querySelectorAll('.hero-btns .btn');

    if (!hero || !h1) return;

    /* Split H1 into lines */
    const lines = h1.innerHTML.split('<br>');
    h1.innerHTML = lines.map(line => `<span>${line}</span>`).join('');

    const h1Lines = h1.querySelectorAll('span');

    /* Animate H1 line by line */
    h1Lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 180);
    });

    /* Animate paragraph after H1 */
    setTimeout(() => {
        if (p) {
            p.style.opacity = '1';
            p.style.transform = 'translateX(0)';
        }
    }, h1Lines.length * 180 + 200);

    /* Animate buttons one by one */
    buttons?.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateX(0)';
        }, h1Lines.length * 180 + 400 + index * 150);
    });
});
