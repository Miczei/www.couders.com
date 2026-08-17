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
const PALETTE = {
  // Light hero: near-white ground, brand sky/teal only ever as a tint.
  light: ["#FFFFFF", "#EAF4FD", "#CFE7F8", "#CFF1EA", "#F8FCFF"],
  // Dark hero: ink ground with the accents held well below full saturation.
  dark: ["#060608", "#0A1622", "#0E3550", "#123B3A", "#08101A"],
};

const PLACEHOLDER = {
  light:
    "radial-gradient(120% 90% at 50% 0%, #E8F4FD 0%, #F7FBFF 45%, #FFFFFF 100%)",
  dark: "radial-gradient(120% 90% at 50% 0%, #0B2C46 0%, #08111A 45%, #060608 100%)",
};

export default function ShaderBackdrop({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const tone = light ? "light" : "dark";

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
          grainOverlay={light ? 0.05 : 0.12}
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
          background: light
            ? "radial-gradient(80% 65% at 50% 38%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 70%, #FFFFFF 100%)"
            : "radial-gradient(80% 65% at 50% 38%, rgba(6,6,8,0) 0%, rgba(6,6,8,0.62) 70%, #060608 100%)",
        }}
      />
      {/* Bottom hand-off into the next section, and a flat scrim that
          guarantees H1 contrast wherever the gradient happens to be bright. */}
      <div
        className="absolute inset-0"
        style={{
          background: light
            ? "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.9) 88%, #FFFFFF 100%)"
            : "linear-gradient(to bottom, rgba(6,6,8,0.42) 0%, rgba(6,6,8,0.28) 45%, rgba(6,6,8,0.9) 88%, #060608 100%)",
        }}
      />
    </div>
  );
}
