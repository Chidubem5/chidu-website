/* ─────────────────────────────────────────
   MODELING PORTFOLIO GALLERY DATA

   Swap in new photos by editing this array only, the grid markup,
   captions, and lightbox below are all generated from it.

   The first 4 entries are placeholders still borrowed from chidu.dev's
   "Pictures Through The Years" section. The rest, in images/modeling-portfolio/,
   are dedicated shots added 2026-08-26.
───────────────────────────────────────── */
const GALLERY = [
  { src: '../images/modeling/modeling-1.webp', alt: 'Traditional attire on stage', caption: 'Traditional attire, stage', position: 'center 22%' },
  { src: '../images/modeling/Magazine%20cover%201%20-557.webp', alt: 'Magazine cover', caption: 'Magazine cover' },
  { src: '../images/modeling/modeling-7.webp', alt: 'Modeling photo', caption: '', position: 'center 35%' },
  { src: '../images/modeling-portfolio/bts-portrait.webp', alt: 'Behind the scenes, portrait', caption: 'Behind the scenes', zoom: 0.92, position: 'center 55%' },
  { src: '../images/modeling-portfolio/stairwell-editorial.webp', alt: 'Editorial, stairwell', caption: 'Editorial, stairwell', position: 'center 15%' },
  { src: '../images/modeling-portfolio/runway-guard-buoy.webp', alt: 'Runway show, lifeguard rescue buoy', caption: 'Runway, editorial' },
  { src: '../images/modeling-portfolio/rewrite-romance-portrait.webp', alt: 'Rewrite Romance editorial, rose petal mask', caption: 'Rewrite Romance, editorial' },
  { src: '../images/modeling-portfolio/red-green-portrait.webp', alt: 'Studio portrait, red and green lighting', caption: 'Studio, editorial' },
];

// Editorial rhythm: alternating wide (8-col) / narrow (4-col) tiles on a
// 12-col grid, pairs sum to 12 so rows stay flush. Collapses to one column
// on mobile via CSS regardless of this pattern.
const SPAN_PATTERN = ['wide', 'narrow', 'narrow', 'wide', 'wide', 'narrow', 'narrow', 'wide'];

const grid = document.getElementById('galleryGrid');

GALLERY.forEach((photo, i) => {
  const item = document.createElement('div');
  // A trailing tile left alone in its row (odd total) spans full width
  // instead of leaving a dead gap next to it.
  const isTrailingOrphan = i === GALLERY.length - 1 && GALLERY.length % 2 === 1;
  const span = isTrailingOrphan ? 'full' : SPAN_PATTERN[i % SPAN_PATTERN.length];
  item.className = 'gallery-item reveal ' + span;

  const num = String(i + 1).padStart(2, '0');

  const styleDecls = [];
  if (photo.position) styleDecls.push(`object-position: ${photo.position}`);
  if (photo.zoom) styleDecls.push(`--zoom: ${photo.zoom}`);
  const styleAttr = styleDecls.length ? ` style="${styleDecls.join('; ')};"` : '';

  item.innerHTML = `
    <figure class="gallery-figure">
      <div class="gallery-photo-wrap" data-index="${i}">
        <span class="gallery-index">${num}</span>
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async"${styleAttr} />
      </div>
      <figcaption class="gallery-caption">${photo.caption}</figcaption>
    </figure>
  `;
  grid.appendChild(item);
});

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxMeta = document.getElementById('lightboxMeta');
let currentIndex = 0;
let lastFocused = null;

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lastFocused = document.activeElement;
  document.getElementById('lightboxClose').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function renderLightbox() {
  const photo = GALLERY[currentIndex];
  lightboxImg.src = photo.src;
  lightboxImg.alt = photo.alt;
  const num = String(currentIndex + 1).padStart(2, '0');
  const total = String(GALLERY.length).padStart(2, '0');
  lightboxMeta.textContent = photo.caption ? `${num} / ${total}  ·  ${photo.caption}` : `${num} / ${total}`;
}

function shiftLightbox(delta) {
  currentIndex = (currentIndex + delta + GALLERY.length) % GALLERY.length;
  renderLightbox();
}

grid.addEventListener('click', (e) => {
  const wrap = e.target.closest('.gallery-photo-wrap');
  if (!wrap) return;
  openLightbox(Number(wrap.dataset.index));
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', (e) => { e.stopPropagation(); shiftLightbox(-1); });
document.getElementById('lightboxNext').addEventListener('click', (e) => { e.stopPropagation(); shiftLightbox(1); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftLightbox(-1);
  if (e.key === 'ArrowRight') shiftLightbox(1);
});
