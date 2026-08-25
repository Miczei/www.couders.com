// Production origin used for canonical URLs, OpenGraph, sitemap and JSON-LD.
// The fallback is the real domain (see CNAME), because the GitHub Pages
// workflow does not set NEXT_PUBLIC_SITE_URL: with the old placeholder
// fallback every deployed page advertised canonical, hreflang and sitemap
// URLs on a domain that does not exist. Override the env var only to point a
// preview deployment at its own origin.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://couders.com"
).replace(/\/$/, "");
