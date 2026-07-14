"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf: ((time: number) => void) | null = null;

    if (!prefersReduced) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
        anchors: true, // smooth-scroll in-page nav links (#globe, #process, ...)
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      window.removeEventListener("load", refresh);
      if (raf) gsap.ticker.remove(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // This component wraps the whole app in the root layout and never
  // remounts on client-side navigation, so the Lenis instance above
  // persists across route changes too. Lenis drives scroll from its own
  // cached target on every animation frame, which fights and overrides
  // Next's default scroll-to-top-on-navigation the moment the next frame
  // runs. Resync Lenis (or fall back to a native scroll) on every pathname
  // change so the new page always actually lands at the top, instantly.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
