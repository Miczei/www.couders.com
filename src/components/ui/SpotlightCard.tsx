"use client";

import { useCallback } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Cursor-tracked radial glow, Aceternity/Linear style.
 *
 * Position is held in motion values rather than React state on purpose: a
 * mousemove handler that calls setState re-renders the whole card on every
 * pixel of travel. Motion values write straight to the DOM node, so the glow
 * follows the cursor without a single React render.
 *
 * The consumer must be `position: relative` + `overflow-hidden` and carry the
 * `group` class, which is what keeps the glow clipped strictly inside the
 * card's rounded border and lets it fade in on hover.
 */
export function useSpotlight({
  size = 400,
  color = "rgba(14,165,233,0.18)",
}: { size?: number; color?: string } = {}) {
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 70%)`;

  const glow = (
    <motion.div
      aria-hidden="true"
      style={{ background }}
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />
  );

  return { onMouseMove, glow };
}

// `children` is narrowed back to ReactNode: HTMLMotionProps widens it to also
// accept MotionValues, which a plain wrapper div can't render.
type SpotlightCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
  spotlightSize?: number;
  spotlightColor?: string;
};

export default function SpotlightCard({
  className,
  children,
  spotlightSize,
  spotlightColor,
  ...motionProps
}: SpotlightCardProps) {
  const { onMouseMove, glow } = useSpotlight({
    size: spotlightSize,
    color: spotlightColor,
  });

  return (
    <motion.div
      onMouseMove={onMouseMove}
      className={cn(
        "group relative overflow-hidden border border-slate-200/50 transition-[border-color,box-shadow,transform] duration-500 hover:border-sky-400/50",
        className,
      )}
      {...motionProps}
    >
      {glow}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
