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

// Hero video background — activates only if videos/hero.mp4 exists
const heroVideo = document.getElementById('heroVideo');
const heroVideoWrap = document.getElementById('heroVideoWrap');
const heroSection = document.getElementById('hero');

heroVideo.addEventListener('loadeddata', () => {
  heroVideoWrap.hidden = false;
  heroSection.classList.add('has-video');
  heroVideo.play().catch(() => {});
});
heroVideo.addEventListener('error', () => {
  heroVideoWrap.hidden = true;
  heroSection.classList.remove('has-video');
});
heroVideo.querySelector('source').addEventListener('error', () => {
  heroVideoWrap.hidden = true;
  heroSection.classList.remove('has-video');
});
heroVideo.load();

// Animated LED pixel wall in hero
const pixelGrid = document.getElementById('ledPixels');
const COLS = 24;
const ROWS = 14;
const COLORS = ['#2168d1', '#d92b30', '#5ba3f5', '#e57373', '#c9d8ef', '#0a1420', '#0a1420'];

for (let i = 0; i < COLS * ROWS; i++) {
  pixelGrid.appendChild(document.createElement('i'));
}
const pixels = pixelGrid.querySelectorAll('i');

function animatePixels() {
  const t = Date.now() / 1200;
  pixels.forEach((px, i) => {
    const x = i % COLS;
    const y = Math.floor(i / COLS);
    // Traveling wave pattern
    const wave = Math.sin(x / 3.2 - t) + Math.cos(y / 2.4 + t * 0.8);
    if (wave > 0.9) {
      px.style.background = COLORS[(x + y) % 5];
    } else if (wave > 0.2) {
      px.style.background = 'rgba(91, 163, 245, 0.18)';
    } else {
      px.style.background = '#0a1420';
    }
  });
  requestAnimationFrame(animatePixels);
}
animatePixels();

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
