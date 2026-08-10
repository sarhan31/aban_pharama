/**
 * Custom Cursor Interaction for Aban Pharmaceuticals
 * Pure Vanilla JS + CSS implementation with sub-pixel 1:1 precision dot and lerp trailing ring.
 * Respects existing CSS design tokens, prefers-reduced-motion, and desktop mouse pointer constraints.
 */

(function () {
    'use strict';

    function initCustomCursor() {
        // Accessibility and Technical Constraint Checks
        const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!isFinePointer || prefersReducedMotion) {
            return;
        }

        // Avoid multiple initializations
        if (document.querySelector('.custom-cursor-dot')) {
            return;
        }

        // Create cursor DOM elements
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        dot.setAttribute('aria-hidden', 'true');

        const ring = document.createElement('div');
        ring.className = 'custom-cursor-ring';
        ring.setAttribute('aria-hidden', 'true');

        const label = document.createElement('div');
        label.className = 'custom-cursor-label';
        label.setAttribute('aria-hidden', 'true');

        document.body.appendChild(dot);
        document.body.appendChild(ring);
        document.body.appendChild(label);

        // Coordinates & Animation State
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        let isInitialized = false;
        let isHovering = false;
        let isInput = false;
        let isHidden = true;
        let isActive = false;
        let activeLabelText = '';
        let rafId = null;

        // Smooth Lerp Easing Factor (~0.18 provides ~0.15-0.2s duration, zero overshoot)
        const LERP_FACTOR = 0.18;

        // Interactive Element Matchers & Contextual Label Resolvers
        const getContextualLabel = (target) => {
            if (!target) return '';

            // 1. Explicit data attribute (highest precedence)
            const explicitLabel = target.closest('[data-cursor-label]');
            if (explicitLabel) {
                return explicitLabel.getAttribute('data-cursor-label') || '';
            }

            // 2. Product Category Cards in dense catalog
            if (target.closest('.cat-card')) {
                return 'View range';
            }

            // 3. Product Range Accordion Headers
            const accordionHeader = target.closest('.accordion-header');
            if (accordionHeader) {
                const item = accordionHeader.closest('.accordion-item');
                const isOpen = item && item.classList.contains('active');
                return isOpen ? 'Collapse' : 'View formulations';
            }

            // 4. Quick Search Tags
            if (target.closest('.quick-search-tag')) {
                return 'Filter';
            }

            // 5. WhatsApp triggers
            if (target.closest('.btn-whatsapp, .whatsapp-btn, a[href*="wa.me"]')) {
                return 'WhatsApp';
            }

            // 6. Phone / Call triggers
            if (target.closest('a[href^="tel:"]')) {
                return 'Call';
            }

            // 7. Email triggers
            if (target.closest('a[href^="mailto:"]')) {
                return 'Email';
            }

            // 8. Map links
            if (target.closest('a[href*="maps.app.goo.gl"], a[href*="google.com/maps"], .location-map-btn')) {
                return 'View Map';
            }

            // 9. Floating Back to top
            if (target.closest('.back-to-top, #back-to-top')) {
                return 'Top';
            }

            // 10. Language Switcher
            if (target.closest('.lang-switcher-btn')) {
                return 'Language';
            }

            return '';
        };

        const isInteractiveElement = (target) => {
            if (!target) return false;
            return !!target.closest(
                'a, button, [role="button"], .cat-card, .accordion-header, .quick-search-tag, ' +
                '.facility-card, .quality-item, .float-btn, .lang-switcher-btn, .lang-option, ' +
                '.product-item, .mobile-toggle, .mobile-close, [data-cursor-label], select, summary'
            );
        };

        const isInputElement = (target) => {
            if (!target) return false;
            return !!target.closest('input, textarea, [contenteditable="true"], [contenteditable=""]');
        };

        // Render loop via requestAnimationFrame
        function renderLoop() {
            // Lerp physics for trailing ring
            ringX += (mouseX - ringX) * LERP_FACTOR;
            ringY += (mouseY - ringY) * LERP_FACTOR;

            if (isInitialized) {
                ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

                if (activeLabelText) {
                    label.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(24px, -50%)`;
                }
            }

            rafId = requestAnimationFrame(renderLoop);
        }

        // Mouse Move Event Listener (1:1 instant dot tracking)
        function onMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isInitialized) {
                ringX = mouseX;
                ringY = mouseY;
                isInitialized = true;
                if (isHidden) {
                    isHidden = false;
                    dot.classList.remove('is-hidden');
                    ring.classList.remove('is-hidden');
                }
            }

            // Update dot 1:1 instantaneously with zero latency
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

            // Evaluate target element
            const target = e.target;

            // Check if hovering over editable text input
            if (isInputElement(target)) {
                if (!isInput) {
                    isInput = true;
                    dot.classList.add('is-input');
                    ring.classList.add('is-input');
                    label.classList.remove('is-visible');
                    activeLabelText = '';
                }
                return;
            } else if (isInput) {
                isInput = false;
                dot.classList.remove('is-input');
                ring.classList.remove('is-input');
            }

            // Check interactive state
            const interactive = isInteractiveElement(target);
            if (interactive !== isHovering) {
                isHovering = interactive;
                if (isHovering) {
                    dot.classList.add('is-hovering');
                    ring.classList.add('is-hovering');
                } else {
                    dot.classList.remove('is-hovering');
                    ring.classList.remove('is-hovering');
                }
            }

            // Contextual navigation label handling
            const labelText = isHovering ? getContextualLabel(target) : '';
            if (labelText !== activeLabelText) {
                activeLabelText = labelText;
                if (activeLabelText) {
                    label.textContent = activeLabelText;
                    label.classList.add('is-visible');
                } else {
                    label.classList.remove('is-visible');
                }
            }
        }

        // Mouse Down / Up Active Compression (Tactile Feedback)
        function onMouseDown(e) {
            if (e.button === 0 && !isInput) {
                isActive = true;
                ring.classList.add('is-active');
                dot.classList.add('is-active');
            }
        }

        function onMouseUp() {
            if (isActive) {
                isActive = false;
                ring.classList.remove('is-active');
                dot.classList.remove('is-active');
            }
        }

        // Viewport Enter / Leave Handlers
        function onMouseLeave() {
            isHidden = true;
            dot.classList.add('is-hidden');
            ring.classList.add('is-hidden');
            label.classList.remove('is-visible');
            activeLabelText = '';
        }

        function onMouseEnter() {
            isHidden = false;
            dot.classList.remove('is-hidden');
            ring.classList.remove('is-hidden');
        }

        function onWindowBlur() {
            onMouseLeave();
        }

        // Bind Window Listeners
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mousedown', onMouseDown, { passive: true });
        window.addEventListener('mouseup', onMouseUp, { passive: true });
        document.documentElement.addEventListener('mouseleave', onMouseLeave);
        document.documentElement.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('blur', onWindowBlur);

        // Start render loop
        rafId = requestAnimationFrame(renderLoop);

        // Listen for reduced-motion media query dynamic changes
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e) => {
            if (e.matches) {
                if (rafId) cancelAnimationFrame(rafId);
                dot.remove();
                ring.remove();
                label.remove();
            }
        };

        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', handleMotionChange);
        } else if (motionQuery.addListener) {
            motionQuery.addListener(handleMotionChange);
        }
    }

    // Initialize once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomCursor);
    } else {
        initCustomCursor();
    }
})();
