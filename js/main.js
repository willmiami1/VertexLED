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
// Vertex Pro panels: pw/ph = panel size (mm), pxW/pxH = pixels per panel
const CALC_MODELS = {
  p19i: { name: 'P1.9 Indoor', pw: 500, ph: 500, pxW: 256, pxH: 256, price: 730, view: 6 },
  p25i: { name: 'P2.5 Indoor', pw: 500, ph: 500, pxW: 200, pxH: 200, price: 580, view: 8 },
  p29i: { name: 'P2.9 Indoor', pw: 500, ph: 500, pxW: 168, pxH: 168, price: 430, view: 10 },
  p39i: { name: 'P3.9 Indoor', pw: 500, ph: 500, pxW: 128, pxH: 128, price: 380, view: 13 },
  p29o: { name: 'P2.9 Outdoor', pw: 500, ph: 500, pxW: 168, pxH: 168, price: 580, view: 10 },
  p39o: { name: 'P3.9 Outdoor', pw: 500, ph: 500, pxW: 128, pxH: 128, price: 480, view: 13 },
  ht12: { name: 'Home Theater P1.2', pw: 1000, ph: 250, pxW: 800, pxH: 200, price: 690, view: 4 },
  ht19: { name: 'Home Theater P1.9', pw: 1000, ph: 250, pxW: 512, pxH: 128, price: 490, view: 6 },
  ht25: { name: 'Home Theater P2.5', pw: 1000, ph: 250, pxW: 400, pxH: 100, price: 390, view: 8 },
};

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
    const wFt = (w * m.pw) / 304.8;
    const hFt = (h * m.ph) / 304.8;
    const wM = (w * m.pw) / 1000;
    const hM = (h * m.ph) / 1000;
    const count = w * h;
    const g = gcd(w * m.pw, h * m.ph);

    document.getElementById('calcPanelNote').textContent =
      `Each ${m.name} panel is ${m.pw} × ${m.ph} mm (${(m.pw / 304.8).toFixed(2)} × ${(m.ph / 304.8).toFixed(2)} ft).`;
    document.getElementById('calcSize').textContent =
      `${wFt.toFixed(1)} ft × ${hFt.toFixed(1)} ft`;
    document.getElementById('calcSizeM').textContent =
      `${wM.toFixed(1)} m × ${hM.toFixed(1)} m`;
    document.getElementById('calcCount').textContent =
      `${count} panels (${w} × ${h})`;
    document.getElementById('calcRatio').textContent =
      `Aspect ratio ${(w * m.pw) / g}:${(h * m.ph) / g}`;
    document.getElementById('calcRes').textContent =
      `${fmt(w * m.pxW)} × ${fmt(h * m.pxH)} px`;
    document.getElementById('calcPixels').textContent =
      `${fmt(w * m.pxW * h * m.pxH)} total pixels`;
    document.getElementById('calcView').textContent = `${m.view} ft +`;
    document.getElementById('calcPrice').textContent =
      `From $${fmt(count * m.price)}`;
    document
      .getElementById('calcQuoteBtn')
      .setAttribute(
        'data-product',
        `Custom LED Wall — ${m.name}, ${w} × ${h} panels (${wFt.toFixed(1)}' × ${hFt.toFixed(1)}'), est. $${fmt(count * m.price)}`
      );

    // Screen build preview — panel grid at true aspect ratio
    const preview = document.getElementById('calcPreview');
    const ratio = (w * m.pw) / (h * m.ph);
    preview.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    preview.style.aspectRatio = ratio;
    preview.style.maxWidth = `min(100%, ${Math.round(300 * ratio)}px)`;
    preview.innerHTML = '<span class="calc-cell"></span>'.repeat(count);
    document.getElementById('calcPreviewLabel').textContent =
      `${m.name} — ${w} × ${h} panels, ${wFt.toFixed(1)}' wide × ${hFt.toFixed(1)}' tall`;
  };

  [calcModel, calcW, calcH].forEach((el) => {
    el.addEventListener('input', runCalc);
    el.addEventListener('change', runCalc);
  });
  runCalc();
}

// ============ INSTAGRAM GALLERY + LIGHTBOX ============
// Custom renderer for the Behold.so feed: media opens in an
// on-site lightbox (videos play inline) instead of Instagram.
const GALLERY_FEED = 'https://feeds.behold.so/2czLchW9lcKalZulQGvL';
const galleryGrid = document.getElementById('galleryGrid');

if (galleryGrid) {
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbCaption = document.getElementById('lbCaption');
  let items = [];
  let current = 0;

  const mediaSrc = (p) =>
    (p.sizes && p.sizes.large && p.sizes.large.mediaUrl) || p.mediaUrl;
  const thumbSrc = (p) =>
    p.thumbnailUrl || (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.mediaUrl;

  const showItem = (i) => {
    current = (i + items.length) % items.length;
    const it = items[current];
    lbContent.innerHTML = it.video
      ? `<video src="${it.src}" controls autoplay playsinline></video>`
      : `<img src="${it.src}" alt="">`;
    lbCaption.innerHTML = `${it.caption ? it.caption + ' ' : ''}<a href="${it.permalink}" target="_blank" rel="noopener">View on Instagram ↗</a>`;
  };
  const openLightbox = (i) => {
    showItem(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    lbContent.innerHTML = ''; // stops any playing video
    document.body.style.overflow = '';
  };

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => showItem(current - 1));
  document.getElementById('lbNext').addEventListener('click', () => showItem(current + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showItem(current - 1);
    if (e.key === 'ArrowRight') showItem(current + 1);
  });

  fetch(GALLERY_FEED)
    .then((r) => r.json())
    .then((data) => {
      const posts = data.posts || [];
      if (!posts.length) return;
      if (posts.length >= 8) galleryGrid.classList.add('gallery-grid-4');
      const esc = (s) => (s || '').replace(/</g, '&lt;').replace(/"/g, '&quot;');

      posts.forEach((post) => {
        // Carousel albums expand into their individual photos/videos
        const media = post.mediaType === 'CAROUSEL_ALBUM' && post.children && post.children.length
          ? post.children
          : [post];
        const firstIndex = items.length;
        media.forEach((m) => {
          items.push({
            video: m.mediaType === 'VIDEO',
            // videos must use the raw mediaUrl — "sizes" are image thumbnails
            src: m.mediaType === 'VIDEO' ? m.mediaUrl : mediaSrc(m),
            caption: esc((post.prunedCaption || post.caption || '').slice(0, 140)),
            permalink: post.permalink,
          });
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gallery-item';
        btn.innerHTML =
          `<img src="${thumbSrc(post)}" alt="${esc((post.prunedCaption || '').slice(0, 60)) || 'VertexLED Instagram post'}" loading="lazy">` +
          (post.mediaType === 'VIDEO' ? '<span class="gallery-play">▶</span>' : '') +
          `<span class="gallery-caption">${esc((post.prunedCaption || '').slice(0, 60))}</span>`;
        btn.addEventListener('click', () => openLightbox(firstIndex));
        galleryGrid.appendChild(btn);
      });
    })
    .catch(() => {
      galleryGrid.innerHTML =
        '<p class="section-note">Gallery is loading slowly — <a href="https://www.instagram.com/vertexled/" target="_blank" rel="noopener">see our latest work on Instagram →</a></p>';
    });
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
