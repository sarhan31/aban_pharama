document.addEventListener('DOMContentLoaded', () => {

    // ================= HERO TYPING =================
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

    const triggerHeroReveal = () => {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero) hero.classList.add('hero-revealed');

        if (heroContent) {
            setTimeout(() => {
                heroContent.classList.add('hero-revealed');

                const heroP = document.getElementById('typing-para');
                if (heroP) {
                    const text = heroP.getAttribute('data-type-text') || heroP.innerText.trim();
                    heroP.innerText = '';

                    setTimeout(() => {
                        typeWriter(heroP, text, 35);
                    }, 500);
                }
            }, 400);
        }
    };

    // ================= SPLASH =================
    const splashScreen = document.getElementById('splash-screen');

    if (splashScreen) {
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            document.body.style.overflow = 'auto';
            triggerHeroReveal();

            setTimeout(() => splashScreen.remove(), 800);
        }, 2500);
    } else {
        triggerHeroReveal();
    }

    // ================= NAVBAR + BACK TO TOP =================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        if (window.scrollY > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.classList.add('js-active');

    // ================= NORMAL REVEAL =================
    const revealElements = document.querySelectorAll('.reveal:not(.cat-card)');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ================= 🔥 PRODUCT CARD ANIMATION (FINAL FIX) =================
const productCards = document.querySelectorAll('.cat-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        const card = entry.target;

        if (entry.isIntersecting) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }

    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
});

productCards.forEach(card => {
    cardObserver.observe(card);
});

    // ================= MOBILE MENU =================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-menu-header';
    mobileHeader.innerHTML = `
        <div class="mobile-logo-container">
            <img src="assets/images/Logo_page-0001.jpg">
            <div class="mobile-logo-text">Aban <span>Pharmaceuticals</span></div>
        </div>
        <div class="mobile-close"><i class="fas fa-times"></i></div>
    `;

    navLinks.prepend(mobileHeader);
    const closeBtn = mobileHeader.querySelector('.mobile-close');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.add('mobile-active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        navLinks.classList.remove('mobile-active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // ================= SMOOTH SCROLL =================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
            }
        });
    });

});