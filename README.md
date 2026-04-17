# chidu.dev — Personal Website

A personal website for Chidubem Umeh, built entirely through conversational prompting with [Claude Code](https://claude.ai/code) (Anthropic's AI coding agent). No frameworks, no templates — just plain HTML, CSS, and JavaScript generated and iterated on through natural language.

## How it was built

This site was created using **LLM agents**, specifically **Claude Code**, an AI software engineering agent by Anthropic. The entire development process — from the initial layout and color palette to mobile optimizations, API integrations, and deployment — was done through conversation. No code was written by hand.

## Features

- **Auto day / night theme** — switches automatically between light and dark mode based on time of day (6am–6pm light, 6pm–6am dark), with a manual toggle
- **Nickname rotator** — animated typewriter cycling through all of Chidubem's nicknames in the hero section
- **About Me** — full bio with a profile photo, skills tags, language proficiencies, and a LinkedIn button
- **Projects** — GitHub repositories pulled from a curated list, rendered as cards with language color indicators
- **Graduate Research** — cards highlighting ongoing physics research at UCF (adiabatic spintronics, TR-MOKE, teaching)
- **Music** — top artists with expandable song lists; each song links directly to Spotify and Apple Music search
- **Gaming** — current game rotation
- **Anime & Manga** — ranked top 10 with genre tags, Wikipedia links, and cover art fetched live from the [Jikan API](https://jikan.moe/) (MyAnimeList)
- **Travel slideshow** — international photo slideshow (Dominican Republic, Nigeria) with swipe gesture support, dot navigation, and click-to-expand lightbox
- **Books** — currently reading with a star rating display
- **Pictures Through The Years** — photo gallery with a featured image and grid, full lightbox with keyboard and arrow navigation
- **Background music player** — floating play/pause button with animated equalizer bars and smooth fade in/out
- **Mobile optimized** — responsive at 768px, 640px, and 480px breakpoints; safe area insets for iPhone notch/home bar; touch-action for instant tap response; swipe gestures on slideshows

## Tech stack

| Layer | Details |
|-------|---------|
| HTML | Semantic HTML5, no framework |
| CSS | Custom properties for theming, CSS Grid & Flexbox, `clamp()` for fluid type |
| JavaScript | Vanilla ES6+ — no libraries or bundlers |
| Fonts | Inter via Google Fonts |
| Cover art | Jikan v4 API (MyAnimeList) |
| Hosting | Cloudflare Pages (connected to this GitHub repo) |
| Domain | chidu.dev via Namecheap |

## Project structure

```
personal_website/
├── index.html          # All page sections
├── styles.css          # All styles and responsive breakpoints
├── script.js           # Theme, nav, slideshow, music player, API calls
└── images/
    ├── logo.png        # Navbar logo and favicon
    ├── modeling/       # "Pictures Through The Years" photos
    └── travel/         # Travel slideshow photos
```

## Development approach

Every feature was described in plain English and built iteratively by Claude Code — layout changes, bug fixes, mobile tweaks, and new sections were all added through conversation without ever manually editing a file. The agent read files, made targeted edits, ran git commands, and pushed to GitHub, with Cloudflare Pages deploying automatically on each push.
