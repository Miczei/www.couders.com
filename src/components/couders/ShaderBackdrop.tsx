"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Live WebGL mesh gradient behind a section — the replacement for stacked
 * AmbientGlow blur blobs.
 *
 * Loaded with ssr:false behind a static CSS gradient placeholder, so the
 * canvas never becomes the LCP element: the placeholder paints on first frame
 * and the shader fades in over it once WebGL is up.
 *
 * Motion is cut to a still frame (speed 0, which still renders the gradient)
 * whenever the user prefers reduced motion or the tab is in the background —
 * a full-viewport shader animating in a hidden tab is pure battery burn.
 */
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false },
);

// Kept deliberately low-key. A full-strength brand gradient reads as a
// screensaver and drowns the H1 — the shader's job here is studio lighting
// behind the content, not a poster.
export type BackdropTone = "ink" | "white" | "paper" | "vivid";

const PALETTE: Record<BackdropTone, string[]> = {
  // Near-white ground, brand sky/teal only ever as a tint.
  white: ["#FFFFFF", "#EAF4FD", "#CFE7F8", "#CFF1EA", "#F8FCFF"],
  // Ink ground with the accents held well below full saturation.
  ink: ["#060608", "#0A1622", "#0E3550", "#123B3A", "#08101A"],
  // Warm paper ground. The slight warmth is what makes the cool sky/teal
  // thread read as ink on stock rather than as another blue-on-white SaaS page.
  paper: ["#F7F6F3", "#F1F0EA", "#E2ECF0", "#E6F0EA", "#FAF9F5"],
  // The one place on a paper page where the brand runs at full strength.
  // Reserved for behind glass: refraction needs contrast to be visible at all.
  vivid: ["#F7F6F3", "#BBE2F6", "#5FC4EC", "#4EDFCB", "#E7F5F2"],
};

const PLACEHOLDER: Record<BackdropTone, string> = {
  white:
    "radial-gradient(120% 90% at 50% 0%, #E8F4FD 0%, #F7FBFF 45%, #FFFFFF 100%)",
  ink: "radial-gradient(120% 90% at 50% 0%, #0B2C46 0%, #08111A 45%, #060608 100%)",
  paper:
    "radial-gradient(120% 90% at 50% 0%, #EBF0F1 0%, #F5F4EF 45%, #F7F6F3 100%)",
  vivid:
    "radial-gradient(120% 90% at 50% 0%, #CDE9F7 0%, #E9F4F2 45%, #F7F6F3 100%)",
};

const GROUND: Record<BackdropTone, string> = {
  white: "255,255,255",
  ink: "6,6,8",
  paper: "247,246,243",
  vivid: "247,246,243",
};

export default function ShaderBackdrop({
  light = false,
  tone: toneProp,
  scrim = 1,
  className = "",
}: {
  /** Shorthand kept for the hero A/B: true -> "white", false -> "ink". */
  light?: boolean;
  tone?: BackdropTone;
  /**
   * How much ground is pulled back over the shader. 1 is the calm default
   * used behind headlines; drop it where the gradient is the subject rather
   * than the lighting — glass needs visible detail underneath or its
   * refraction has nothing to bend and reads as a plain white card.
   */
  scrim?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const tone: BackdropTone = toneProp ?? (light ? "white" : "ink");
  const ground = GROUND[tone];
  const s = Math.max(0, Math.min(1, scrim));
  const a = (v: number) => +(v * s).toFixed(3);

  useEffect(() => {
    setMounted(true);
    // Seed from the real state: the page can be restored into a background
    // tab, where no visibilitychange ever fires and we'd animate unseen.
    setVisible(!document.hidden);
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // speed 0 still paints the gradient — it just stops advancing time.
  const speed = reduced || !visible ? 0 : 0.14;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ background: PLACEHOLDER[tone] }}
    >
      {mounted && (
        <MeshGradient
          className="h-full w-full"
          colors={PALETTE[tone]}
          distortion={0.85}
          swirl={0.6}
          grainMixer={0.18}
          grainOverlay={tone === "ink" ? 0.12 : 0.05}
          speed={speed}
          // Cap the render target: on a 3x retina 5K panel an uncapped
          // full-bleed shader costs several times more fragment work than
          // anyone can see.
          maxPixelCount={1920 * 1080}
          minPixelRatio={1}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {/* Vignette: pulls the ground back in at the edges so the shader reads
          as lighting behind the content rather than a pasted-in rectangle. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            tone === "ink"
              ? `radial-gradient(80% 65% at 50% 38%, rgba(${ground},0) 0%, rgba(${ground},${a(0.62)}) 70%, rgba(${ground},${a(1)}) 100%)`
              : `radial-gradient(80% 65% at 50% 38%, rgba(${ground},0) 0%, rgba(${ground},${a(0.35)}) 70%, rgba(${ground},${a(1)}) 100%)`,
        }}
      />
      {/* Bottom hand-off into the next section, and a flat scrim that
          guarantees headline contrast wherever the gradient runs bright. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            tone === "ink"
              ? `linear-gradient(to bottom, rgba(${ground},${a(0.42)}) 0%, rgba(${ground},${a(0.28)}) 45%, rgba(${ground},${a(0.9)}) 88%, rgba(${ground},${a(1)}) 100%)`
              : `linear-gradient(to bottom, rgba(${ground},${a(0.12)}) 0%, rgba(${ground},${a(0.05)}) 45%, rgba(${ground},${a(0.9)}) 88%, rgba(${ground},${a(1)}) 100%)`,
        }}
      />
    </div>
  );
}
