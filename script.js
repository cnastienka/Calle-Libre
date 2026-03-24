/* ============================================================
   script.js — Calle Libre Skate Shop
   Módulos:
     1. Menú móvil
     2. Hero Carousel (banner principal)
     3. Tabs + Carruseles de productos por categoría
     4. Carrito de compras
     5. Scroll Reveal
     6. Contador animado
     7. Formulario de contacto
============================================================ */
/* ── 1. MENÚ MÓVIL ── */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
closeMenuBtn.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── 2. HERO CAROUSEL ── */
let heroIdx = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots   = document.querySelectorAll('.carousel-dot');

function heroGo(n) {
  heroSlides[heroIdx].classList.remove('active');
  heroDots[heroIdx].classList.remove('active');
  heroIdx = (n + heroSlides.length) % heroSlides.length;
  heroSlides[heroIdx].classList.add('active');
  heroDots[heroIdx].classList.add('active');
}
function heroPrev() { heroGo(heroIdx - 1); }
function heroNext() { heroGo(heroIdx + 1); }

// Auto-avance cada 5.5 segundos
setInterval(() => heroNext(), 5500);

/* ── 3. TABS + CARRUSELES DE PRODUCTOS ── */

// Estado de cada carrusel
const carStates = {};
const VISIBLE   = 4; // Tarjetas visibles a la vez en desktop
/* ── CONTADOR ANIMADO ── */
let countersStarted = false;
const counterSection = document.querySelector('.counter-section');
const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;

        document.querySelectorAll('.counter-num').forEach(el => {
            let cur = 0;
            const tgt = parseInt(el.dataset.target);
            const step = tgt / 112;

            const t = setInterval(() => {
                cur += step;

                if (cur >= tgt) {
                    el.textContent = tgt.toLocaleString();
                    clearInterval(t);
                } else {
                    el.textContent = Math.floor(cur).toLocaleString();
                }
            }, 16);
        });

        counterObserver.disconnect();
    }
}, { threshold: 0.3 });

counterObserver.observe(counterSection);


/* ── FORMULARIO DE CONTACTO ── */
function sendForm(e) {
    e.preventDefault();

    const n  = document.getElementById('nombre').value.trim();
    const em = document.getElementById('email').value.trim();
    const m  = document.getElementById('mensaje').value.trim();

    if (!n || !em || !m) {
        alert('Llena nombre, email y mensaje.');
        return;
    }

    if (!em.includes('@')) {
        alert('Email inválido.');
        return;
    }

    const btn = document.getElementById('send-btn');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    setTimeout(() => {
        document.getElementById('form-success').style.display = 'block';
        btn.style.display = 'none';
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mensaje').value = '';
    }, 1200);
}