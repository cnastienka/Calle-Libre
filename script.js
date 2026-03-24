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