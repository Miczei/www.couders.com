"use client";

import LiquidGlass from "./LiquidGlass";

/**
 * A glass tray holding a screen.
 *
 * Full-bleed animated sections have a problem you only see once it is pointed
 * out: the effect runs to the browser edge, so the eye reads the seam where
 * the page stops rather than the thing being shown. Framing the animation
 * turns it into an object on the page — and lets a section be dark without
 * the whole site going dark around it.
 *
 * The bezel is real LiquidGlass, so it refracts whatever passes behind it.
 * That needs something with structure to bend, hence the optional brand glow
 * behind the tray; against flat white a glass rim is invisible.
 */
export default function GlassStage({
  children,
  label,
  status,
  glow = true,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  /** Small mono caption on the left of the tray's rail. */
  label?: string;
  /** Right side of the rail — a clock, a state, a count. */
  status?: React.ReactNode;
  glow?: boolean;
  /** Interior is dark, so the rail flips to light type. */
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-full max-w-[1120px] ${className}`}>
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 22% 18%, rgba(14,165,233,0.16), transparent 70%), radial-gradient(55% 55% at 82% 78%, rgba(34,224,200,0.14), transparent 70%)",
            filter: "blur(18px)",
          }}
        />
      )}

      <LiquidGlass radius={30} strength={38} bezel={0.1} blur={3} className="p-2 sm:p-2.5">
        <div
          className="overflow-hidden rounded-[22px]"
          style={{
            background: dark ? "transparent" : "#FFFFFF",
            boxShadow: dark
              ? "inset 0 0 0 1px rgba(255,255,255,0.10)"
              : "inset 0 0 0 1px rgba(11,12,12,0.07)",
          }}
        >
          {(label || status) && (
            <div
              className="flex items-center justify-between gap-4 px-5 py-3 sm:px-7"
              style={{
                borderBottom: dark
                  ? "1px solid rgba(255,255,255,0.10)"
                  : "1px solid rgba(11,12,12,0.07)",
                background: dark ? "rgba(255,255,255,0.03)" : "rgba(11,12,12,0.015)",
              }}
            >
              <span
                className="truncate font-mono text-[10.5px] uppercase tracking-[0.2em]"
                style={{ color: dark ? "rgba(242,245,248,0.55)" : "rgba(11,12,12,0.45)" }}
              >
                {label}
              </span>
              <span className="shrink-0">{status}</span>
            </div>
          )}
          {children}
        </div>
      </LiquidGlass>
    </div>
  );
}
