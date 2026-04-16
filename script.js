/* ─────────────────────────────────────────
   AUTO DAY / NIGHT THEME
   Day  = 06:00 – 17:59  → light
   Night = 18:00 – 05:59 → dark
───────────────────────────────────────── */
function getAutoTheme() {
  const h = new Date().getHours();
  return (h >= 6 && h < 18) ? 'light' : 'dark';
}

let currentTheme = getAutoTheme();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
  currentTheme = theme;
}

// Apply on load
applyTheme(currentTheme);

// Manual toggle
document.getElementById('themeBtn').addEventListener('click', () => {
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
});

// Re-check every minute so it switches automatically at 6am / 6pm
setInterval(() => {
  applyTheme(getAutoTheme());
}, 60_000);


/* ─────────────────────────────────────────
   NAVBAR DROPDOWN
───────────────────────────────────────── */
const navToggle   = document.getElementById('navToggle');
const dropMenu    = document.getElementById('dropdownMenu');

navToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = dropMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close on any drop-link click
dropMenu.querySelectorAll('.drop-link').forEach(link => {
  link.addEventListener('click', () => {
    dropMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Close on outside click
document.addEventListener('click', () => {
  dropMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
});


/* ─────────────────────────────────────────
   NAVBAR SCROLL SHADOW
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,.12)' : 'none';
}, { passive: true });


/* ─────────────────────────────────────────
   NICKNAME ROTATOR (hero section)
───────────────────────────────────────── */
const nicknames = ['Chid', 'Chidu', 'Cheetos', 'Cheetahbem', 'OrlandoBem', 'Dubem', 'Dube Dube', 'Chi Chi', 'Umi', 'Umizoomi', 'Gigabem', 'Supremebem'];
let nickIdx = 0;
const nickEl = document.getElementById('nicknameDisplay');

function typeNickname(text, cb) {
  nickEl.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    nickEl.textContent += text[i];
    i++;
    if (i === text.length) { clearInterval(t); setTimeout(cb, 1400); }
  }, 80);
}

function eraseNickname(cb) {
  const t = setInterval(() => {
    nickEl.textContent = nickEl.textContent.slice(0, -1);
    if (!nickEl.textContent) { clearInterval(t); cb(); }
  }, 45);
}

function cycleNickname() {
  typeNickname(nicknames[nickIdx], () => {
    eraseNickname(() => {
      nickIdx = (nickIdx + 1) % nicknames.length;
      cycleNickname();
    });
  });
}

cycleNickname();


/* ─────────────────────────────────────────
   PROJECTS  (GitHub repos)
───────────────────────────────────────── */
const projects = [
  {
    name: 'Erdos_Africa',
    desc: 'Data analysis project — Erdős Institute collaboration',
    url:  'https://github.com/Chidubem5/Erdos_Africa',
    lang: 'Jupyter Notebook',
    updated: 'Jan 2026',
  },
  {
    name: 'Gun_Violence',
    desc: 'Interactive comparison tool for gun violence data analysis',
    url:  'https://github.com/Chidubem5/Gun_Violence',
    lang: 'HTML',
    updated: 'Apr 2026',
  },
  {
    name: 'Latex',
    desc: 'Collection of LaTeX documents — papers, reports, and write-ups',
    url:  'https://github.com/Chidubem5/Latex',
    lang: 'LaTeX',
    updated: 'Apr 2026',
  },
  {
    name: 'QC',
    desc: 'Demonstrating quantum computing concepts and experiments',
    url:  'https://github.com/Chidubem5/QC',
    lang: 'Python',
    updated: 'Apr 2026',
  },
  {
    name: 'batesastronomythesis2022',
    desc: 'Code used to supplement Senior Thesis in Astronomy — Spring 2022',
    url:  'https://github.com/Chidubem5/batesastronomythesis2022',
    lang: 'Jupyter Notebook',
    updated: 'Apr 2026',
  },
];

const langMeta = {
  'Jupyter Notebook': { cls: 'lang-jupyter',  label: 'Jupyter Notebook' },
  'Python':           { cls: 'lang-python',   label: 'Python' },
  'HTML':             { cls: 'lang-html',     label: 'HTML' },
  'LaTeX':            { cls: 'lang-latex',    label: 'LaTeX' },
};

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = projects.map(p => {
    const lm = langMeta[p.lang] || { cls: 'lang-default', label: p.lang };
    return `
      <a class="project-card" href="${p.url}" target="_blank" rel="noopener">
        <div class="project-header">
          <span class="project-name">${p.name}</span>
          <span class="project-arrow">↗</span>
        </div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-footer">
          <span class="lang-dot ${lm.cls}"></span>
          <span class="lang-name">${lm.label}</span>
          <span class="project-updated">${p.updated}</span>
        </div>
      </a>`;
  }).join('');
}

renderProjects();


/* ─────────────────────────────────────────
   STAR RATING  (4.3 / 5)
───────────────────────────────────────── */
function renderStars(containerEl, score) {
  const full  = Math.floor(score);
  const half  = score - full >= 0.1 && score - full < 0.9;
  const empty = 5 - full - (half ? 1 : 0);

  const stars =
    '<span class="star full">★</span>'.repeat(full) +
    (half ? '<span class="star half">⯨</span>' : '') +
    '<span class="star">★</span>'.repeat(empty);

  containerEl.innerHTML = stars;
}

document.querySelectorAll('.star-rating').forEach(el => {
  renderStars(el, parseFloat(el.dataset.score));
});


/* ─────────────────────────────────────────
   SLIDESHOW
───────────────────────────────────────── */
const slideState = {};

function initSlideshow(id) {
  const track = document.getElementById(`${id}-track`);
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsEl = document.getElementById(`${id}-dots`);

  slideState[id] = { current: 0, total: slides.length };

  dotsEl.innerHTML = slides.map((_, i) =>
    `<span class="dot${i === 0 ? ' active' : ''}" onclick="goToSlide('${id}', ${i})"></span>`
  ).join('');
}

function goToSlide(id, index) {
  const track  = document.getElementById(`${id}-track`);
  const dotsEl = document.getElementById(`${id}-dots`);
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  const dots   = dotsEl.querySelectorAll('.dot');
  const state  = slideState[id];

  slides[state.current].classList.remove('active');
  dots[state.current]?.classList.remove('active');

  state.current = (index + state.total) % state.total;

  slides[state.current].classList.add('active');
  dots[state.current]?.classList.add('active');
}

window.shiftSlide = function(id, dir) {
  const state = slideState[id];
  if (!state) return;
  goToSlide(id, state.current + dir);
};

window.goToSlide = goToSlide;

/* ─────────────────────────────────────────
   ARTIST SONG TOGGLE
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   SONG PLATFORM LINKS — auto-generated
───────────────────────────────────────── */
document.querySelectorAll('.artist-wrap').forEach(wrap => {
  const artist = wrap.dataset.artist || '';
  wrap.querySelectorAll('.songs-list li').forEach(li => {
    const song = li.textContent.trim();
    const query = encodeURIComponent(`${song} ${artist}`);
    const spotifyUrl     = `https://open.spotify.com/search/${query}`;
    const appleMusicUrl  = `https://music.apple.com/us/search?term=${query}`;

    li.innerHTML = `
      <span class="song-name">♪ ${song}</span>
      <span class="song-platform-links">
        <a href="${spotifyUrl}" target="_blank" class="song-link spotify" title="Play on Spotify">Spotify</a>
        <a href="${appleMusicUrl}" target="_blank" class="song-link apple" title="Play on Apple Music">Apple</a>
      </span>`;
  });
});

window.toggleSongs = function(card) {
  const list = card.nextElementSibling;
  const isOpen = list.classList.contains('open');
  // Close all others first
  document.querySelectorAll('.songs-list.open').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.artist-card.open').forEach(el => el.classList.remove('open'));
  // Toggle clicked one
  if (!isOpen) {
    list.classList.add('open');
    card.classList.add('open');
  }
};

initSlideshow('intl');

/* ─────────────────────────────────────────
   SWIPE SUPPORT FOR SLIDESHOWS (mobile)
───────────────────────────────────────── */
function addSwipe(trackId) {
  const el = document.getElementById(trackId);
  if (!el) return;
  let startX = 0;
  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) shiftSlide(trackId.replace('-track', ''), dx < 0 ? 1 : -1);
  }, { passive: true });
}
addSwipe('intl-track');


/* ─────────────────────────────────────────
   MODELING — LIGHTBOX
───────────────────────────────────────── */
let lbImages = [
  'images/modeling/headshot.jpg',
  'images/modeling/modeling-1.jpg',
  'images/modeling/modeling-2.jpg',
  'images/modeling/modeling-3.jpg',
  'images/modeling/modeling-4.jpg',
  'images/modeling/modeling-5.jpg',
];
let lbCurrent = 0;

function openLightbox(src, index) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src      = src;
  lbCurrent    = index;
  lb.classList.add('open');
}

window.closeLightbox = function() {
  document.getElementById('lightbox').classList.remove('open');
};

window.lbShift = function(e, dir) {
  e.stopPropagation();
  if (!lbImages.length) return;
  lbCurrent = (lbCurrent + dir + lbImages.length) % lbImages.length;
  document.getElementById('lightboxImg').src = lbImages[lbCurrent];
};

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  lbShift(e, -1);
  if (e.key === 'ArrowRight') lbShift(e,  1);
});

/* ─────────────────────────────────────────
   TRAVEL SLIDESHOW — CLICK TO EXPAND
───────────────────────────────────────── */
function initTravelLightbox() {
  const track = document.getElementById('intl-track');
  if (!track) return;

  const imgs = Array.from(track.querySelectorAll('.slide-img'));
  const srcs = imgs.map(img => img.src);

  imgs.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lbImages  = srcs;
      lbCurrent = i;
      openLightbox(srcs[i], i);
    });
  });
}

initTravelLightbox();

/* ─────────────────────────────────────────
   FOOTER YEAR
───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
