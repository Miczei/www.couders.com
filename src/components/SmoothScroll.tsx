"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth-scroll provider + ScrollTrigger sync.
 *
 * Lenis drives GSAP's ticker and pushes each scroll frame into
 * ScrollTrigger.update(), keeping pinned/scrubbed timelines locked to the
 * inertial scroll. We also refresh ScrollTrigger once fonts load and on full
 * load, so pinned measurements (especially the horizontal-scroll section) are
 * computed against the final layout.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
        anchors: true, // smooth-scroll in-page nav links (#globe, #process, ...)
      });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      window.removeEventListener("load", refresh);
      if (raf) gsap.ticker.remove(raf);
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
