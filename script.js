/* ============================================================
   ROMEO MESVERSÁRIO — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── CONFIGURAÇÃO ──────────────────────────────────────────
     Troque o número e o link do Google Maps aqui:
  ────────────────────────────────────────────────────────── */
  const CONFIG = {
    whatsappNumber: '5521973387903',           // ex: 5521999998888
    whatsappMessage: 'Olá! Estou confirmando presença no mesversário do Romeo.',
    googleMapsUrl: 'https://maps.app.goo.gl/W7SFcJSFBc3jzJkw5', // cole o link completo
  };

  /* ── ATUALIZA LINKS ────────────────────────────────────────*/
  function applyConfig () {
    const waMsg = encodeURIComponent(CONFIG.whatsappMessage);
    const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}`;

    document.querySelectorAll('[href*="wa.me"]').forEach(a => {
      a.href = waHref;
    });

    document.querySelectorAll('[href*="maps.google"]').forEach(a => {
      a.href = CONFIG.googleMapsUrl;
    });
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────────*/
  function initScrollReveal () {
    const els = document.querySelectorAll('.fade-in');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => io.observe(el));
  }

  /* ── CONFETTI PARTICLES ────────────────────────────────────*/
  function initParticles () {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['#006400', '#f9c900', '#003087', '#2e7d32', '#e6b800'];
    const COUNT  = 18;

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = rand(6, 18);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left  = rand(0, 100);
      const dur   = rand(8, 20);
      const delay = rand(0, 15);

      p.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${left}%;
        bottom:-${size}px;
        background:${color};
        animation-duration:${dur}s;
        animation-delay:${delay}s;
      `;

      container.appendChild(p);
    }
  }

  /* ── PARALLAX (hero photo) ─────────────────────────────────*/
  function initParallax () {
    const frame = document.querySelector('.hero__photo-frame');
    if (!frame) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const offset  = scrollY * 0.12;
          frame.style.transform = `translateY(${offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── HOVER RIPPLE on CTAs ──────────────────────────────────*/
  function initRipple () {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect   = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.cssText = `
          position:absolute;
          border-radius:50%;
          transform:scale(0);
          animation:ripple .55s linear;
          background:rgba(255,255,255,0.35);
          width:120px;height:120px;
          left:${x - 60}px;top:${y - 60}px;
          pointer-events:none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 560);
      });
    });

    // Inject ripple keyframe once
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
      document.head.appendChild(s);
    }
  }

  /* ── COUNTDOWN (optional) ──────────────────────────────────*/
  function initCountdown () {
    const target = new Date('2025-06-20T14:00:00');
    // Se a data já passou, não exibe
    if (Date.now() > target.getTime()) return;

    const container = document.querySelector('.hero__content');
    if (!container) return;

    const box = document.createElement('div');
    box.id = 'countdown';
    box.style.cssText = `
      display:flex;gap:10px;margin-top:4px;flex-wrap:wrap;
    `;
    container.querySelector('.hero__ctas').before(box);

    function render () {
      const diff = target - Date.now();
      if (diff <= 0) { box.remove(); return; }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);

      box.innerHTML = [
        ['Dias', d], ['Horas', h], ['Min', m], ['Seg', s]
      ].map(([l, v]) => `
        <div style="
          background:var(--green);color:#fff;
          border-radius:10px;padding:8px 12px;
          text-align:center;min-width:54px;
          font-family:'Nunito',sans-serif;
        ">
          <div style="font-size:1.3rem;font-weight:900;line-height:1">${String(v).padStart(2,'0')}</div>
          <div style="font-size:.6rem;font-weight:700;opacity:.8;letter-spacing:.05em;text-transform:uppercase">${l}</div>
        </div>
      `).join('');
    }

    render();
    setInterval(render, 1000);
  }

  /* ── HELPER ────────────────────────────────────────────────*/
  function rand (min, max) {
    return Math.random() * (max - min) + min;
  }

  /* ── INIT ──────────────────────────────────────────────────*/
  function init () {
    applyConfig();
    initParticles();
    initScrollReveal();
    initParallax();
    initRipple();
    initCountdown();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
