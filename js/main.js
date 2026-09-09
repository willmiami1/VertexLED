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
