/**
 * Calcula el ancho real de una tarjeta en un carrusel.
 * Usa 250px como fallback si el panel está oculto (offsetWidth = 0).
 */
function getCardWidth(name) {
  const car = document.getElementById('car-' + name);
  if (!car) return 268; // 250 + 18 gap
  const firstCard = car.querySelector('.product-card');
  if (!firstCard) return 268;
  const w = firstCard.offsetWidth;
  return w > 0 ? w : 250;
}

/**
 * Inicializa el estado y los dots de un carrusel.
 */
function initCarousel(name) {
  const car = document.getElementById('car-' + name);
  if (!car) return;
  const cards = car.querySelectorAll('.product-card');
  const total = cards.length;
  const maxIdx = Math.max(0, total - VISIBLE);
  carStates[name] = { idx: 0, total, maxIdx };
  buildDots(name, total);
}

function buildDots(name, total) {
  const container = document.getElementById('dots-' + name);
  if (!container) return;
  container.innerHTML = '';
  const pages = Math.ceil(total / VISIBLE);
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('button');
    d.className = 'prod-dot' + (i === 0 ? ' active' : '');
    const pageIdx = i;
    d.onclick = () => goToSlide(name, pageIdx * VISIBLE);
    container.appendChild(d);
  }
}

function slideCarousel(name, dir) {
  if (!carStates[name]) return;
  const s = carStates[name];
  s.idx = Math.max(0, Math.min(s.maxIdx, s.idx + dir));
  applyCarousel(name);
}

function goToSlide(name, idx) {
  if (!carStates[name]) return;
  carStates[name].idx = Math.min(carStates[name].maxIdx, Math.max(0, idx));
  applyCarousel(name);
}

function applyCarousel(name) {
  const car = document.getElementById('car-' + name);
  if (!car) return;
  const GAP    = 18;
  const cardW  = getCardWidth(name);
  const offset = carStates[name].idx * (cardW + GAP);
  car.style.transform = `translateX(-${offset}px)`;

  // Actualizar dots
  const page = Math.floor(carStates[name].idx / VISIBLE);
  document.querySelectorAll('#dots-' + name + ' .prod-dot')
    .forEach((d, i) => d.classList.toggle('active', i === page));
}

/**
 * Cambia la categoría activa.
 * Activa panel + tab, hace scroll y recalcula el carrusel
 * ahora que el panel está visible (offsetWidth correcto).
 */
function switchTab(name) {
  // Desactivar todo
  document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));

  // Activar el seleccionado
  const panel = document.getElementById('panel-' + name);
  const tab   = document.querySelector('[data-tab="' + name + '"]');
  if (panel) panel.classList.add('active');
  if (tab)   tab.classList.add('active');

  // Scroll a la sección de productos
  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });

  // Inicializar si es la primera vez
  if (!carStates[name]) initCarousel(name);

  // Esperar un frame para que el panel sea visible y offsetWidth sea real
  requestAnimationFrame(() => {
    applyCarousel(name);
  });
}

// Inicializar todos los carruseles al cargar la página
window.addEventListener('load', () => {
  const cats = [
    'tablas','llantas','baleros','lijas','trucks',
    'elevadores','protecciones','estampas',
    'tenis','pantalones','sudaderas','playeras'
  ];
  cats.forEach(n => initCarousel(n));

  // El panel de tablas ya está visible, aplicar inmediatamente
  applyCarousel('tablas');
});

// Recalcular al cambiar tamaño de ventana
window.addEventListener('resize', () => {
  Object.keys(carStates).forEach(name => {
    const panel = document.getElementById('panel-' + name);
    if (panel && panel.classList.contains('active')) {
      applyCarousel(name);
    }
  });
});

/* ── 4. CARRITO ── */
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  const c = document.getElementById('cart-count');
  c.style.transform = 'scale(1.7)';
  setTimeout(() => c.style.transform = 'scale(1)', 220);
  alert(`✅ "${name}" agregado al carrito.`);
}

function updateCartUI() {
  const total      = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = totalItems;

  const ci = document.getElementById('cart-items');
  const ct = document.getElementById('cart-total');

  if (!cart.length) {
    ci.innerHTML = '<p class="empty-cart">Tu carrito está vacío. ¡Empieza a rodar! 🛹</p>';
    ct.style.display = 'none';
  } else {
    ci.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${i.name}</div>
          <div style="font-size:12px;color:var(--steel)">
            Cant: ${i.qty} × $${i.price.toLocaleString()}
          </div>
        </div>
        <div class="cart-item-price">$${(i.price * i.qty).toLocaleString()}</div>
      </div>`).join('');
    ct.style.display = 'flex';
    document.getElementById('cart-total-value').textContent = '$' + total.toLocaleString();
  }
}

document.getElementById('open-cart').addEventListener('click', () =>
  document.getElementById('cart-modal').classList.add('open'));
document.getElementById('close-cart').addEventListener('click', () =>
  document.getElementById('cart-modal').classList.remove('open'));
document.getElementById('cart-modal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});

function checkout() {
  if (!cart.length) { alert('Tu carrito está vacío 🛹'); return; }
  const t = cart.reduce((s, i) => s + i.price * i.qty, 0);
  alert(`🎉 ¡Pedido confirmado!\nTotal: $${t.toLocaleString()} MXN\n¡Gracias por comprar en Calle Libre!`);
  cart = [];
  updateCartUI();
  document.getElementById('cart-modal').classList.remove('open');
}

/* ── 5. SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(x => {
    if (x.isIntersecting) {
      x.target.classList.add('visible');
      ro.unobserve(x.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));