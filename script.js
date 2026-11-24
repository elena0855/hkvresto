/* ========================================================
   HKV RESTO — Bar & Restaurant Moderne | Cotonou, Bénin
   Script interactif avec intégration complète WhatsApp & TikTok
   ======================================================== */

(function () {
    'use strict';

    const WA_NUMBER = '2290167016414';
    const TIKTOK_URL = 'https://www.tiktok.com/@hkv_resto?_r=1&_t=ZG-9BfbMIiXGlD';

    /* ===== HEADER SCROLL ===== */
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ===== NAVIGATION ACTIVE LINK (SCROLLSPY) ===== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
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
    }

    /* ===== BURGER MENU ===== */
    const burger = document.getElementById('burger-btn');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('mobile-overlay');

    if (burger && nav && overlay) {
        function toggleNav() {
            const open = nav.classList.toggle('open');
            overlay.classList.toggle('active', open);
            burger.classList.toggle('active', open);
            const spans = burger.querySelectorAll('span');
            if (spans.length === 3) {
                spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
                spans[1].style.opacity = open ? '0' : '';
                spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
            }
        }
        burger.addEventListener('click', toggleNav);
        overlay.addEventListener('click', toggleNav);
        nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
            if (nav.classList.contains('open')) toggleNav();
        }));
    }

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
            if (Math.random() > 0.6) p.style.background = '#dfa843';
            container.appendChild(p);
        }
    }
    spawnParticles();

    /* ===== SCROLL REVEAL ANIMATION ===== */
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.feature-card, .menu-card, .testimonial-card, .ambiance-item, .galerie-item, .contact-card, .social-card').forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    }

    /* ========================================================
       MODALS INTERACTIFS ("et si on clique on verra")
       ======================================================== */
    const modalWhatsapp = document.getElementById('modal-whatsapp');
    const modalTiktok = document.getElementById('modal-tiktok');
    const modalDish = document.getElementById('modal-dish');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close buttons on all modals
    document.querySelectorAll('.hkv-modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.close;
            closeModal(document.getElementById(targetId));
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.hkv-modal').forEach(m => {
        m.addEventListener('click', (e) => {
            if (e.target === m) closeModal(m);
        });
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(modalWhatsapp);
            closeModal(modalTiktok);
            closeModal(modalDish);
        }
    });

    /* ===== WHATSAPP MODAL LOGIC ===== */
    const waTextarea = document.getElementById('wa-modal-textarea');
    const waSendBtn = document.getElementById('wa-modal-send-btn');
    const waQrToggle = document.getElementById('wa-modal-qr-toggle');
    const waQrContainer = document.getElementById('wa-qr-container');
    const waQrCanvas = document.getElementById('wa-qrcode-canvas');
    let waQrRendered = false;

    function updateWaLink(text) {
        if (!waSendBtn) return;
        waSendBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    if (waTextarea) {
        waTextarea.addEventListener('input', (e) => {
            updateWaLink(e.target.value);
        });
    }

    // Presets
    document.querySelectorAll('.wa-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            if (waTextarea) waTextarea.value = text;
            updateWaLink(text);
        });
    });

    // QR Code for WhatsApp
    if (waQrToggle && waQrContainer) {
        waQrToggle.addEventListener('click', () => {
            const isHidden = waQrContainer.style.display === 'none';
            waQrContainer.style.display = isHidden ? 'block' : 'none';
            waQrToggle.innerHTML = isHidden ? '<i class="fa-solid fa-xmark"></i> Masquer le QR Code' : '<i class="fa-solid fa-qrcode"></i> Afficher le QR Code pour scanner';

            if (isHidden && !waQrRendered && window.QRCode && waQrCanvas) {
                new QRCode(waQrCanvas, {
                    text: `https://wa.me/${WA_NUMBER}`,
                    width: 140,
                    height: 140,
                    colorDark: "#05070c",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
                waQrRendered = true;
            }
        });
    }

    // Triggers for WhatsApp Modal
    const waTriggers = [
        'btn-header-order',
        'btn-hero-whatsapp',
        'card-feature-wa',
        'btn-open-wa-modal',
        'btn-cta-commander',
        'btn-privatiser-open',
        'contact-wa-item'
    ];
    waTriggers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(modalWhatsapp);
            });
        }
    });

    /* ===== TIKTOK MODAL LOGIC ===== */
    const tiktokQrToggle = document.getElementById('tiktok-modal-qr-toggle');
    const tiktokQrContainer = document.getElementById('tiktok-qr-container');
    const tiktokQrCanvas = document.getElementById('tiktok-qrcode-canvas');
    let tiktokQrRendered = false;

    if (tiktokQrToggle && tiktokQrContainer) {
        tiktokQrToggle.addEventListener('click', () => {
            const isHidden = tiktokQrContainer.style.display === 'none';
            tiktokQrContainer.style.display = isHidden ? 'block' : 'none';
            tiktokQrToggle.innerHTML = isHidden ? '<i class="fa-solid fa-xmark"></i> Masquer le QR Code' : '<i class="fa-solid fa-qrcode"></i> Afficher le QR Code TikTok';

            if (isHidden && !tiktokQrRendered && window.QRCode && tiktokQrCanvas) {
                new QRCode(tiktokQrCanvas, {
                    text: TIKTOK_URL,
                    width: 140,
                    height: 140,
                    colorDark: "#05070c",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
                tiktokQrRendered = true;
            }
        });
    }

    // Triggers for TikTok Modal
    const tiktokTriggers = [
        'btn-header-tiktok',
        'btn-hero-tiktok',
        'card-feature-tiktok',
        'btn-open-tiktok-modal',
        'btn-cta-tiktok',
        'contact-tiktok-item'
    ];
    tiktokTriggers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(modalTiktok);
            });
        }
    });

    /* ===== DISH DETAIL MODAL (CLIC SUR PLAT OU GALERIE) ===== */
    const dishImg = document.getElementById('dish-modal-img');
    const dishTitle = document.getElementById('dish-modal-title');
    const dishDesc = document.getElementById('dish-modal-desc');
    const dishOrderBtn = document.getElementById('dish-modal-order-btn');

    function openDishModal(title, image, desc) {
        if (!modalDish) return;
        if (dishTitle) dishTitle.textContent = title;
        if (dishImg && image) dishImg.src = image;
        if (dishDesc && desc) dishDesc.textContent = desc;
        if (dishOrderBtn) {
            const msg = `Bonjour HKV Resto, je voudrais commander le plat "${title}" s'il vous plaît !`;
            dishOrderBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
        }
        openModal(modalDish);
    }

    // Attach click to hero dish card
    const heroImgTrigger = document.getElementById('hero-img-trigger');
    const heroCardTrigger = document.getElementById('hero-card-trigger');
    if (heroImgTrigger) {
        heroImgTrigger.addEventListener('click', () => {
            openDishModal('Poulet Grillé HKV', 'images/plat1.jpg', 'Le plat signature incontournable de HKV Resto : poulet entier mariné aux épices du terroir, grillé au feu de bois, servi avec frites dorées et sauce spéciale.');
        });
    }
    if (heroCardTrigger) {
        heroCardTrigger.addEventListener('click', () => {
            openDishModal('Poulet Grillé HKV', 'images/plat1.jpg', 'Le plat signature incontournable de HKV Resto : poulet entier mariné aux épices du terroir, grillé au feu de bois, servi avec frites dorées et sauce spéciale.');
        });
    }

    // Attach click to menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If the user clicked directly on the order button inside the card, let it open dish modal or handle directly
            const title = card.dataset.dish || card.querySelector('.menu-card-title')?.textContent || 'Plat HKV';
            const img = card.dataset.img || card.querySelector('.menu-img')?.src || 'images/plat1.jpg';
            const desc = card.dataset.desc || card.querySelector('.menu-card-desc')?.textContent || '';
            openDishModal(title, img, desc);
        });
    });

    // Attach click to gallery items
    document.querySelectorAll('.galerie-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.dataset.title || item.querySelector('.galerie-overlay span')?.textContent || 'Création HKV';
            const img = item.dataset.img || item.querySelector('.galerie-img')?.src || 'images/plat1.jpg';
            const desc = item.dataset.desc || 'Préparé avec les ingrédients frais du marché par nos chefs.';
            openDishModal(title, img, desc);
        });
    });

    /* ===== SMOOTH SCROLL FOR IN-PAGE LINKS ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('%cHKV Resto — Bar & Restaurant Moderne', 'color:#ff6b00;font-size:1.2rem;font-weight:bold;');
    console.log('%cWhatsApp : +229 01 67 01 64 14 | TikTok : @hkv_resto', 'color:#25d366;font-size:0.9rem;');
})();
