document.addEventListener('DOMContentLoaded', () => {
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('preferred-language') || defaultLang;
    let translations = {};

    // Get locales path dynamically depending on subfolder depth (e.g. if in pages/)
    const getLocalesPath = (lang) => {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return `../locales/${lang}.json`;
        }
        return `locales/${lang}.json`;
    };

    // Load language JSON file
    const loadTranslations = async (lang) => {
        try {
            const response = await fetch(getLocalesPath(lang));
            if (!response.ok) throw new Error(`Could not load locales file for ${lang}`);
            return await response.json();
        } catch (error) {
            console.error('i18n error:', error);
            // Fallback to English if it's not English
            if (lang !== 'en') {
                console.warn('Falling back to English translations');
                return loadTranslations('en');
            }
            return {};
        }
    };

    // Translate DOM elements
    const translateDOM = () => {
        document.documentElement.setAttribute('lang', currentLang);

        // 1. Core Key-based translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const attrOrKey = el.getAttribute('data-i18n');
            
            // Check for attribute translation pattern: [attr]key
            if (attrOrKey.startsWith('[')) {
                const match = attrOrKey.match(/^\[(.*?)\](.*)$/);
                if (match) {
                    const attr = match[1];
                    const key = match[2];
                    const translation = translations[key];
                    if (translation) {
                        el.setAttribute(attr, translation);
                    }
                }
                return;
            }

            const translation = translations[attrOrKey];

            // If missing in translation, check if the HTML itself has English content as fallback
            if (!translation) {
                return;
            }

            // Update attributes or text content
            if (el.id === 'typing-para') {
                el.setAttribute('data-type-text', translation);
                // If it's already typed/revealed, replace the inner text directly
                if (!el.classList.contains('typing-idle')) {
                    el.innerHTML = translation;
                }
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        });

        // 2. Dynamic Product Item translations (avoids adding data-i18n attributes to 100+ items manually)
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => {
            let textNode = null;
            for (let node of item.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    textNode = node;
                    break;
                }
            }
            if (textNode) {
                let originalText = item.getAttribute('data-original-text');
                if (!originalText) {
                    originalText = textNode.textContent.trim();
                    item.setAttribute('data-original-text', originalText);
                }
                
                const translation = translations[originalText];
                if (translation) {
                    textNode.textContent = ' ' + translation;
                } else if (currentLang === 'en') {
                    textNode.textContent = ' ' + originalText;
                }
            }
        });

        // Update active class on dropdown options
        const activeLangOptions = document.querySelectorAll('.lang-option');
        activeLangOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === currentLang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        // Update the current language text shown in buttons
        const currentLangTexts = document.querySelectorAll('.current-lang');
        currentLangTexts.forEach(txt => {
            txt.textContent = currentLang === 'en' ? 'English' : 'Français';
        });
    };

    // Change language function with fade transition
    window.setLanguage = async (lang) => {
        if (lang === currentLang && Object.keys(translations).length > 0) return;

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.add('lang-changing');
        }

        // Fetch translations
        translations = await loadTranslations(lang);
        currentLang = lang;
        localStorage.setItem('preferred-language', lang);

        // Wait for fade out to complete before replacing DOM text
        setTimeout(() => {
            translateDOM();
            if (mainContent) {
                mainContent.classList.remove('lang-changing');
            }
        }, 150);
    };

    // Setup Event Listeners for Switcher Dropdown
    const initSwitcher = () => {
        const switcherBtns = document.querySelectorAll('.lang-switcher-btn');
        switcherBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const container = btn.parentElement;
                container.classList.toggle('open');
            });
        });

        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = opt.getAttribute('data-lang');
                window.setLanguage(lang);
                // Close dropdown
                const container = opt.closest('.lang-switcher');
                if (container) container.classList.remove('open');
            });
        });

        // Close dropdown on click outside
        document.addEventListener('click', () => {
            const openSwitchers = document.querySelectorAll('.lang-switcher.open');
            openSwitchers.forEach(s => s.classList.remove('open'));
        });
    };

    // Auto-detect and run on page load
    const init = async () => {
        // Load initial translations (fetch JSON)
        translations = await loadTranslations(currentLang);
        if (currentLang !== 'en') {
            translateDOM();
        }
        initSwitcher();
    };

    init();
});
