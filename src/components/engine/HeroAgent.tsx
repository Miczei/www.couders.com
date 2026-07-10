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

/* Flower fill position in final viewBox coordinates (0 0 600 595 space).
   The traced artwork already draws the tulip outline; this terracotta disc
   sits BEHIND it and fills the bowl, like the reference render. */
const FLOWER = { cx: 281, cy: 193, r: 52 };
const STEM_DROP = 30;

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
          {/* Bloom silhouette */}
          <path
            d={`M ${FLOWER.cx - FLOWER.r} ${FLOWER.cy}
                C ${FLOWER.cx - FLOWER.r} ${FLOWER.cy - FLOWER.r * 0.58} ${FLOWER.cx - FLOWER.r * 0.58} ${FLOWER.cy - FLOWER.r} ${FLOWER.cx} ${FLOWER.cy - FLOWER.r}
                C ${FLOWER.cx + FLOWER.r * 0.58} ${FLOWER.cy - FLOWER.r} ${FLOWER.cx + FLOWER.r} ${FLOWER.cy - FLOWER.r * 0.58} ${FLOWER.cx + FLOWER.r} ${FLOWER.cy}
                C ${FLOWER.cx + FLOWER.r} ${FLOWER.cy + FLOWER.r * 0.52} ${FLOWER.cx + FLOWER.r * 0.56} ${FLOWER.cy + FLOWER.r * 0.92} ${FLOWER.cx} ${FLOWER.cy + FLOWER.r * 0.92}
                C ${FLOWER.cx - FLOWER.r * 0.56} ${FLOWER.cy + FLOWER.r * 0.92} ${FLOWER.cx - FLOWER.r} ${FLOWER.cy + FLOWER.r * 0.52} ${FLOWER.cx - FLOWER.r} ${FLOWER.cy} Z`}
            fill={FLOWER_COLOR}
          />
          {/* Inner petal spiral */}
          <path
            d={`M ${FLOWER.cx + FLOWER.r * 0.04} ${FLOWER.cy + FLOWER.r * 0.12}
                C ${FLOWER.cx + FLOWER.r * 0.3} ${FLOWER.cy - FLOWER.r * 0.04} ${FLOWER.cx + FLOWER.r * 0.16} ${FLOWER.cy - FLOWER.r * 0.34} ${FLOWER.cx - FLOWER.r * 0.12} ${FLOWER.cy - FLOWER.r * 0.22}
                C ${FLOWER.cx - FLOWER.r * 0.42} ${FLOWER.cy - FLOWER.r * 0.08} ${FLOWER.cx - FLOWER.r * 0.3} ${FLOWER.cy + FLOWER.r * 0.3} ${FLOWER.cx + FLOWER.r * 0.04} ${FLOWER.cy + FLOWER.r * 0.42}
                C ${FLOWER.cx + FLOWER.r * 0.46} ${FLOWER.cy + FLOWER.r * 0.54} ${FLOWER.cx + FLOWER.r * 0.72} ${FLOWER.cy + FLOWER.r * 0.16} ${FLOWER.cx + FLOWER.r * 0.54} ${FLOWER.cy - FLOWER.r * 0.26}`}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Side petals */}
          <path
            d={`M ${FLOWER.cx - FLOWER.r * 0.88} ${FLOWER.cy + FLOWER.r * 0.34}
                C ${FLOWER.cx - FLOWER.r * 0.7} ${FLOWER.cy - FLOWER.r * 0.1} ${FLOWER.cx - FLOWER.r * 0.46} ${FLOWER.cy - FLOWER.r * 0.5} ${FLOWER.cx - FLOWER.r * 0.1} ${FLOWER.cy - FLOWER.r * 0.72}`}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d={`M ${FLOWER.cx + FLOWER.r * 0.88} ${FLOWER.cy + FLOWER.r * 0.34}
                C ${FLOWER.cx + FLOWER.r * 0.7} ${FLOWER.cy - FLOWER.r * 0.1} ${FLOWER.cx + FLOWER.r * 0.46} ${FLOWER.cy - FLOWER.r * 0.5} ${FLOWER.cx + FLOWER.r * 0.1} ${FLOWER.cy - FLOWER.r * 0.72}`}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Bottom petal cup */}
          <path
            d={`M ${FLOWER.cx - FLOWER.r * 0.55} ${FLOWER.cy + FLOWER.r * 0.74}
                Q ${FLOWER.cx} ${FLOWER.cy + FLOWER.r * 1.02} ${FLOWER.cx + FLOWER.r * 0.55} ${FLOWER.cy + FLOWER.r * 0.74}`}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="4"
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
