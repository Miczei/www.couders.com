"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "アイウカキクサシスタチツナニヌハヒフ0123456789<>/=+ΞΣΨ";
const COL_W = 16;
const RADIUS = 210;

export default function MatrixReveal({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!parent || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: { y: number; speed: number }[] = [];
    let raf = 0;
    let running = false;
    let hovering = false;
    let stopAt = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const setFont = () => {
      ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont();
      cols = Math.ceil(w / COL_W);
      drops = Array.from({ length: cols }, () => ({
        y: Math.random() * h,
        speed: 2 + Math.random() * 3.5,
      }));
    };

    const applyMask = () => {
      canvas.style.setProperty("--rx", `${cur.x.toFixed(1)}px`);
      canvas.style.setProperty("--ry", `${cur.y.toFixed(1)}px`);
    };

    const step = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < cols; i++) {
        const d = drops[i];
        d.y += d.speed;
        if (d.y > h + 40) {
          d.y = -20 - Math.random() * 220;
          d.speed = 2 + Math.random() * 3.5;
        }
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        ctx.fillStyle =
          Math.random() < 0.1
            ? "rgba(245, 245, 247, 0.9)"
            : "rgba(155, 161, 171, 0.5)";
        ctx.fillText(ch, i * COL_W + 2, d.y);
      }

      cur.x += (tgt.x - cur.x) * 0.14;
      cur.y += (tgt.y - cur.y) * 0.14;
      applyMask();

      if (hovering || performance.now() < stopAt) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onEnter = (e: PointerEvent) => {
      const p = local(e);
      tgt.x = cur.x = p.x;
      tgt.y = cur.y = p.y;
      applyMask();
      hovering = true;
      canvas.style.opacity = "1";
      start();
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      tgt.x = p.x;
      tgt.y = p.y;
    };
    const onLeave = () => {
      hovering = false;
      stopAt = performance.now() + 600;
      canvas.style.opacity = "0";
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const mask = `radial-gradient(circle ${RADIUS}px at var(--rx, 50%) var(--ry, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, transparent 78%)`;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "h-full w-full"}
      style={{
        opacity: 0,
        transition: "opacity 0.5s ease",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}
