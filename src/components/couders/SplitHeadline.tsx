"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";

// Registered here rather than in lib/gsap so SplitText only ships to routes
// that actually split text — lib/gsap is pulled in by the layout.
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * Headline that reveals glyph by glyph out of a clipping mask, instead of
 * fading in as one block.
 *
 * `autoSplit` makes SplitText re-split itself after webfonts load and on
 * resize — without it the split is measured against the fallback face and
 * every line breaks in the wrong place once var(--font-display) arrives.
 *
 * `aria: "auto"` keeps the original string on the element for screen readers,
 * so splitting into per-character spans doesn't turn the H1 into letter soup.
 */
export default function SplitHeadline({
  text,
  ready,
  className,
  style,
}: {
  text: string;
  /** Flips true when the hero logo morph is far enough along to hand over. */
  ready: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  // Read inside onSplit, which can fire again after `ready` has flipped.
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        // No "lines": line wrappers are block-level, and with this H1 sitting
        // in a shrink-to-fit flex column they collapse the headline to one
        // word per line. Words keep wrapping natural; chars carry the reveal.
        type: "words,chars",
        mask: "chars",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          // Returning the tween lets autoSplit revert and rebuild it on each
          // re-split instead of stacking a new one on every font swap.
          tween.current = gsap.from(self.chars, {
            yPercent: 118,
            duration: 0.85,
            ease: "expo.out",
            stagger: { each: 0.018, from: "start" },
            paused: !readyRef.current,
          });
          return tween.current;
        },
      });
      gsap.set(el, { opacity: 1 });
      return () => {
        tween.current = null;
        split.revert();
      };
    }, el);

    return () => ctx.revert();
  }, [text, reduced]);

  // Hand-off from the logo morph. Separate effect so a late `ready` flip
  // starts the existing tween rather than forcing a re-split.
  useIsomorphicLayoutEffect(() => {
    if (ready && !reduced) tween.current?.play();
  }, [ready, reduced]);

  // Failsafe: the chars start translated out of their masks, so if the morph
  // never calls back (SVG failed, rAF starved in a background tab) the
  // headline would stay invisible. The morph's own sequence lands ~1.6s in.
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => tween.current?.play(), 3500);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <h1 ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {text}
    </h1>
  );
}
