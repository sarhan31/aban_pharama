document.addEventListener('DOMContentLoaded', () => {
    // --- Typing Animation Utility ---
    const typeWriter = (element, text, speed = 30) => {
        let i = 0;
        element.innerHTML = '';
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    };

    // Trigger cinematic hero reveal
    const triggerHeroReveal = () => {
        try {
            const hero = document.querySelector('.hero');
            const heroContent = document.querySelector('.hero-content');
            
            if (hero) hero.classList.add('hero-revealed');
            if (heroContent) {
                setTimeout(() => {
                    heroContent.classList.add('hero-revealed');
                    
                    // Trigger typing animation for paragraph
                    const heroP = document.getElementById('typing-para');
                    if (heroP) {
                        const textToType = heroP.getAttribute('data-type-text') || heroP.innerText.trim();
                        if (textToType) {
                            heroP.classList.add('typing-idle'); // Hide briefly for setup
                            heroP.innerText = ''; 
                            setTimeout(() => {
                                typeWriter(heroP, textToType, 35);
                                heroP.classList.remove('typing-idle');
                            }, 500);
                        } else {
                            // Fallback: If no text, just show it
                            heroP.style.opacity = '1';
                            heroP.style.visibility = 'visible';
                        }
                    }
                }, 400); 
            }
        } catch (err) {
            console.error('Hero Reveal Error:', err);
            // Emergency fallback: Show paragraph if it exists
            const fallbackP = document.getElementById('typing-para');
            if (fallbackP) {
                fallbackP.style.opacity = '1';
                fallbackP.style.visibility = 'visible';
            }
        }
    };

    // 0. Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Prevent scrolling while splash is active
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            document.body.style.overflow = 'auto';
            
            triggerHeroReveal();
            
            // Optional: Remove from DOM after transition
            setTimeout(() => {
                splashScreen.remove();
            }, 800);
        }, 2500); // Show splash for 2.5 seconds
    } else {
        // Fallback: If no splash, trigger immediately
        triggerHeroReveal();
    }

    // 1. Navbar Scrolled Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 2. Back to Top Button Visibility
        const backToTop = document.getElementById('back-to-top');
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // 3. Back to Top Click
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add JS indicator for safe CSS reveals
    document.body.classList.add('js-active');

    // 4. Premium Intersection Observer for Scroll Reveal
    const isMobile = window.innerWidth < 768;
    const revealElements = document.querySelectorAll('.reveal:not(.cat-card)');
    const productCards = document.querySelectorAll('.cat-card');
    
    // Hide ONLY off-screen cards to prepare for reveal
    const initCards = () => {
        productCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                card.style.opacity = '0';
                card.style.clipPath = 'inset(0 0 0 100%)';
            }
        });
    };

    let queue = [];
    let processing = false;

    const runQueue = () => {
        if (queue.length === 0) { processing = false; return; }
        processing = true;
        const el = queue.shift();
        if (el) {
            // FORCE REFLOW: Essential for REPEATABILITY
            el.classList.remove('active');
            void el.offsetWidth; 
            el.style.opacity = '1';
            el.style.clipPath = 'inset(0 0 0 0)';
            el.classList.add('active');
        }
        setTimeout(runQueue, isMobile ? 600 : 250);
    };

    const mainObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                if (el.classList.contains('cat-card')) {
                    if (el.classList.contains('active')) return;
                    queue.push(el);
                    if (!processing) runQueue();
                } else {
                    el.classList.add('active');
                }
            } else {
                // RESET ON EXIT
                const rect = el.getBoundingClientRect();
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    el.classList.remove('active');
                    if (el.classList.contains('cat-card')) {
                        el.style.opacity = '0';
                        // Re-apply hidden curtain based on position
                        const idx = Array.from(productCards).indexOf(el);
                        const isRight = [0, 1, 4, 5].includes(idx);
                        el.style.clipPath = isRight ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
                    }
                }
            }
        });
    }, { threshold: 0.1 });

    initCards();
    revealElements.forEach(el => mainObserver.observe(el));
    productCards.forEach(el => mainObserver.observe(el));

    // Fail-safe
    setTimeout(() => {
        productCards.forEach(c => { c.style.opacity = '1'; c.style.clipPath = 'inset(0 0 0 0)'; });
    }, 3000);
    // 5. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu header (logo + text + close)
    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-menu-header';
    mobileHeader.innerHTML = `
        <div class="mobile-logo-container">
            <img src="assets/images/Logo_page-0001.jpg" alt="Aban Pharmaceuticals">
            <div class="mobile-logo-text">Aban <span>Pharmaceuticals</span></div>
        </div>
        <div class="mobile-close"><i class="fas fa-times"></i></div>
    `;
    navLinks.prepend(mobileHeader);

    const closeBtn = mobileHeader.querySelector('.mobile-close');

    const navOverlay = document.getElementById('nav-overlay');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.add('mobile-active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    });

    const closeMenu = () => {
        navLinks.classList.remove('mobile-active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // 6. Smooth Scroll for Anchor Links (Robust Fix)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if just "#"
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault(); // Only prevent if target exists
                
                // Use scrollIntoView for better results with Flexbox layouts
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // fallback offset correction (since fixed header exists)
                // We'll use a small timeout to adjust if needed, but scrollIntoView is usually enough
                
                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-active')) {
                    closeMenu();
                }
            }
        });
    });
});
