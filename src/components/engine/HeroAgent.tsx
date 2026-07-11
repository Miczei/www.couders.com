"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FLOWER_COLOR, LINE_COLOR } from "./agentPath";
import {
  AGENT_ART_D,
  AGENT_ART_TRANSFORM,
  AGENT_ART_VIEWBOX,
} from "./agentArt";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* Flower position in final viewBox coordinates (0 0 600 595 space),
   centered on the traced bloom so the rose caps the stem. */
const FLOWER = { cx: 281, cy: 200, r: 56 };
const STEM_DROP = 30;

/* Five-petal scalloped rose silhouette around (cx, cy). */
function roseSilhouette(cx: number, cy: number, R: number): string {
  const petals = 5;
  const pts = Array.from({ length: petals }, (_, i) => {
    const a = ((-90 + (360 / petals) * i) * Math.PI) / 180;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
  const arc = (2 * R * Math.sin(Math.PI / petals) * 0.62).toFixed(1);
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i <= petals; i++) {
    const [x, y] = pts[i % petals];
    d += ` A ${arc} ${arc} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} Z`;
}

/* Single inward petal spiral around (cx, cy). */
function roseSpiral(cx: number, cy: number, r: number): string {
  return (
    `M ${cx + r * 0.44} ${cy + r * 0.12}` +
    ` C ${cx + r * 0.44} ${cy - r * 0.4}, ${cx - r * 0.48} ${cy - r * 0.4}, ${cx - r * 0.48} ${cy + r * 0.02}` +
    ` C ${cx - r * 0.48} ${cy + r * 0.36}, ${cx + r * 0.14} ${cy + r * 0.42}, ${cx + r * 0.16} ${cy + r * 0.06}` +
    ` C ${cx + r * 0.17} ${cy - r * 0.16}, ${cx - r * 0.14} ${cy - r * 0.18}, ${cx - r * 0.16} ${cy + r * 0.02}`
  );
}

export default function HeroAgent({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const artRef = useRef<SVGPathElement>(null);
  const [view, setView] = useState<{ x: number; y: number; w: number; h: number } | null>(
    null
  );

  useEffect(() => {
    const p = artRef.current;
    if (!p) return;
    let b: DOMRect;
    try {
      b = p.getBBox();
    } catch {
      return;
    }
    // Map the path's local bbox through the trace transform
    // translate(tx,ty) scale(sx,sy) into final viewBox space.
    const m = AGENT_ART_TRANSFORM.match(
      /translate\(([-\d.]+),([-\d.]+)\)\s*scale\(([-\d.]+),([-\d.]+)\)/
    );
    if (!m) return;
    const [tx, ty, sx, sy] = [+m[1], +m[2], +m[3], +m[4]];
    const xs = [tx + sx * b.x, tx + sx * (b.x + b.width)];
    const ys = [ty + sy * b.y, ty + sy * (b.y + b.height)];
    const minX = Math.min(...xs, FLOWER.cx - FLOWER.r);
    const maxX = Math.max(...xs, FLOWER.cx + FLOWER.r);
    const minY = Math.min(...ys, FLOWER.cy - FLOWER.r);
    const maxY = Math.max(...ys, FLOWER.cy + FLOWER.r);
    const pad = 0.06 * Math.max(maxX - minX, maxY - minY);
    setView({
      x: minX - pad,
      y: minY - pad,
      w: maxX - minX + pad * 2,
      h: maxY - minY + pad * 2,
    });
  }, []);

  const fallback = AGENT_ART_VIEWBOX.split(/\s+/).map(Number);
  const vb = view ?? { x: fallback[0], y: fallback[1], w: fallback[2], h: fallback[3] };
  const stemBase = { x: FLOWER.cx, y: FLOWER.cy + FLOWER.r + STEM_DROP };

  return (
    <motion.svg
      aria-hidden="true"
      viewBox={`${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`}
      fill="none"
      className={className}
      opacity={view ? 1 : 0}
      style={{ transformOrigin: "50% 85%" }}
      animate={reduced ? undefined : { rotate: [-2.2, 2.2] }}
      transition={{
        duration: 2.9,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <defs>
        <filter id="agent-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <mask id="agent-reveal" maskUnits="userSpaceOnUse">
          <motion.rect
            x={vb.x}
            y={vb.y}
            height={vb.h}
            fill="#fff"
            initial={reduced ? { width: vb.w } : { width: 0 }}
            animate={{ width: vb.w }}
            transition={{ duration: 2.2, ease: EASE }}
          />
        </mask>
      </defs>

      {/* Terracotta fill breathing gently beneath the traced tulip. */}
      <motion.g
        animate={reduced ? undefined : { rotate: [2.5, -2.5] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0.4,
        }}
        style={{
          transformOrigin: `${stemBase.x}px ${stemBase.y}px`,
          transformBox: "view-box",
        }}
      >
        <motion.g
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.7, ease: EASE }}
          style={{
            transformOrigin: `${stemBase.x}px ${stemBase.y}px`,
            transformBox: "view-box",
          }}
        >
          {/* Backdrop patch: hides the traced bloom so the rose reads clean. */}
          <circle cx={FLOWER.cx} cy={FLOWER.cy + 6} r={FLOWER.r * 1.5} fill="#000" />
          {/* Petal silhouette */}
          <path
            d={roseSilhouette(FLOWER.cx, FLOWER.cy, FLOWER.r)}
            fill={FLOWER_COLOR}
            stroke={LINE_COLOR}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Single inner spiral */}
          <path
            d={roseSpiral(FLOWER.cx, FLOWER.cy, FLOWER.r)}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Stem bridge from the rose down to the traced stem. */}
          <path
            d={`M ${FLOWER.cx} ${FLOWER.cy + FLOWER.r} L ${FLOWER.cx} ${FLOWER.cy + FLOWER.r * 1.55}`}
            stroke={LINE_COLOR}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>

      <g mask="url(#agent-reveal)">
        {/* Soft silver halo behind the artwork. */}
        <use href="#agent-art" filter="url(#agent-glow)" opacity="0.3" />

        <g id="agent-art" transform={AGENT_ART_TRANSFORM} fill={LINE_COLOR}>
          <path ref={artRef} d={AGENT_ART_D} />
        </g>
      </g>
    </motion.svg>
  );
}
