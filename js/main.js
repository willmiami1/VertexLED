// ============ VERTEXLED — MAIN JS ============

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal animation
const revealTargets = document.querySelectorAll(
  '.product-card, .package-card, .app-card, .process-step, .faq-item, .quote-card-testimonial, .section-head'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => observer.observe(el));

// Pre-fill quote form when a product "Get Quote" button is clicked
document.querySelectorAll('[data-product]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const message = document.getElementById('message');
    const product = btn.getAttribute('data-product');
    if (message && !message.value.includes(product)) {
      message.value = `I'm interested in: ${product}\n${message.value}`;
    }
  });
});

// ============ LED WALL CALCULATOR ============
// All specs based on Vertex Pro 500 x 500 mm panels
const CALC_MODELS = {
  p19i: { name: 'P1.9 Indoor', px: 256, price: 730, view: 6, pitch: 1.9 },
  p25i: { name: 'P2.5 Indoor', px: 200, price: 580, view: 8, pitch: 2.5 },
  p29i: { name: 'P2.9 Indoor', px: 168, price: 430, view: 10, pitch: 2.9 },
  p39i: { name: 'P3.9 Indoor / Rental', px: 128, price: 380, view: 13, pitch: 3.9 },
  p29o: { name: 'P2.9 Outdoor', px: 168, price: 580, view: 10, pitch: 2.9 },
  p39o: { name: 'P3.9 Outdoor', px: 128, price: 480, view: 13, pitch: 3.9 },
};
const PANEL_MM = 500; // panel is 500 x 500 mm

const calcModel = document.getElementById('calcModel');
if (calcModel) {
  const calcW = document.getElementById('calcW');
  const calcH = document.getElementById('calcH');
  const fmt = (n) => n.toLocaleString('en-US');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  const runCalc = () => {
    const m = CALC_MODELS[calcModel.value];
    const w = Math.min(Math.max(parseInt(calcW.value, 10) || 1, 1), 40);
    const h = Math.min(Math.max(parseInt(calcH.value, 10) || 1, 1), 20);
    const wFt = (w * PANEL_MM) / 304.8;
    const hFt = (h * PANEL_MM) / 304.8;
    const wM = (w * PANEL_MM) / 1000;
    const hM = (h * PANEL_MM) / 1000;
    const count = w * h;
    const g = gcd(w, h);

    document.getElementById('calcSize').textContent =
      `${wFt.toFixed(1)} ft × ${hFt.toFixed(1)} ft`;
    document.getElementById('calcSizeM').textContent =
      `${wM.toFixed(1)} m × ${hM.toFixed(1)} m`;
    document.getElementById('calcCount').textContent =
      `${count} panels (${w} × ${h})`;
    document.getElementById('calcRatio').textContent =
      `Aspect ratio ${w / g}:${h / g}`;
    document.getElementById('calcRes').textContent =
      `${fmt(w * m.px)} × ${fmt(h * m.px)} px`;
    document.getElementById('calcPixels').textContent =
      `${fmt(w * m.px * h * m.px)} total pixels`;
    document.getElementById('calcView').textContent = `${m.view} ft +`;
    document.getElementById('calcPrice').textContent =
      `From $${fmt(count * m.price)}`;
    document
      .getElementById('calcQuoteBtn')
      .setAttribute(
        'data-product',
        `Custom LED Wall — ${m.name}, ${w} × ${h} panels (${wFt.toFixed(1)}' × ${hFt.toFixed(1)}'), est. $${fmt(count * m.price)}`
      );
  };

  [calcModel, calcW, calcH].forEach((el) => {
    el.addEventListener('input', runCalc);
    el.addEventListener('change', runCalc);
  });
  runCalc();
}

// Quote form submission (opens user's email client with details pre-filled)
document.getElementById('quoteForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const body = [
    `Name: ${f.name.value}`,
    `Company: ${f.company.value || '-'}`,
    `Email: ${f.email.value}`,
    `Phone: ${f.phone.value || '-'}`,
    `Interested in: ${f.interest.value}`,
    `Approx. size: ${f.size.value || '-'}`,
    '',
    'Project details:',
    f.message.value || '-',
  ].join('\n');
  const subject = `LED Screen Quote Request — ${f.name.value}`;
  window.location.href = `mailto:sales@vertexled.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
