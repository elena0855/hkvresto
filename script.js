/* ========================================
   HKV RESTO — SITE VITRINE
   Script principal
   ======================================== */

(function () {
    'use strict';

    /* ===== HEADER SCROLL ===== */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ===== NAVIGATION ACTIVE LINK (SCROLLSPY) ===== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));

    /* ===== BURGER MENU ===== */
    const burger = document.getElementById('burger-btn');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('mobile-overlay');

    function toggleNav() {
        const open = nav.classList.toggle('open');
        overlay.classList.toggle('active', open);
        burger.classList.toggle('active', open);
        burger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
        burger.querySelectorAll('span')[1].style.opacity = open ? '0' : '';
        burger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
    }
    burger.addEventListener('click', toggleNav);
    overlay.addEventListener('click', toggleNav);
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
        if (nav.classList.contains('open')) toggleNav();
    }));

    /* ===== MENU TABS ===== */
    const tabs = document.querySelectorAll('.menu-tab');
    const tabContents = document.querySelectorAll('.menu-tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const content = document.getElementById(`tab-${target}`);
            if (content) content.classList.add('active');
        });
    });

    /* ===== HERO PARTICLES ===== */
    function spawnParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 60 + '%';
            p.style.top = (40 + Math.random() * 55) + '%';
            p.style.setProperty('--dur', (4 + Math.random() * 5) + 's');
            p.style.setProperty('--delay', (Math.random() * 6) + 's');
            p.style.opacity = '0';
            // Randomise color between orange and gold
            if (Math.random() > 0.6) p.style.background = '#dfa843';
            container.appendChild(p);
        }
    }
    spawnParticles();

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.feature-card, .menu-card, .testimonial-card, .ambiance-item, .galerie-item, .contact-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    /* ===== GALERIE LIGHTBOX (simple) ===== */
    document.querySelectorAll('.galerie-item').forEach(item => {
        item.addEventListener('click', () => {
            const label = item.querySelector('.galerie-overlay span')?.textContent || '';
            const emoji = item.querySelector('.galerie-emoji')?.textContent || '';
            showToast(`${emoji} ${label}`, 'info');
        });
    });

    /* ===== TOAST NOTIFICATION ===== */
    function showToast(msg, type = 'info') {
        const container = getOrCreateToastContainer();
        const toast = document.createElement('div');
        toast.className = `vitrine-toast toast-${type}`;
        toast.innerHTML = `<span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('visible'), 10);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
    function getOrCreateToastContainer() {
        let c = document.getElementById('vitrine-toast-container');
        if (!c) {
            c = document.createElement('div');
            c.id = 'vitrine-toast-container';
            c.style.cssText = 'position:fixed;bottom:5.5rem;right:2rem;z-index:2000;display:flex;flex-direction:column;gap:0.75rem;';
            document.body.appendChild(c);
        }
        return c;
    }

    /* Inject toast CSS */
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .vitrine-toast {
            padding: 0.85rem 1.5rem;
            background: rgba(20,20,30,0.95);
            border: 1px solid rgba(255,255,255,0.1);
            border-left: 4px solid #ff6b00;
            border-radius: 10px;
            color: #f0f0f5;
            font-family: 'Outfit', sans-serif;
            font-size: 0.9rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.4);
            backdrop-filter: blur(12px);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
            max-width: 300px;
        }
        .vitrine-toast.visible { transform: translateX(0); opacity: 1; }
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .reveal-on-scroll.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(toastStyle);

    /* ===== WHATSAPP LINK UPDATER ===== */
    // Centralise WhatsApp number update — change here only
    const WA_NUMBER = '2290167016414'; // Numéro WhatsApp HKV Resto
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        const url = new URL(link.href);
        const text = url.searchParams.get('text') || '';
        link.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(decodeURIComponent(text))}`;
    });

    /* ===== SMOOTH ANCHOR SCROLLING ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ===== TILT EFFECT ON CARDS (subtle) ===== */
    if (!window.matchMedia('(pointer: coarse)').matches) {
        document.querySelectorAll('.menu-card, .feature-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const dx = (x - cx) / cx * 5;
                const dy = (y - cy) / cy * 5;
                card.style.transform = `perspective(800px) rotateX(${-dy}deg) rotateY(${dx}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ===== REGISTER SERVICE WORKER ===== */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker enregistré avec succès :', reg.scope))
                .catch(err => console.error('Erreur d\'enregistrement du Service Worker :', err));
        });
    }

    console.log('%cHKV Resto — Site Vitrine', 'color:#ff6b00;font-size:1.2rem;font-weight:bold;');
    console.log('%cCommandes via WhatsApp uniquement 🍹', 'color:#25d366;font-size:0.9rem;');

})();
