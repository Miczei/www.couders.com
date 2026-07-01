// Central GSAP entry point.
// Register plugins once, in a browser-only guard, and re-export so every
// component imports the same configured instance.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
