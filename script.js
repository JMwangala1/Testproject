document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. LUXURY INERTIAL SCROLLING (LENIS)
       This creates the "Waridi Events" glide.
    ========================================= */
    
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,       // The "weight" of the scroll (higher = smoother/slower)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing curve
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,  // Keep mobile native for better feel, true for smooth
        touchMultiplier: 2,
    });

    // The Animation Loop (Required for Lenis)
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* =========================================
       2. SMOOTH ANCHOR LINKS
       Connects your menu links to the Smooth Scroll
    ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty links

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Use Lenis to scroll to the target
                lenis.scrollTo(targetElement, {
                    offset: -100 // Adjusts for your Sticky Navbar height
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });

  /* =========================================
       TESTIMONIAL SLIDER LOGIC (SAFE MODE)
    ========================================= */
    const track = document.querySelector('.testimonial-track');
    
     // SAFETY CHECK: Only run if the track exists on this specific page
     if (track) { 
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        const updateSlide = (currentSlide, targetSlide) => {
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        }

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        }

        // Next Button Click
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const nextSlide = currentSlide.nextElementSibling || slides[0]; 
                const currentDot = dotsNav.querySelector('.current-slide');
                const nextDot = currentDot.nextElementSibling || dots[0];

                updateSlide(currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            });
        }

        // Prev Button Click
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; 
                const currentDot = dotsNav.querySelector('.current-slide');
                const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];

                updateSlide(currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            });
        }

        // Dot Click
        if (dotsNav) {
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;

                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.current-slide');
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                const targetSlide = slides[targetIndex];

                updateSlide(currentSlide, targetSlide);
                updateDots(currentDot, targetDot);
            });
        }
        
        // Auto-play
        setInterval(() => {
            if(nextButton) nextButton.click();
        }, 7000);
    }


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
       FORMSPREE FORM SUBMISSION (UNIVERSAL HANDLER)
    ================================= */

    // 1. Define a reusable function to handle ANY form
    const handleFormSubmit = (formId, msgId) => {
        const form = document.getElementById(formId);
        const msgBox = document.getElementById(msgId);

        // Safety Check: Only run if the form exists on the current page
        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;

                // A. Loading State
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                if(msgBox) msgBox.innerHTML = '';

                const formData = new FormData(this);

                try {
                    const response = await fetch(this.action, {
                        method: this.method,
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        // B. Success State
                        if(msgBox) {
                            msgBox.innerHTML = 'Thank you! Your request has been received.';
                            msgBox.style.color = 'green';
                            msgBox.style.marginTop = '15px';
                            msgBox.style.fontWeight = '600';
                        }

                        this.reset(); // <--- CRITICAL: Wipes the form clean
                        
                        submitBtn.innerText = 'Sent ✔';
                        submitBtn.style.backgroundColor = 'green';
                        submitBtn.style.color = '#fff';
                        submitBtn.style.border = 'none';
                    } else {
                        // C. Server Error
                        if(msgBox) {
                            msgBox.innerHTML = 'Oops! There was a problem submitting your form.';
                            msgBox.style.color = 'red';
                        }
                    }

                } catch (error) {
                    // D. Network Error
                    if(msgBox) {
                        msgBox.innerHTML = 'Network error. Please try again later.';
                        msgBox.style.color = 'red';
                    }
                }

                // E. Restore Button (after 5 seconds)
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.border = '';
                }, 5000);
            });
        }
    };

    // 2. Initialize the Forms
    
    // A. Home Page Booking Form
    // (form ID="bookingForm", message ID="formMessage")
    handleFormSubmit('bookingForm', 'formMessage');

    // B. Seafood Order Page Form
    // (form ID="seafoodOrderForm", message ID="orderMessage")
    handleFormSubmit('seafoodOrderForm', 'orderMessage');

        // C. NEW: Contact Page Form (ADD THIS LINE) <---
    handleFormSubmit('contactPageForm', 'contactMessage');

 /* =========================================
       SCROLL ANIMATION (Images Only - Row Sequence)
    ========================================= */
    
    // Target only the images, not the whole card
    const serviceImages = document.querySelectorAll('.product-card .img-container');

    const observerOptions = {
        threshold: 0.2 // Trigger when 20% of the image is visible
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Get the index of this image (0 to 5)
                const index = Array.from(serviceImages).indexOf(img);
                
                // LOGIC: 
                // Top Row (0,1,2) -> Delay: 0ms, 200ms, 400ms
                // Bottom Row (3,4,5) -> Delay: 600ms, 800ms, 1000ms (Waits for top row)
                
                let delay = 0;
                
                if (index < 3) {
                    // Top Row Logic
                    delay = index * 200; 
                } else {
                    // Bottom Row Logic (Start after 600ms)
                    delay = 600 + ((index - 3) * 200);
                }

                setTimeout(() => {
                    img.classList.add('reveal-visible');
                }, delay);
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, observerOptions);

    serviceImages.forEach(image => {
        imageObserver.observe(image);
    }); 

    /* =========================================
       FOOTER: GO BACK UP
    ========================================= */
    const goTopBtn = document.getElementById('goTopBtn');
    if (goTopBtn) {
        goTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* =========================================
       CONTINUOUS MARQUEE (Perfect Pause/Resume Fix)
    ========================================= */
if (typeof Swiper !== 'undefined' && document.querySelector('.newsSwiper')) {
    const newsSwiper = new Swiper('.newsSwiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
        speed: 3000,
        freeMode: {
            enabled: true,
            momentum: false,
        },
        mousewheel: { forceToAxis: true, sensitivity: 1 },
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        pagination: {  // Init HTML pagination (harmless)
            el: '.swiper-pagination',
            clickable: false,
        },
    });

    const SPEED     = 3000;
    const swiperEl  = document.querySelector('.newsSwiper');
    const wrapperEl = newsSwiper.wrapperEl;

    // ── HOVER: ULTRA-INSTANT FREEZE ────────────────────────────────────────────
    swiperEl.addEventListener('mouseenter', () => {
        newsSwiper.autoplay.stop();
        newsSwiper.setTransition(0);
        newsSwiper.velocity = 0;  // Kill freeMode velocity INSTANTLY
    });

    swiperEl.addEventListener('mouseleave', () => {
        newsSwiper.setTransition(SPEED);
        newsSwiper.autoplay.start();
    });

    // ── DRAG: HARD STOP RIGHT-DRAG AT 10 CARDS + IMMEDIATE RESUME ─────────────
    const CARD_SLOT = 280 + 30;
    const MAX_DRAG  = CARD_SLOT * 10;
    let dragStartTranslate = null;

    newsSwiper.on('touchStart', () => {
        dragStartTranslate = newsSwiper.getTranslate();
        newsSwiper.autoplay.stop();
        newsSwiper.setTransition(0);
        newsSwiper.allowTouchMove = true;
        newsSwiper.velocity = 0;  // Pre-empt velocity
    });

    newsSwiper.on('touchMove', () => {
        if (dragStartTranslate === null) return;

        const draggedRight = newsSwiper.getTranslate() - dragStartTranslate;  // >0: RIGHT drag (peek ahead)
        const maxAllowedTranslate = dragStartTranslate + MAX_DRAG;  // Least negative allowed

        if (newsSwiper.getTranslate() > maxAllowedTranslate) {  // Exceeded right?
            newsSwiper.setTranslate(maxAllowedTranslate);  // Clamp back
            newsSwiper.velocity = 0;
            newsSwiper.allowTouchMove = false;  // BLOCK gesture continuation
        }
    });

    newsSwiper.on('touchEnd', () => {
        dragStartTranslate = null;
        newsSwiper.allowTouchMove = true;
        newsSwiper.setTransition(SPEED);
        newsSwiper.autoplay.start();  // IMMEDIATE resume
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
            line.style.transform = 'translateY(0)';
        }, index * 180);
    });

    /* Animate paragraph after H1 */
    setTimeout(() => {
        if (p) {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }
    }, h1Lines.length * 180 + 200);

    /* Animate buttons one by one */
    buttons?.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, h1Lines.length * 180 + 400 + index * 150);
    });
});
