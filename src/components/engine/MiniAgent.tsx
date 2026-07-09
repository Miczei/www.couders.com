"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

export default function MiniAgent({
  statuses,
  label,
}: {
  statuses: string[];
  label: string;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const [status, setStatus] = useState(statuses[0]);
  const reduced = useReducedMotion();

  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(statuses.length - 1, Math.max(0, Math.floor(v * statuses.length)));
    setStatus(statuses[idx]);
  });

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden flex-col items-center gap-2 md:flex">
      <span className="sr-only">{label}</span>
      <motion.svg
        aria-hidden="true"
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="agent-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor="#C7CCD6" />
            <stop offset="1" stopColor="#6E7178" />
          </linearGradient>
          <radialGradient id="agent-iris" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#C7CCD6" />
            <stop offset="1" stopColor="#3A3D44" />
          </radialGradient>
        </defs>
        <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <motion.circle
          cx="28"
          cy="28"
          r="24"
          stroke="url(#agent-ring)"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ pathLength: progress }}
        />
        <motion.g
          animate={reduced ? undefined : { scaleY: [1, 1, 0.06, 1] }}
          transition={{
            duration: 0.42,
            times: [0, 0.7, 0.85, 1],
            repeat: Infinity,
            repeatDelay: 4.4,
            ease: "easeInOut",
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx="28" cy="28" r="9" fill="url(#agent-iris)" />
          <circle cx="25" cy="25" r="2" fill="white" opacity="0.85" />
        </motion.g>
      </motion.svg>
      <span
        aria-hidden="true"
        className="rounded-full border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 backdrop-blur"
      >
        {status}
      </span>
    </div>
  );
}
