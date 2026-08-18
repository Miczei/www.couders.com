import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from "next/font/google";

/**
 * Type is scoped to this route on purpose: the live site runs Inter and Space
 * Grotesk, which every AI-generated landing page also runs. Swapping the faces
 * is the single change that moves this furthest away from that look, and it
 * needs to be judged side by side before it touches production.
 *
 * Bricolage carries an optical-size axis, so the display face genuinely
 * redraws between a 14px label and a 5rem headline instead of just scaling.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  variable: "--p-font-display",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--p-font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--p-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Couders — kierunek premium",
  robots: { index: false, follow: false },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} premium-shell`}>
      {children}
    </div>
  );
}
