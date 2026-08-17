"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Apple-style liquid glass: the backdrop is genuinely refracted, not just
 * blurred.
 *
 * A rounded-rect signed distance field is rasterised to a displacement map
 * where R and G encode X/Y offset and the bezel falls off to nothing in the
 * middle, then fed to an SVG feDisplacementMap driven through
 * `backdrop-filter: url(#…)`. Two passes at slightly different scales split
 * the channels enough to read as chromatic aberration at the edges.
 *
 * Only Chromium implements url() filters in backdrop-filter. Everywhere else
 * (Safari, Firefox) this degrades to blur + saturate + a specular rim, which
 * is the ordinary glassmorphism look — still fine, just not refractive. The
 * detection runs at mount because the shape of the fallback changes the
 * markup, not just a colour.
 */
export default function LiquidGlass({
  children,
  className = "",
  radius = 28,
  /** Peak pixel displacement at the bezel. Past ~70 it stops reading as glass. */
  strength = 46,
  /** Bezel width as a fraction of the shorter side. */
  bezel = 0.22,
  blur = 3,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
  bezel?: number;
  blur?: number;
}) {
  const id = useId().replace(/[:]/g, "");
  const hostRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<string | null>(null);
  const [refracts, setRefracts] = useState(false);

  useEffect(() => {
    setRefracts(
      typeof CSS !== "undefined" &&
        CSS.supports?.("backdrop-filter", `url(#${id})`) === true,
    );
  }, [id]);

  // Rasterise the displacement map whenever the element resizes.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !refracts) return;

    let frame = 0;
    const draw = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width < 2 || height < 2) return;

      // Half resolution: the map is smooth by construction and the filter
      // samples it bilinearly, so full-res buys nothing but fill cost.
      const w = Math.max(2, Math.round(width / 2));
      const h = Math.max(2, Math.round(height / 2));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = ctx.createImageData(w, h);
      const hw = w / 2;
      const hh = h / 2;
      const r = Math.min(radius / 2, Math.min(hw, hh) - 1);
      const band = Math.min(hw, hh) * bezel * 2;

      // Distance to a rounded rectangle, centred on the element.
      const sdf = (x: number, y: number) => {
        const qx = Math.abs(x - hw) - (hw - r);
        const qy = Math.abs(y - hh) - (hh - r);
        return (
          Math.min(Math.max(qx, qy), 0) +
          Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) -
          r
        );
      };

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const d = sdf(x, y);
          // Surface normal from the SDF gradient, by central difference.
          const nx = sdf(x + 1, y) - sdf(x - 1, y);
          const ny = sdf(x, y + 1) - sdf(x, y - 1);
          const len = Math.hypot(nx, ny) || 1;

          // Ramp: nothing in the flat middle, peaking right at the rim, and
          // cut to zero outside the shape so the filter can't smear corners.
          let t = 0;
          if (d < 0 && d > -band) {
            const u = 1 + d / band; // 0 at inner edge of band -> 1 at rim
            t = u * u * (3 - 2 * u); // smoothstep
          }

          const i = (y * w + x) * 4;
          img.data[i] = Math.round(128 + (nx / len) * t * 127);
          img.data[i + 1] = Math.round(128 + (ny / len) * t * 127);
          img.data[i + 2] = Math.round(t * 255); // specular mask
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      setMap(canvas.toDataURL());
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [refracts, radius, bezel]);

  const filterReady = refracts && map;

  return (
    <div
      ref={hostRef}
      className={`relative isolate ${className}`}
      style={{ borderRadius: radius }}
    >
      {filterReady && (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <filter
            id={id}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={map} preserveAspectRatio="none" result="map" />
            {/* Red pass runs slightly hotter than blue: same trick a real lens
                plays on you, and the reason the rim looks like glass. */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="hot"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength * 0.82}
              xChannelSelector="R"
              yChannelSelector="G"
              result="cool"
            />
            <feBlend in="hot" in2="cool" mode="screen" />
          </filter>
        </svg>
      )}

      {/* The pane itself. Nothing here renders content — it only bends and
          tints whatever is behind, so it must sit under the children. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          borderRadius: radius,
          backdropFilter: filterReady
            ? `url(#${id}) blur(${blur}px) saturate(1.45) brightness(1.03)`
            : `blur(${blur * 4}px) saturate(1.5) brightness(1.04)`,
          WebkitBackdropFilter: filterReady
            ? `url(#${id}) blur(${blur}px) saturate(1.45) brightness(1.03)`
            : `blur(${blur * 4}px) saturate(1.5) brightness(1.04)`,
          // Kept thin on purpose. Anything heavier and the tint hides the
          // very refraction it is supposed to sit on top of.
          background:
            "linear-gradient(140deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.20) 100%)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(16,18,21,0.06), 0 22px 48px -28px rgba(16,18,21,0.45)",
        }}
      />
      {children}
    </div>
  );
}
