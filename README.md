# NOVA — AI-Native Web Studio (landing page)

High-end, scroll-driven landing page for a web-development agency.
Apple MacBook Pro–style scroll choreography, with Higgsfield-generated
cinematic assets tied into the animations.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + CSS design tokens
- **GSAP + ScrollTrigger** — pinning & scrubbed scroll timelines
- **Lenis** — inertial smooth scroll, synced to the GSAP ticker
- **Higgsfield MCP** — AI-generated hero/section video loops

## Getting started

> Node.js 18.18+ is required and is **not yet installed** on this machine.
> Install it first, e.g.:
>
> ```bash
> # official installer: https://nodejs.org  — or via Homebrew:
> brew install node
> # or nvm:
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && nvm install --lts
> ```

Then:

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Project structure

```
src/
  app/
    layout.tsx        # fonts + <SmoothScroll> provider + metadata
    page.tsx          # assembles the sections
    globals.css       # design tokens + hero styles (the "look")
  components/
    Navbar.tsx        # glass-blur-on-scroll nav
    Hero.tsx          # ★ intro reveal + pinned scroll timeline
    SmoothScroll.tsx  # Lenis ↔ GSAP ticker integration
  lib/gsap.ts         # registers ScrollTrigger once
  hooks/…             # SSR-safe layout effect
public/               # ← drop Higgsfield assets here
```

## Higgsfield asset pipeline

Each cinematic section references media in `/public` whose scale/opacity/
playback is driven by a ScrollTrigger timeline. The Hero currently uses:

| File | Status | Model |
|---|---|---|
| `public/hero-poster.jpg` ✅ | Generated — abstract violet/cyan data-network | `z_image` (free tier) |
| `public/hero.mp4` ⏳ | Not yet — **requires a Higgsfield basic+ plan** | `kling3_0_turbo` (image-to-video from the poster) |

**Plan note:** on the free Higgsfield tier only `z_image` generates. Video
models and most image models (`recraft_v4_1`, `soul_location`, etc.) return
`job_minimum_basic_plan_required`. Once on basic+, generate `hero.mp4` from the
poster (it's already the start frame) and uncomment the `<video>` in
`src/components/Hero.tsx`.

The CSS gradient-mesh fallback sits behind the still, so the hero degrades
gracefully if an asset is ever missing.

## Roadmap

- **Phase 1 ✅** — stack, architecture, Hero + first scroll animation
- **Phase 2** — Capabilities (horizontal pin), AI-Agent showcase, Process, Work
- **Phase 3** — on-site AI chatbot via Claude (see `.env.example`)
