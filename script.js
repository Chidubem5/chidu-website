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
    (half ? '<span class="star half">★</span>' : '') +
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

function shuffleSlides(track) {
  const slides = Array.from(track.querySelectorAll('.slide'));
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    track.appendChild(slides[j]);
    slides.splice(j, 1, slides[i]);
  }
}

function initSlideshow(id, autoplay = false, interval = 5000) {
  const track = document.getElementById(`${id}-track`);
  if (!track) return;

  // Randomize order
  shuffleSlides(track);

  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsEl = document.getElementById(`${id}-dots`);

  // Reset active state after shuffle
  slides.forEach(s => s.classList.remove('active'));
  slides[0].classList.add('active');

  slideState[id] = { current: 0, total: slides.length, timer: null };

  dotsEl.innerHTML = slides.map((_, i) =>
    `<span class="dot${i === 0 ? ' active' : ''}" onclick="goToSlide('${id}', ${i})"></span>`
  ).join('');

  if (autoplay) startAutoplay(id, interval);
}

function startAutoplay(id, interval = 5000) {
  const state = slideState[id];
  if (!state) return;
  clearInterval(state.timer);
  state.timer = setInterval(() => _goToSlide(id, state.current + 1), interval);
}

function pauseAutoplay(id, resumeAfter = 8000) {
  const state = slideState[id];
  if (!state || !state.timer) return;
  clearInterval(state.timer);
  setTimeout(() => startAutoplay(id, 5000), resumeAfter);
}

function adaptSlideshow(id) {
  const track   = document.getElementById(`${id}-track`);
  const wrapper = track && track.closest('.slideshow-wrapper');
  if (!track || !wrapper) return;

  const activeImg = track.querySelector('.slide.active .slide-img');
  if (!activeImg) return;

  // Force eager loading so naturalWidth is available ASAP
  activeImg.loading = 'eager';

  const apply = () => {
    const nw = activeImg.naturalWidth;
    const nh = activeImg.naturalHeight;
    if (!nw || !nh) return;

    const ratio      = nw / nh;
    const available  = wrapper.parentElement.offsetWidth || window.innerWidth;
    const isPortrait = nh > nw;

    let newH, newMaxW;

    if (isPortrait) {
      newH    = Math.min(580, Math.round(available * 0.85 / ratio));
      newMaxW = Math.round(newH * ratio) + 'px';
    } else {
      newMaxW = '100%';
      newH    = Math.min(520, Math.max(260, Math.round(available / ratio)));
    }

    track.style.height     = newH + 'px';
    wrapper.style.maxWidth = newMaxW;
  };

  if (activeImg.complete && activeImg.naturalWidth) {
    apply();
  } else {
    activeImg.addEventListener('load', apply, { once: true });
    // Retry after short delay in case load event already fired
    setTimeout(() => {
      if (activeImg.naturalWidth) apply();
    }, 300);
  }
}

function _goToSlide(id, index) {
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

  adaptSlideshow(id);
}

window.shiftSlide = function(id, dir) {
  const state = slideState[id];
  if (!state) return;
  pauseAutoplay(id);
  _goToSlide(id, state.current + dir);
};

window.goToSlide = function(id, index) {
  pauseAutoplay(id);
  _goToSlide(id, index);
};

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

initSlideshow('intl', true, 4000);
adaptSlideshow('intl');

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
    if (Math.abs(dx) > 40) {
      const id = trackId.replace('-track', '');
      pauseAutoplay(id);
      shiftSlide(id, dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}
addSwipe('intl-track');


/* ─────────────────────────────────────────
   MODELING — LIGHTBOX
───────────────────────────────────────── */
let lbImages = [
  'images/modeling/modeling-1.jpg',
  'images/modeling/modeling-2.jpg',
  'images/modeling/modeling-3.jpg',
  'images/modeling/modeling-4.jpg',
  'images/modeling/modeling-5.jpg',
  'images/modeling/Magazine%20cover%201%20-557.JPG',
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
   ANIME POSTER LOADER  (Jikan / MAL API)
───────────────────────────────────────── */
async function fetchWithRetry(url, retries = 2, delay = 800) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) throw new Error('rate limited');
      return await res.json();
    } catch (_) {
      if (i < retries) await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  return null;
}

async function loadAnimePosters() {
  const cards = Array.from(document.querySelectorAll('.anime-card[data-mal-id]'));
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const type = card.dataset.malType;
    const id   = card.dataset.malId;
    const img  = card.querySelector('.anime-poster');
    if (!img) continue;
    const json = await fetchWithRetry(`https://api.jikan.moe/v4/${type}/${id}`);
    const url  = json?.data?.images?.jpg?.large_image_url || json?.data?.images?.jpg?.image_url;
    if (url) img.src = url;
    // 500ms between requests — safely under Jikan's 3 req/s limit
    if (i < cards.length - 1) await new Promise(r => setTimeout(r, 500));
  }
}

loadAnimePosters();

/* ─────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────── */
const scrollProgressEl = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled  = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgressEl.style.width = ((scrolled / maxScroll) * 100) + '%';
}, { passive: true });


/* ─────────────────────────────────────────
   SCROLL-TRIGGERED ENTRANCE ANIMATIONS
───────────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.section-title, .section-sub, .about-text p, .about-languages, .tag-list, .linkedin-btn,' +
    '.research-card, .project-card, .artist-card, .anime-card, .comedian-card,' +
    '.book-card, .game-card, .sub-heading'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    // Only animate elements below the visible fold on load
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.95) {
      el.classList.add('fade-up');
      observer.observe(el);
    }
  });
}

// Run after DOM is fully painted
requestAnimationFrame(initScrollAnimations);


/* ─────────────────────────────────────────
   BACKGROUND MUSIC PLAYER
───────────────────────────────────────── */
const bgAudio     = document.getElementById('bgAudio');
const musicToggle = document.getElementById('musicToggle');
const musicPlayer = document.getElementById('musicPlayer');
const musicLabel  = document.getElementById('musicLabel');

const jazzPlaylist = [
  { title: 'Bossa Antigua',    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Bossa%20Antigua.mp3' },
  { title: 'Sneaky Snitch',    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sneaky%20Snitch.mp3' },
  { title: 'Latin Industries', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Latin%20Industries.mp3' },
  { title: 'Fillmore',         url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fillmore.mp3' },
];

// Start from a random track
let currentTrack = Math.floor(Math.random() * jazzPlaylist.length);

function loadTrack(index) {
  const track = jazzPlaylist[index];
  bgAudio.src = track.url;
  bgAudio.load();
  musicLabel.textContent = `${track.title} · Kevin MacLeod`;
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % jazzPlaylist.length;
  loadTrack(currentTrack);
  bgAudio.volume = 0.025;
  bgAudio.play().catch(() => {});
}

// Advance to next song when current one ends
bgAudio.addEventListener('ended', nextTrack);

loadTrack(currentTrack);

function fadeAudio(targetVol, duration = 1400) {
  const start    = bgAudio.volume;
  const diff     = targetVol - start;
  const steps    = 40;
  const interval = duration / steps;
  let   step     = 0;
  const timer = setInterval(() => {
    step++;
    bgAudio.volume = Math.min(1, Math.max(0, start + diff * (step / steps)));
    if (step >= steps) {
      clearInterval(timer);
      if (targetVol === 0) bgAudio.pause();
    }
  }, interval);
}

function startPlaying() {
  bgAudio.volume = 0;
  bgAudio.play().then(() => {
    musicPlayer.classList.add('playing');
    musicToggle.setAttribute('aria-label', 'Pause music');
    fadeAudio(0.025);
  }).catch(() => {});
}

// Try immediate autoplay (works if browser allows)
startPlaying();

// Fallback: start on first user interaction
let unlocked = false;
function unlockMusic() {
  if (unlocked) return;
  unlocked = true;
  startPlaying();
}
document.addEventListener('scroll',     unlockMusic, { passive: true, once: true });
document.addEventListener('click',      unlockMusic, { once: true });
document.addEventListener('touchstart', unlockMusic, { passive: true, once: true });

// Manual toggle
musicToggle.addEventListener('click', () => {
  unlocked = true;
  if (bgAudio.paused) {
    startPlaying();
  } else {
    musicPlayer.classList.remove('playing');
    musicToggle.setAttribute('aria-label', 'Play music');
    fadeAudio(0);
  }
});

/* ─────────────────────────────────────────
   FOOTER YEAR
───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ─────────────────────────────────────────
   INFINITY MIRROR BACKGROUND  (canvas)
   Concentric rounded rectangles recede to
   a vanishing point — slowly drifting
   inward like looking through two mirrors.
───────────────────────────────────────── */
(function initMirrorBg() {
  const canvas = document.getElementById('mirrorBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, cx, cy;
  let tick = 0;
  const LAYERS = 30;
  const DRIFT  = 0.00028; // very slow forward drift

  /* Draw a rounded rectangle path */
  function roundRect(x, y, rw, rh, r) {
    r = Math.min(r, rw / 2, rh / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + rw - r, y);
    ctx.arcTo(x + rw, y,      x + rw, y + r,      r);
    ctx.lineTo(x + rw, y + rh - r);
    ctx.arcTo(x + rw, y + rh, x + rw - r, y + rh, r);
    ctx.lineTo(x + r,  y + rh);
    ctx.arcTo(x,       y + rh, x,         y + rh - r, r);
    ctx.lineTo(x,      y + r);
    ctx.arcTo(x,       y,      x + r,     y,          r);
    ctx.closePath();
  }

  function draw() {
    tick += DRIFT;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';

    /* Base fill — matches --bg custom property */
    ctx.fillStyle = dark ? '#0a0a0a' : '#f7f7f9';
    ctx.fillRect(0, 0, w, h);

    /* Accent colour per theme */
    const [ar, ag, ab] = dark ? [167, 139, 250] : [124, 58, 237];

    /* Concentric frames — drift from edge → centre, loop */
    for (let i = 0; i < LAYERS; i++) {
      /* raw: 0 = centre/far, 1 = edge/near; advances with tick */
      const raw = ((i / LAYERS) - (tick % 1) + 1) % 1;

      /* Non-linear curve: frames bunch up near centre (depth illusion) */
      const scale = Math.pow(raw, 1.55);
      if (scale < 0.004) continue;

      const fw = Math.max(2, w * scale);
      const fh = Math.max(2, h * scale);
      const fx = (w - fw) / 2;
      const fy = (h - fh) / 2;

      /* Corner radius scales with frame size */
      const radius = scale * 26;

      /* Opacity: bright near edges, fades toward vanishing point */
      const alpha  = dark
        ? Math.pow(raw, 0.65) * 0.58
        : Math.pow(raw, 0.65) * 0.36;
      const lw     = Math.max(0.4, scale * 3.0);

      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha})`;
      ctx.lineWidth   = lw;
      roundRect(fx, fy, fw, fh, radius);
      ctx.stroke();
    }

    /* Radial vignette — darkens corners for tunnel depth */
    const vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(cx, cy));
    if (dark) {
      vig.addColorStop(0,    'rgba(0,0,0,0)');
      vig.addColorStop(0.50, 'rgba(0,0,0,0)');
      vig.addColorStop(1,    'rgba(0,0,0,0.75)');
    } else {
      vig.addColorStop(0,    'rgba(0,0,0,0)');
      vig.addColorStop(0.50, 'rgba(0,0,0,0)');
      vig.addColorStop(1,    'rgba(0,0,0,0.16)');
    }
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    requestAnimationFrame(draw);
  }

  function resize() {
    w  = canvas.width  = window.innerWidth;
    h  = canvas.height = window.innerHeight;
    cx = w / 2;
    cy = h / 2;
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
