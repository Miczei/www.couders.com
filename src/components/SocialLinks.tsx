import { SOCIAL_PROFILES } from "@/lib/site";
import type { Locale } from "@/i18n/config";

/**
 * Social profile icons for the footer.
 *
 * The glyphs are inline SVG rather than an icon package: lucide-react dropped
 * its brand icons in v1, and inlining keeps the markup self-contained, which
 * the static export needs anyway (no runtime request for an asset).
 *
 * Each path is drawn on a 24x24 grid with the 1.6 stroke the rest of the site
 * uses, so a new brand added here matches without extra styling.
 */
const GLYPHS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      {/* One closed outline for the "n": stem up, over the shoulder, down the
          right side, then back under the shoulder. It deliberately draws no
          edge at x=14 between y=9 and y=15, which is where the stem and the
          bowl merge, otherwise that edge shows up as a notch in the corner. */}
      <path d="M10 21V9H14A6 6 0 0 1 22 15V21H18V15A2 2 0 0 0 14 15V21Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};

export default function SocialLinks({ locale }: { locale: Locale }) {
  if (SOCIAL_PROFILES.length === 0) return null;

  const on = locale === "pl" ? "Couders na" : "Couders on";

  return (
    <ul className="footer__social" aria-label="Social media">
      {SOCIAL_PROFILES.map((p) => (
        <li key={p.id}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${on} ${p.label}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {GLYPHS[p.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
