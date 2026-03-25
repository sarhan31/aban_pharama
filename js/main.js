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

        // Scroll Reveal Check
        revealOnScroll();
    });

    // 3. Back to Top Click
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. Scroll Reveal Logic
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    // Run on load
    revealOnScroll();

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

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.add('mobile-active');
        document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    });

    closeBtn.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        document.body.style.overflow = 'auto';
    });

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
                    navLinks.classList.remove('mobile-active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
});
