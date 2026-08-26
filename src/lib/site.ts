// Production origin used for canonical URLs, OpenGraph, sitemap and JSON-LD.
// The fallback is the real domain (see CNAME), because the GitHub Pages
// workflow does not set NEXT_PUBLIC_SITE_URL: with the old placeholder
// fallback every deployed page advertised canonical, hreflang and sitemap
// URLs on a domain that does not exist. Override the env var only to point a
// preview deployment at its own origin.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://couders.com"
).replace(/\/$/, "");

/**
 * Public social profiles, in the order they should appear in the footer.
 *
 * One list feeds two consumers: the footer icon row and the Organization
 * schema's `sameAs`, which is how a search engine ties the brand on this
 * domain to the same brand on those platforms. Adding a profile means adding
 * one entry here plus its glyph in SocialLinks.
 */
export type SocialProfile = {
  /** Matches a glyph key in components/SocialLinks.tsx. */
  id: "instagram" | "linkedin";
  /** Used for the link's accessible name, e.g. "Couders on Instagram". */
  label: string;
  url: string;
};

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/coudersai/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    // Canonical company URL. The ?viewAsMember=true you get from LinkedIn's
    // own "view as member" preview is a session artifact, not part of the
    // address, so it is not carried into a public link or into `sameAs`.
    url: "https://www.linkedin.com/company/couders/",
  },
];
