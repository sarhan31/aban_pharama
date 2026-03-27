document.addEventListener('DOMContentLoaded', () => {
    // 0. Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Prevent scrolling while splash is active
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            document.body.style.overflow = 'auto';
            
            // Optional: Remove from DOM after transition
            setTimeout(() => {
                splashScreen.remove();
            }, 800);
        }, 2500); // Show splash for 2.5 seconds
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

    // 4. Premium Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0,
        rootMargin: '0px 0px -50px 0px'
    };

    const activateElement = (el) => {
        if (el.classList.contains('active')) return;
        
        if (el.classList.contains('category-grid')) {
            const cards = el.querySelectorAll('.cat-card.reveal');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 200);
            });
        }
        el.classList.add('active');
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
    const catGrid = document.querySelector('.category-grid');
    if (catGrid) observer.observe(catGrid);

    // Fallback for immediate visibility check or if IO fails
    const runFallback = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                activateElement(el);
            }
        });
        if (catGrid) {
            const gRect = catGrid.getBoundingClientRect();
            if (gRect.top < window.innerHeight && gRect.bottom > 0) {
                activateElement(catGrid);
            }
        }
    };

    window.addEventListener('scroll', runFallback);
    setTimeout(runFallback, 500); // Run once after load

    // 5. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu header (logo + text + close)
    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-menu-header';
    mobileHeader.innerHTML = `
        <div class="mobile-logo-container">
            <img src="assets/images/Logo_page-0001.jpg" alt="Aban Pharma">
            <div class="mobile-logo-text">ABAN <span>PHARMA</span></div>
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

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-active')) {
                    closeMenu();
                }
            }
        });
    });
});
