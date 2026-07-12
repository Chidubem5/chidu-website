/* ─────────────────────────────────────────
   AUTO DAY / NIGHT THEME

   Reads the current hour and applies light (6am–6pm) or dark (6pm–6am).
   A manual toggle sets a localStorage override so the auto-switch never
   fights the user's choice, and the choice survives page reloads.
───────────────────────────────────────── */

function getAutoTheme() {
  const h = new Date().getHours();
  return (h >= 6 && h < 18) ? 'light' : 'dark';
}

const THEME_OVERRIDE_KEY = 'themeOverride';
const savedTheme = localStorage.getItem(THEME_OVERRIDE_KEY);
let userOverride = savedTheme === 'light' || savedTheme === 'dark';
let currentTheme = userOverride ? savedTheme : getAutoTheme();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
  currentTheme = theme;
}

applyTheme(currentTheme);

document.getElementById('themeBtn').addEventListener('click', () => {
  userOverride = true;
  const next = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_OVERRIDE_KEY, next);
  applyTheme(next);
});

// Re-checks the clock every minute so the theme switches automatically at
// 6am/6pm for visitors who haven't manually overridden it.
setInterval(() => {
  if (!userOverride) applyTheme(getAutoTheme());
}, 60_000);


/* ─────────────────────────────────────────
   NAVBAR DROPDOWN

   The Menu button toggles the dropdown open/closed.
   - classList.toggle('open') adds the class if it's absent, removes it if present.
   - setAttribute('aria-expanded', open) keeps screen readers in sync — they
     announce "Menu button, expanded" or "Menu button, collapsed" accordingly.
───────────────────────────────────────── */
// Get references to elements by their id attributes in the HTML
const navToggle   = document.getElementById('navToggle');
const dropMenu    = document.getElementById('dropdownMenu');

navToggle.addEventListener('click', (e) => {
  // e.stopPropagation() prevents this click from "bubbling" up to the document.
  // Without this, the document click listener below would immediately close
  // the menu the same instant it was opened.
  e.stopPropagation();
  // toggle returns true if the class was added, false if removed
  const open = dropMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);    // second arg = force add/remove
  navToggle.setAttribute('aria-expanded', open);
});

// Close the dropdown whenever a link inside it is clicked
// querySelectorAll returns a NodeList (like an array) of all matching elements.
// .forEach() loops over each one and adds the same click listener.
dropMenu.querySelectorAll('.drop-link').forEach(link => {
  link.addEventListener('click', () => {
    dropMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Close when clicking ANYWHERE outside the dropdown
document.addEventListener('click', () => {
  dropMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
});


/* ─────────────────────────────────────────
   NAVBAR SCROLL SHADOW

   window.addEventListener('scroll', ...) fires every time the user scrolls.
   { passive: true } is a performance hint — tells the browser this listener
   won't call preventDefault(), so the browser doesn't need to wait for it
   before scrolling. Makes scrolling smoother.
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  // If scrolled more than 10px from top, add a shadow; otherwise remove it.
  // This gives the navbar a "lifted" look when content scrolls behind it.
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,.12)' : 'none';
}, { passive: true });


/* ─────────────────────────────────────────
   TYPEWRITER HELPERS

   Shared char-by-char type/erase loop used by both the hero nickname
   rotator and the quotes rotator below — they differ only in speed and
   in what happens during the hold between typing and erasing.
───────────────────────────────────────── */
function typewriterType(el, text, ms, cb) {
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i === text.length) { clearInterval(t); cb(); }
  }, ms);
}

function typewriterErase(el, ms, cb) {
  const t = setInterval(() => {
    el.textContent = el.textContent.slice(0, -1);
    if (!el.textContent) { clearInterval(t); cb(); }
  }, ms);
}

/* ─────────────────────────────────────────
   NICKNAME ROTATOR (hero section)
───────────────────────────────────────── */
const _nickRest = ['Chid', 'Cheetos', 'Cheetahbem', 'OrlandoBem', 'Dubem', 'Dube Dube', 'Chi Chi', 'Umi', 'Umizoomi', 'Gigabem', 'Supremebem'];
for (let i = _nickRest.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [_nickRest[i], _nickRest[j]] = [_nickRest[j], _nickRest[i]];
}
const nicknames = ['Chidu', ..._nickRest];
let nickIdx = 0;
const nickEl = document.getElementById('nicknameDisplay');

function cycleNickname() {
  typewriterType(nickEl, nicknames[nickIdx], 80, () => {
    setTimeout(() => {
      typewriterErase(nickEl, 45, () => {
        nickIdx = (nickIdx + 1) % nicknames.length;
        cycleNickname();
      });
    }, 1400);
  });
}

cycleNickname();   // hero is always visible on load, so this starts immediately


/* ─────────────────────────────────────────
   IMPACTFUL QUOTES ROTATOR

   Types each quote letter by letter with a blinking cursor that follows
   the end of the text. Once fully typed, the attribution fades in.
   After a reading pause, the attribution fades out and the text erases
   right-to-left before the next quote begins.
───────────────────────────────────────── */
const quotes = [
  { text: '"If you think you are too small to make a difference, you haven\'t spent a night with a mosquito."', attr: '— Mom' },
  { text: '"Smart people learn from their mistakes; wise people learn from the mistakes of others."', attr: '— Charlamagne tha God' },
  { text: '"Four quarters are better than one-hundred pennies."', attr: '— Mom; African Proverbs' },
  { text: '"You don\'t realize now what I am doing, but later you will understand."', attr: '— John 13:7' },
  { text: '"A man who stands for nothing will fall for anything."', attr: '— Malcolm X' },
  { text: '"Easy day, hard life. Hard today, easy life."', attr: '' },
  { text: '"Being in a relationship is proving that you can love yourself and others."', attr: '' },
  { text: '"A knowledgeable person learns while a wise person unlearns."', attr: '' },
  { text: '"The little things help you celebrate the big things along the way."', attr: '' },
  { text: '"The grass doesn\'t need to be greener."', attr: '' },
  { text: '"They will pay one of us to kill one of us, just to say it was one of us."', attr: '— Malcolm X' },
  { text: '"Imagine everyone is pointing a gun at your head. It\'s up to you how many bullets you give them."', attr: '— Triple H' },
  { text: '"When I was born, I looked like my parents. When I die, I\'ll look like my decisions."', attr: '' },
  { text: '"The grass is greener on the other side because it\'s fertilized with bs."', attr: '' },
  { text: '"Water seeks its own level."', attr: '' },
  { text: '"If you are lonely when you are alone then you are in bad company."', attr: '— Jean-Paul Sartre' },
  { text: '"If you aim at nothing, you hit nothing."', attr: '' },
  { text: '"There\'s nothing wrong with limits as long as you set them."', attr: '' },
  { text: '"I was in darkness but I took three steps and found myself in paradise. The first step was a good thought, the second a good word, and the third, a good deed."', attr: '— Zoroastrian proverb' },
  { text: '"People are more likely to do what you want them to do when they were included in the process."', attr: '' },
  { text: '"To treat your children all the same, you have to treat them differently."', attr: '' },
  { text: '"If you realized how powerful your thoughts are, you would never think a negative thought."', attr: '' },
  { text: '"You are what you try."', attr: '' },
  { text: '"Effort without execution gets you sweaty."', attr: '' },
];

let quoteIdx = 0;
const quoteEl  = document.getElementById('quoteDisplay');
const quoteAttrEl = document.getElementById('quoteAttr');

function cycleQuote() {
  const { text, attr } = quotes[quoteIdx];
  typewriterType(quoteEl, text, 38, () => {
    setTimeout(() => {
      quoteAttrEl.textContent = attr || '';
      if (attr) quoteAttrEl.classList.add('visible');
      setTimeout(() => {
        quoteAttrEl.classList.remove('visible');
        setTimeout(() => {
          quoteAttrEl.textContent = '';
          typewriterErase(quoteEl, 20, () => {
            quoteIdx = (quoteIdx + 1) % quotes.length;
            cycleQuote();
          });
        }, 350);
      }, 5000);
    }, 400);
  });
}

// The quotes section sits near the bottom of the page — don't run this
// forever off-screen for visitors who never scroll that far. Start it
// the first time the section actually enters the viewport.
const quoteSection = document.getElementById('quotes');
if (quoteSection) {
  const quoteSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cycleQuote();
        quoteSectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  quoteSectionObserver.observe(quoteSection);
}


/* ─────────────────────────────────────────
   PROJECTS (GitHub repos)

   Project data lives here as a JS array. renderProjects() turns it into
   HTML and injects it into #projectsGrid — updating a project just means
   editing this array, not the HTML.

   `updated` starts as a hardcoded fallback (so the card has a date on the
   very first paint with no network dependency) and hydrateProjectDates()
   below quietly overwrites it with each repo's real last-pushed date from
   the GitHub API once that request resolves. `repo` is the slug used for
   that API call; `github` is only set when the card's main link (`url`)
   points somewhere other than the repo itself (a live demo), so a second
   "GitHub ↗" link is worth showing. `live` marks a project with a real
   deployed site, independent of whether a separate GitHub link exists.
───────────────────────────────────────── */
const projects = [
  {
    name: 'Split Tank',
    desc: 'Web app for splitting gas costs on road trips and carpools. Pulls live weekly gas prices from the EIA API, looks up real MPG via FuelEconomy.gov, and generates Venmo / Cash App / Zelle payment links with the exact amount pre-filled.',
    url:  'https://splittank.com',
    github: 'https://github.com/Chidubem5/splittank',
    repo: 'splittank',
    lang: 'React',
    live: true,
    updated: 'Jun 2026',
  },
  {
    name: 'Gun Violence Data Explorer',
    desc: 'Data exploration challenging common narratives around gun violence in the US — examining victim demographics adjusted for population proportionality.',
    url:  'https://github.com/Chidubem5/Gun_Violence',
    github: 'https://github.com/Chidubem5/Gun_Violence',
    repo: 'Gun_Violence',
    lang: 'HTML',
    live: true,
    updated: 'Apr 2026',
  },
  {
    name: 'Africa Volatility Study',
    desc: 'Used Python to analyze realized vs. implied volatility of the VanEck Africa index fund. Findings presented as an academic paper and slideshow through the Erdős Institute.',
    url:  'https://github.com/Chidubem5/Erdos_Africa',
    repo: 'Erdos_Africa',
    lang: 'Jupyter Notebook',
    updated: 'May 2026',
  },
  {
    name: 'Quantum Computing Experiments',
    desc: 'Demonstrating quantum computing concepts and experiments.',
    url:  'https://github.com/Chidubem5/QC',
    repo: 'QC',
    lang: 'Python',
    updated: 'Apr 2026',
  },
  {
    name: 'Academic Writing in LaTeX',
    desc: 'Collection of academic writing: undergraduate senior thesis, graduate computational physics papers, and other coursework typeset in LaTeX.',
    url:  'https://github.com/Chidubem5/Latex',
    repo: 'Latex',
    lang: 'LaTeX',
    updated: 'Apr 2026',
  },
  {
    name: 'Senior Thesis: Galaxy Outflows',
    desc: 'Python analysis of MaNGA IFU spectroscopy data exploring the relationship between stellar mass, star formation rate, and gas outflow velocity across a large galaxy sample. Figures published in senior thesis (Spring 2022).',
    url:  'https://github.com/Chidubem5/batesastronomythesis2022',
    repo: 'batesastronomythesis2022',
    lang: 'Jupyter Notebook',
    updated: 'May 2026',
  },
];

// Maps language names to the CSS class that gives the dot its color
const langMeta = {
  'Jupyter Notebook': { cls: 'lang-jupyter',  label: 'Jupyter Notebook' },
  'Python':           { cls: 'lang-python',   label: 'Python' },
  'HTML':             { cls: 'lang-html',     label: 'HTML' },
  'LaTeX':            { cls: 'lang-latex',    label: 'LaTeX' },
  'React':            { cls: 'lang-react',    label: 'React' },
};

// renderProjects builds HTML from the data above.
// .map(p => `...`) transforms each project object into an HTML string.
// Template literals (backtick strings) allow ${expression} to embed values.
// .join('') merges the array of strings into one big HTML string.
// grid.innerHTML = that string instantly creates all the card elements in the DOM.
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = projects.map(p => {
    // Fallback to default dot color if the language isn't in langMeta
    const lm = langMeta[p.lang] || { cls: 'lang-default', label: p.lang };
    // "Live ↗" only appears for projects with a real deployed site
    const liveTag = p.live
      ? `<span class="project-live-badge">Live ↗</span>`
      : '';
    // The GitHub link is a span (not an <a>) because the whole card is already an <a>.
    // Nesting <a> inside <a> is invalid HTML. Instead, the click is handled with onclick.
    // event.stopPropagation() prevents the click from also triggering the parent card link.
    const githubLink = p.github
      ? `<span class="project-github-link" role="link" tabindex="0"
           onclick="event.preventDefault();event.stopPropagation();window.open('${p.github}','_blank','noopener,noreferrer')"
           onkeydown="if(event.key==='Enter'){event.preventDefault();event.stopPropagation();window.open('${p.github}','_blank','noopener,noreferrer')}">GitHub ↗</span>`
      : '';
    return `
      <a class="project-card" href="${p.url}" target="_blank" rel="noopener noreferrer">
        <div class="project-header">
          <span class="project-name">${p.name}</span>
          ${liveTag}
          <span class="project-arrow">↗</span>
        </div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-footer">
          <span class="lang-dot ${lm.cls}"></span>
          <span class="lang-name">${lm.label}</span>
          ${githubLink}
          <span class="project-updated">${p.updated}</span>
        </div>
      </a>`;
  }).join('');
}

renderProjects();   // instant render using the hardcoded fallback dates above

// Quietly replace each project's fallback date with its real last-pushed
// date from the public GitHub API. Runs after the instant render so there's
// no flash of empty content, and fails silently (keeping the fallback) if
// the API is unreachable or rate-limited.
async function hydrateProjectDates() {
  const responses = await Promise.allSettled(
    projects.map(p => fetch(`https://api.github.com/repos/Chidubem5/${p.repo}`))
  );
  let changed = false;
  await Promise.all(responses.map(async (result, i) => {
    if (result.status !== 'fulfilled' || !result.value.ok) return;
    const data = await result.value.json().catch(() => null);
    if (!data?.pushed_at) return;
    projects[i].updated = new Date(data.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    changed = true;
  }));
  if (changed) renderProjects();
}

hydrateProjectDates();


/* ─────────────────────────────────────────
   STAR RATING

   Each .star-rating element in the HTML has data-score="4.3".
   This function reads that number and creates the right mix of full,
   half, and empty star spans.
───────────────────────────────────────── */
function renderStars(containerEl, score) {
  // Math.floor rounds DOWN to the nearest integer — full stars count
  const full  = Math.floor(score);
  // A "half star" exists if the decimal part is 0.1–0.8 (not near full or empty)
  const half  = score - full >= 0.1 && score - full < 0.9;
  // Whatever's left after full and half stars = empty stars
  const empty = 5 - full - (half ? 1 : 0);

  // .repeat(n) repeats a string n times — builds the star HTML
  const stars =
    '<span class="star full">★</span>'.repeat(full) +
    (half ? '<span class="star half">★</span>' : '') +
    '<span class="star">★</span>'.repeat(empty);

  containerEl.innerHTML = stars;
}

// document.querySelectorAll('.star-rating') finds every element with that class.
// .forEach() loops over them, reads their data-score, and fills them with stars.
// parseFloat() converts the string "4.3" to the number 4.3.
// el.dataset.score reads the data-score="4.3" HTML attribute.
document.querySelectorAll('.star-rating').forEach(el => {
  renderStars(el, parseFloat(el.dataset.score));
});


/* ─────────────────────────────────────────
   SLIDESHOW

   slideState is a dictionary (plain object) that stores the current state
   for each slideshow by ID. Multiple slideshows can exist independently.
   Example: slideState['intl'] = { current: 2, total: 29, timer: ... }
───────────────────────────────────────── */
const slideState = {};

// Fisher-Yates shuffle: randomizes the order of slide elements in the DOM.
// Works by swapping each element with a randomly chosen element before it.
function shuffleSlides(track) {
  const slides = Array.from(track.querySelectorAll('.slide'));
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Move slide[j] to the end of the track, then swap its array position
    track.appendChild(slides[j]);
    slides.splice(j, 1, slides[i]);
  }
}

// initSlideshow sets up a slideshow: shuffles it, creates dot navigation,
// and optionally starts auto-playing.
function initSlideshow(id, autoplay = false, interval = 5000) {
  const track = document.getElementById(`${id}-track`);
  if (!track) return;   // bail out if the element doesn't exist

  shuffleSlides(track);

  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsEl = document.getElementById(`${id}-dots`);

  // After shuffling, reset which slide is "active" (visible)
  slides.forEach(s => s.classList.remove('active'));
  slides[0].classList.add('active');

  slideState[id] = { current: 0, total: slides.length, timer: null };

  // Build the dot navigation — one dot per slide.
  // The active dot (index 0) gets the "active" class; others don't.
  dotsEl.innerHTML = slides.map((_, i) =>
    `<span class="dot${i === 0 ? ' active' : ''}" onclick="goToSlide('${id}', ${i})"></span>`
  ).join('');

  if (autoplay) startAutoplay(id, interval);
}

// startAutoplay: calls _goToSlide every `interval` milliseconds.
// clearInterval first prevents multiple timers stacking up.
function startAutoplay(id, interval = 5000) {
  const state = slideState[id];
  if (!state) return;
  clearInterval(state.timer);
  state.timer = setInterval(() => _goToSlide(id, state.current + 1), interval);
}

// pauseAutoplay: stops the timer temporarily, then restarts it after a delay.
// Called when the user manually changes slides — so autoplay picks up again
// 8 seconds after the last manual interaction.
function pauseAutoplay(id, resumeAfter = 8000) {
  const state = slideState[id];
  if (!state || !state.timer) return;
  clearInterval(state.timer);
  setTimeout(() => startAutoplay(id, 5000), resumeAfter);
}

// adaptSlideshow adjusts the slideshow's width/height to match the
// current image's natural aspect ratio. A portrait photo gets a narrow
// container; a landscape photo gets a wide one.
function adaptSlideshow(id) {
  const track   = document.getElementById(`${id}-track`);
  const wrapper = track && track.closest('.slideshow-wrapper');
  if (!track || !wrapper) return;

  const activeImg = track.querySelector('.slide.active .slide-img');
  if (!activeImg) return;

  // Force eager loading — we need naturalWidth immediately, not lazily
  activeImg.loading = 'eager';

  const apply = () => {
    const nw = activeImg.naturalWidth;    // actual pixel width of the image file
    const nh = activeImg.naturalHeight;
    if (!nw || !nh) return;   // image hasn't loaded yet — skip

    const ratio      = nw / nh;
    const available  = wrapper.parentElement.offsetWidth || window.innerWidth;
    const isPortrait = nh > nw;   // taller than wide = portrait orientation

    let newH, newMaxW;

    if (isPortrait) {
      // Portrait: limit height to 580px, width follows the ratio
      newH    = Math.min(580, Math.round(available * 0.85 / ratio));
      newMaxW = Math.round(newH * ratio) + 'px';
    } else {
      // Landscape: fill available width, height follows ratio
      newMaxW = '100%';
      newH    = Math.min(520, Math.max(260, Math.round(available / ratio)));
    }

    wrapper.style.maxWidth = newMaxW;
    track.style.height = newH + 'px';   // actually apply the computed height, not just width
  };

  // If the image is already fully loaded, apply immediately.
  // Otherwise wait for the "load" event, with a 300ms fallback retry.
  if (activeImg.complete && activeImg.naturalWidth) {
    apply();
  } else {
    activeImg.addEventListener('load', apply, { once: true });
    setTimeout(() => {
      if (activeImg.naturalWidth) apply();
    }, 300);
  }
}

// _goToSlide is the internal function that actually switches slides.
// It's prefixed with _ to signal "internal — don't call this directly."
// The public API is shiftSlide() and goToSlide() below.
function _goToSlide(id, index) {
  const track  = document.getElementById(`${id}-track`);
  const dotsEl = document.getElementById(`${id}-dots`);
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  const dots   = dotsEl.querySelectorAll('.dot');
  const state  = slideState[id];

  // Remove "active" from the current slide and dot
  slides[state.current].classList.remove('active');
  dots[state.current]?.classList.remove('active');   // ?. = "optional chaining" — safe if undefined

  // Wrap the index: going past the last slide loops back to 0
  state.current = (index + state.total) % state.total;

  // Add "active" to the new current slide and dot
  slides[state.current].classList.add('active');
  dots[state.current]?.classList.add('active');

  // Resize the slideshow container to match the new image's dimensions
  adaptSlideshow(id);
}

// window.shiftSlide — move forward (+1) or backward (-1).
// Assigned to window so it's accessible from onclick attributes in HTML.
window.shiftSlide = function(id, dir) {
  const state = slideState[id];
  if (!state) return;
  pauseAutoplay(id);
  _goToSlide(id, state.current + dir);
};

// window.goToSlide — jump to a specific slide index (used by dot clicks)
window.goToSlide = function(id, index) {
  pauseAutoplay(id);
  _goToSlide(id, index);
};

/* ─────────────────────────────────────────
   INITIALIZE SLIDESHOWS
───────────────────────────────────────── */
// 'intl' matches the id used in HTML (id="intl-track", id="intl-dots").
// true = autoplay on, 4000 = advance every 4 seconds.
initSlideshow('intl', true, 4000);
adaptSlideshow('intl');

/* ─────────────────────────────────────────
   SWIPE SUPPORT FOR SLIDESHOWS (mobile)

   On touchscreens, the user can swipe left/right to change slides.
   touchstart records where the finger first touched.
   touchend calculates how far it moved (dx).
   If the swipe was more than 40px, advance in that direction.
───────────────────────────────────────── */
function addSwipe(trackId) {
  const el = document.getElementById(trackId);
  if (!el) return;
  let startX = 0;
  // e.touches[0].clientX = X coordinate of the first finger on the screen
  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    // e.changedTouches = the touches that just ended (finger lifted)
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {   // ignore tiny taps / accidental nudges
      const id = trackId.replace('-track', '');
      pauseAutoplay(id);
      // dx < 0 means finger moved left = next slide; dx > 0 = previous
      shiftSlide(id, dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}
addSwipe('intl-track');


/* ─────────────────────────────────────────
   MODELING — LIGHTBOX

   The lightbox is a full-screen image viewer.
   lbImages holds all the image paths in order.
   lbCurrent tracks which image is displayed.
   lbCaptions stores the caption for each image.

   lbImages/lbCaptions are populated from the DOM (see initModelingLightbox
   and initTravelLightbox below) rather than hand-typed here, so adding a
   photo to the HTML can never desync the array from what's actually on
   the page.
───────────────────────────────────────── */
let lbImages   = [];
let lbCurrent  = 0;
let lbCaptions = [];

// openLightbox: shows the overlay and displays the clicked image.
// src = image path, index = position in lbImages array.
function openLightbox(src, index) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src      = src;
  lbCurrent    = index;
  const cap = document.getElementById('lightboxCaption');
  if (cap) cap.textContent = lbCaptions[index] || '';
  lb.classList.add('open');   // "open" class → CSS sets display: flex
}

// closeLightbox: hides the overlay by removing "open".
// Assigned to window so it's accessible from the HTML onclick attribute.
window.closeLightbox = function() {
  document.getElementById('lightbox').classList.remove('open');
};

// lbShift: advance to the next or previous image in the lightbox.
// e.stopPropagation() prevents the click from bubbling up to the lightbox
// background element, which would close the lightbox.
window.lbShift = function(e, dir) {
  e.stopPropagation();
  if (!lbImages.length) return;
  // + lbImages.length before % ensures we never get a negative index
  lbCurrent = (lbCurrent + dir + lbImages.length) % lbImages.length;
  document.getElementById('lightboxImg').src = lbImages[lbCurrent];
  const cap = document.getElementById('lightboxCaption');
  if (cap) cap.textContent = lbCaptions[lbCurrent] || '';
};

// Keyboard navigation: Escape closes, Arrow keys advance.
// Guarded on the lightbox actually being open — otherwise arrow keys
// pressed anywhere on the page (e.g. while scrolling) would silently
// cycle lbCurrent and trigger full-size image downloads.
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  lbShift(e, -1);
  if (e.key === 'ArrowRight') lbShift(e,  1);
});

// Swipe support for the lightbox on touch devices.
// This is an IIFE (Immediately Invoked Function Expression):
// (function() { ... })() — creates and runs a function right away.
// The reason: variables like startX are scoped inside and don't pollute
// the global scope or conflict with the slideshow's startX.
(function() {
  const lb = document.getElementById('lightbox');
  let startX = 0;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;   // ignore short swipes
    lbShift(e, dx < 0 ? 1 : -1);
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   MODELING PHOTOS — CLICK TO EXPAND

   Populates lbImages/lbCaptions from the .model-ph elements actually
   present in the DOM (featured photo first, then the grid — matching
   visual order) and wires up a click handler on each. No hardcoded
   indexes to keep in sync with the HTML.
───────────────────────────────────────── */
function initModelingLightbox() {
  const nodes = Array.from(document.querySelectorAll('#modeling .model-ph'));
  const srcs  = nodes.map(el => el.querySelector('img').src);

  // Also the default lightbox content until a travel photo is clicked
  lbImages   = srcs;
  lbCaptions = [];

  nodes.forEach((el, i) => {
    el.addEventListener('click', () => {
      lbImages   = srcs;
      lbCaptions = [];
      openLightbox(srcs[i], i);
    });
  });
}

initModelingLightbox();

/* ─────────────────────────────────────────
   TRAVEL SLIDESHOW — CLICK TO EXPAND

   When you click a travel photo in the slideshow, it opens in the lightbox.
   This reads the full list of travel images from the DOM and temporarily
   replaces lbImages so the lightbox navigates through them.
───────────────────────────────────────── */
function initTravelLightbox() {
  const track = document.getElementById('intl-track');
  if (!track) return;

  // Array.from converts NodeList to a real Array so we can use .map()
  const imgs = Array.from(track.querySelectorAll('.slide-img'));
  const srcs = imgs.map(img => img.src);
  // For each image, look for a sibling .slide-caption element and get its text
  const caps = imgs.map(img =>
    img.closest('.slide-img-wrap')?.querySelector('.slide-caption')?.textContent || ''
  );

  imgs.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      // Replace the modeling photos with travel photos for this lightbox session
      lbImages   = srcs;
      lbCaptions = caps;
      lbCurrent  = i;
      openLightbox(srcs[i], i);
    });
  });
}

initTravelLightbox();


/* ─────────────────────────────────────────
   SCROLL PROGRESS BAR

   As the user scrolls, this calculates what percentage of the page they've
   seen and updates the progress bar width accordingly.
   scrollTop = how many pixels they've scrolled from the top.
   scrollHeight - clientHeight = total scrollable distance.
───────────────────────────────────────── */
const scrollProgressEl = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled  = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  // (scrolled / maxScroll) gives a 0–1 fraction; * 100 converts to percentage
  scrollProgressEl.style.width = ((scrolled / maxScroll) * 100) + '%';
}, { passive: true });


/* ─────────────────────────────────────────
   SCROLL-TRIGGERED ENTRANCE ANIMATIONS

   IntersectionObserver watches elements and fires a callback when they
   enter or leave the visible area of the screen.
   This is much more efficient than listening to the "scroll" event and
   manually checking element positions with getBoundingClientRect().
───────────────────────────────────────── */
function initScrollAnimations() {
  // A CSS selector string listing all the elements we want to animate in
  const targets = document.querySelectorAll(
    '.section-title, .section-sub, .about-text p, .about-languages, .tag-list, .linkedin-btn,' +
    '.research-card, .project-card, .anime-card, .comedian-card,' +
    '.book-card, .sub-heading'
  );

  // IntersectionObserver fires the callback whenever observed elements
  // enter or exit the viewport.
  // threshold: 0.12 = fire when 12% of the element is visible.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {   // element has scrolled into view
        entry.target.classList.add('visible');   // triggers the CSS fade-up transition
        observer.unobserve(entry.target);         // stop watching — no need to re-animate
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    // Only animate elements that start BELOW the visible viewport.
    // Elements already in view on page load appear immediately without animation.
    const rect = el.getBoundingClientRect();   // position relative to viewport
    if (rect.top > window.innerHeight * 0.95) {
      el.classList.add('fade-up');    // start invisible + shifted down
      observer.observe(el);           // watch for when it enters view
    }
  });
}

// requestAnimationFrame defers initScrollAnimations until after the first
// paint — by then the DOM is fully laid out and getBoundingClientRect() works.
requestAnimationFrame(initScrollAnimations);


/* ─────────────────────────────────────────
   FOOTER YEAR

   Automatically updates the copyright year so you never have to
   change it manually. new Date().getFullYear() returns e.g. 2026.
───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ─────────────────────────────────────────
   MORE ABOUT ME — EXPAND / COLLAPSE

   Clicking the "More About Me" banner toggles the section open or closed.
   The CSS grid trick animates the height smoothly:
   grid-template-rows: 0fr → 1fr (see styles.css for explanation).
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   PUBLICATION DESCRIPTION TOGGLE
───────────────────────────────────────── */
window.togglePubDesc = function(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  btn.querySelector('.pub-btn-text').textContent = expanded ? 'Show description' : 'Hide description';
  btn.nextElementSibling.classList.toggle('open');
};

function toggleMoreAbout() {
  const wrapper = document.getElementById('moreAboutWrapper');
  const toggle  = document.getElementById('more-about-me');
  const isOpen  = wrapper.classList.contains('open');
  wrapper.classList.toggle('open');
  toggle.classList.toggle('open');
  // String(!isOpen) converts boolean to "true" or "false" string for aria attribute
  toggle.setAttribute('aria-expanded', String(!isOpen));
  wrapper.setAttribute('aria-hidden', String(isOpen));
  // inert removes the whole collapsed subtree from the tab order and the
  // accessibility tree in one move — without it, aria-hidden alone still
  // leaves dozens of links inside (anime, comedians, gallery) reachable
  // by keyboard while visually and semantically "not there."
  wrapper.toggleAttribute('inert', isOpen);
}

// expandMoreAbout: called from the nav dropdown when "More About Me" is clicked.
// Opens the section if it's not already open, without toggling (closing) it.
window.expandMoreAbout = function() {
  const wrapper = document.getElementById('moreAboutWrapper');
  const toggle  = document.getElementById('more-about-me');
  if (!wrapper.classList.contains('open')) {
    wrapper.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    wrapper.setAttribute('aria-hidden', 'false');
    wrapper.removeAttribute('inert');
  }
};

// Keyboard support: pressing Enter or Space on the toggle div acts like a click.
// e.preventDefault() prevents Space from scrolling the page.
document.getElementById('more-about-me').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMoreAbout(); }
});


/* ─────────────────────────────────────────
   TOAST NOTIFICATION HELPER

   showToast(msg) displays a brief pill at the bottom of the screen.
   It adds the "show" class (which transitions opacity and position),
   then removes it 2.2 seconds later.
   clearTimeout(t._timer) cancels any previous dismiss timer so rapid
   calls don't leave the old toast half-visible.
───────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ─────────────────────────────────────────
   CONTACT FORM

   Another IIFE — wraps all the form logic in a self-contained scope so
   the variables (form, submitBtn, etc.) don't leak into the global scope.
   async (e) => ... means this function can use "await" to pause and wait
   for the server response before continuing.
───────────────────────────────────────── */
(function() {
  const form    = document.getElementById('contactForm');
  const submitBtn = form.querySelector('.contact-submit');
  const submitText = form.querySelector('.submit-text');
  const submitLoad = form.querySelector('.submit-loading');
  const successMsg = form.querySelector('.form-success');
  const errorMsg   = form.querySelector('.form-error');

  form.addEventListener('submit', async (e) => {
    // e.preventDefault() stops the browser's default form submission
    // (which would reload the page). We handle it ourselves with fetch().
    e.preventDefault();
    successMsg.hidden = true;
    errorMsg.hidden   = true;

    // Validate: check each field has a non-empty value.
    // .trim() removes leading/trailing spaces so "   " counts as empty.
    let valid = true;
    ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.classList.add('invalid'); valid = false; }
      else el.classList.remove('invalid');
    });
    if (!valid) return;   // stop here — don't submit if any field is empty

    // Show the loading state while we wait for the server
    submitBtn.disabled = true;
    submitText.hidden  = true;
    submitLoad.hidden  = false;

    try {
      // fetch() sends an HTTP request to the Formspree service.
      // await pauses here until the response comes back.
      // method: 'POST' = sending data to the server (vs GET which retrieves data).
      // JSON.stringify converts the JS object to a JSON text string for the server.
      // FormSubmit.co: free, no account needed.
      // First submission triggers a one-time activation email to chidumeh@gmail.com — click the link once.
      const res = await fetch('https://formsubmit.co/ajax/chidumeh@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    document.getElementById('contactName').value.trim(),
          email:   document.getElementById('contactEmail').value.trim(),
          message: document.getElementById('contactMessage').value.trim(),
        }),
      });
      // res.ok = true if HTTP status is 200–299 (success)
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.success !== 'false') {
        form.reset();   // clear all form fields
        successMsg.hidden = false;
      } else {
        throw new Error('bad response');   // jump to the catch block
      }
    } catch (_) {
      // Any error (network failure, server error) shows the error message
      errorMsg.hidden = false;
    } finally {
      // finally always runs whether or not an error occurred — restore the button
      submitBtn.disabled = false;
      submitText.hidden  = false;
      submitLoad.hidden  = true;
    }
  });

  // Clear red border as soon as the user starts typing (feels more responsive)
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });
})();

// copyEmail: copies the email address to the clipboard and shows a toast.
// navigator.clipboard is the modern API. The else branch is a fallback for
// older browsers that don't support it (creates a hidden textarea, selects it,
// runs the old execCommand('copy') trick, then removes the textarea).
window.copyEmail = function() {
  const email = 'Chidumeh@gmail.com';
  if (navigator.clipboard) {
    // .then(callback) runs the callback after the promise resolves (copy succeeds)
    navigator.clipboard.writeText(email).then(() => showToast('Email copied!'));
  } else {
    // Legacy fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.cssText = 'position:fixed;opacity:0';   // invisible and off-screen
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Email copied!');
  }
};


/* ─────────────────────────────────────────
   KEYBOARD ACCESSIBILITY — model photo grid

   <div> elements with onclick handlers aren't focusable by keyboard by default.
   Adding tabindex="0" makes them reachable via Tab.
   Adding role="button" tells screen readers to announce them as buttons.
   The keydown listener fires the click when Enter or Space is pressed,
   matching the behavior expected of interactive elements.
───────────────────────────────────────── */
document.querySelectorAll('.model-ph').forEach(el => {
  if (!el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
  }
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();   // triggers the click listener registered in initModelingLightbox
    }
  });
});


/* ─────────────────────────────────────────
   INFINITY MIRROR BACKGROUND (canvas)

   The <canvas> element gives JavaScript a pixel-level drawing surface.
   ctx = the "2D rendering context" — like a paintbrush with drawing methods.

   What it draws:
   On each frame, it clears the canvas and draws a series of expanding
   rounded rectangles (like picture frames inside picture frames), each
   at a different size. A "tick" counter increments every frame,
   making each frame slightly larger so they appear to zoom outward endlessly.
   A radial gradient vignette darkens the edges for depth.
───────────────────────────────────────── */
(function initMirrorBg() {
  const canvas = document.getElementById('mirrorBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');   // get the 2D drawing API

  // w, h = CSS-pixel canvas dimensions; cx, cy = center point;
  // tick = animation frame counter; loopActive = whether a
  // requestAnimationFrame chain is currently self-perpetuating.
  let w, h, cx, cy, tick = 0, running = true, loopActive = false;
  // Fewer layers on mobile to save battery/CPU
  const LAYERS = window.innerWidth < 768 ? 18 : 30;
  // DRIFT controls how fast the frames zoom outward each tick
  const DRIFT = 0.00014;

  // Respect the OS-level "reduce motion" accessibility setting (used by
  // people with vestibular disorders/motion sensitivity): draw a single
  // static frame instead of an endless zooming animation.
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // roundRect draws a rectangle with rounded corners using canvas path commands.
  function roundRect(x, y, rw, rh, r) {
    r = Math.min(r, rw / 2, rh / 2);   // corner radius can't exceed half the size
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + rw - r, y);
    ctx.arcTo(x + rw, y, x + rw, y + r, r); ctx.lineTo(x + rw, y + rh - r);
    ctx.arcTo(x + rw, y + rh, x + rw - r, y + rh, r); ctx.lineTo(x + r, y + rh);
    ctx.arcTo(x, y + rh, x, y + rh - r, r); ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }

  // The vignette gradient only depends on canvas size and theme, not on
  // the per-frame tick — cache it instead of rebuilding it up to 60
  // times a second.
  let cachedVignette = null, cachedVignetteDark = null;
  function getVignette(dark) {
    if (!cachedVignette || cachedVignetteDark !== dark) {
      cachedVignette = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(cx, cy));
      cachedVignette.addColorStop(0, 'rgba(0,0,0,0)');
      cachedVignette.addColorStop(0.40, 'rgba(0,0,0,0)');
      cachedVignette.addColorStop(1, dark ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0.28)');
      cachedVignetteDark = dark;
    }
    return cachedVignette;
  }

  function draw() {
    if (!running) { loopActive = false; return; }
    const reduceMotion = reduceMotionQuery.matches;
    if (!reduceMotion) tick += DRIFT;   // frozen on one frame when motion is reduced

    // Read the current theme to choose the right background and rectangle color
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = dark ? '#0a0a0a' : '#f7f7f9';
    ctx.fillRect(0, 0, w, h);   // fill the entire canvas with the background color

    // [ar, ag, ab] = RGB values of the accent color in the current theme
    const [ar, ag, ab] = dark ? [167, 139, 250] : [124, 58, 237];

    // Draw each layer (frame) at a different size and opacity
    for (let i = 0; i < LAYERS; i++) {
      // raw = how far along the 0–1 scale this layer is
      // tick % 1 creates a repeating 0–1 cycle as tick increments
      const raw = ((i / LAYERS) - (tick % 1) + 1) % 1;
      // scale = non-linear transform that makes outer frames larger than inner
      const scale = Math.pow(raw, 1.55);
      if (scale < 0.004) continue;   // skip layers too small to see

      const fw = Math.max(2, w * scale);
      const fh = Math.max(2, h * scale);
      // alpha = opacity — further-out frames are more opaque
      const alpha = dark ? Math.pow(raw, 0.65) * 0.32 : Math.pow(raw, 0.65) * 0.18;

      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha})`;
      ctx.lineWidth = Math.max(0.3, scale * 1.8);
      // Center each frame in the canvas
      roundRect((w - fw) / 2, (h - fh) / 2, fw, fh, scale * 26);
      ctx.stroke();   // actually draw the outlined rectangle
    }

    // Vignette: a radial gradient that fades to dark at the edges.
    ctx.fillStyle = getVignette(dark);
    ctx.fillRect(0, 0, w, h);   // paint the vignette over the whole canvas

    if (reduceMotion) {
      loopActive = false;
    } else {
      // requestAnimationFrame(draw) schedules draw() to run again before the
      // next screen repaint — a smooth 60fps loop synced to the display.
      loopActive = true;
      requestAnimationFrame(draw);
    }
  }

  // Safe to call anytime — paints one frame immediately, and (re)starts
  // the animation loop only if one isn't already chaining itself (avoids
  // stacking a second concurrent rAF loop on top of an existing one).
  function requestRepaint() {
    if (!loopActive) draw();
  }

  // When the window is resized, update the canvas dimensions so it always
  // covers the screen. The drawing buffer is sized at up to 2x the CSS
  // pixel size (capped for performance) so the frames render crisply on
  // retina/mobile screens instead of looking soft; setTransform lets the
  // rest of the drawing code keep working in ordinary CSS-pixel units.
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // <canvas> is a "replaced element" — unlike a <div>, it doesn't stretch
    // to fill inset:0 on its own; its layout size defaults to its buffer
    // resolution. Without pinning style.width/height to the CSS viewport
    // size, the canvas above renders at dpr× the viewport and (being
    // fixed at top:0/left:0) only its top-left quadrant is visible.
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2; cy = h / 2;
    cachedVignette = null;   // size changed — rebuild the gradient next frame
    requestRepaint();
  }

  // Pause animation when the browser tab is hidden (user switches to another tab).
  // This saves battery and CPU — no point animating when no one can see it.
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestRepaint();
  });

  // If the reduced-motion setting changes while the page is open, either
  // freeze on the next frame or resume animating.
  reduceMotionQuery.addEventListener('change', requestRepaint);

  window.addEventListener('resize', resize);
  resize();   // sets the initial canvas size and paints the first frame
})();


/* ─────────────────────────────────────────
   BACK TO TOP BUTTON

   classList.toggle('visible', condition) adds the class if condition is true,
   removes it if false — cleaner than if/else with add/remove.
   window.scrollY = number of pixels scrolled from the top.
   scrollTo({ behavior: 'smooth' }) animates the scroll back to the top.
───────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  // Show the button only after scrolling 600px down
  backToTopBtn.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
