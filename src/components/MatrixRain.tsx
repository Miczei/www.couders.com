"use client";

import { useEffect, useRef } from "react";

/**
 * White Matrix rain — performance-first.
 *
 * Core Web Vitals guardrails:
 *   • Runs entirely after hydration (useEffect) and its start is deferred to
 *     requestIdleCallback, so it never competes with LCP or first input.
 *   • No layout is ever read/written per frame → zero CLS, no reflow thrash.
 *   • Throttled to 20fps; per-frame work is a single fillRect + N fillText.
 *   • Pauses completely when the tab is hidden (visibilitychange).
 *   • Honors prefers-reduced-motion (renders one static, faint frame).
 *   • Opaque context (alpha:false) + capped DPR keep GPU/CPU cost minimal.
 *
 * The canvas is a fixed, pointer-events-none background layer; all content
 * sits above it via z-index.
 */

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/[]{}=;:".split("");
const FONT_SIZE = 16;

export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let columns = 0;
    let dpr = 1;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;
    let running = false;
    let started = false;
    let resizeTimer = 0;
    const FRAME = 1000 / 20;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      columns = Math.ceil(width / FONT_SIZE);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * -height) / FONT_SIZE)
      );
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    };

    const draw = () => {
      // Fade toward white → soft, dissolving trails (kept short for a quiet field).
      ctx.fillStyle = "rgba(255, 255, 255, 0.11)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns; i++) {
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];

        ctx.fillStyle = "rgba(15, 18, 28, 0.09)";
        ctx.fillText(glyph, x, y);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < FRAME) return;
      last = t;
      draw();
    };

    const start = () => {
      if (running || prefersReduced || !started) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Defer the first paint + loop to idle time so it never blocks hydration/LCP.
    const begin = () => {
      started = true;
      setup();
      if (prefersReduced) draw();
      else start();
    };

    const ric = (
      window as Window &
        typeof globalThis & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
    ).requestIdleCallback;
    const idleId = ric
      ? ric(begin, { timeout: 800 })
      : window.setTimeout(begin, 400);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (started) setup();
      }, 150);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      const cic = (
        window as Window &
          typeof globalThis & { cancelIdleCallback?: (id: number) => void }
      ).cancelIdleCallback;
      if (cic) cic(idleId as number);
      else window.clearTimeout(idleId as number);
    };
  }, []);

  return <canvas ref={ref} className="matrix-rain" aria-hidden="true" />;
}
