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