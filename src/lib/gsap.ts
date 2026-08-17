// Central GSAP entry point.
// Register plugins once, in a browser-only guard, and re-export so every
// component imports the same configured instance.
//
// Keep this module to plugins the whole site needs: SmoothScroll imports it
// from the layout, so anything registered here ships on every route. The
// bonus plugins (SplitText, Flip, DrawSVGPlugin, ScrollSmoother, MorphSVG —
// all free in the public npm package since 3.13) are registered by the one
// component that uses them instead. See SplitHeadline.tsx for the pattern.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
