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

// ============ INSTAGRAM FEED (Image Gallery) ============
// Paste the Behold.so JSON feed URL below to switch the gallery
// from static images to the live @vertexled Instagram feed.
const INSTAGRAM_FEED_URL = '';

if (INSTAGRAM_FEED_URL) {
  fetch(INSTAGRAM_FEED_URL)
    .then((r) => r.json())
    .then((data) => {
      const posts = (data.posts || data).slice(0, 8);
      if (!posts.length) return;
      const grid = document.getElementById('galleryGrid');
      grid.innerHTML = '';
      posts.forEach((post) => {
        const img =
          post.thumbnailUrl ||
          (post.sizes && post.sizes.medium && post.sizes.medium.mediaUrl) ||
          post.mediaUrl;
        const caption = (post.prunedCaption || post.caption || '').slice(0, 80);
        const a = document.createElement('a');
        a.className = 'gallery-item';
        a.href = post.permalink;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = `<img src="${img}" alt="${caption.replace(/"/g, '&quot;')}" loading="lazy"><figcaption>${caption}</figcaption>`;
        grid.appendChild(a);
      });
    })
    .catch(() => {}); // keep static gallery on failure
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
