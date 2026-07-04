// Production origin used for canonical URLs, OpenGraph, sitemap and JSON-LD.
// Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://nova.studio) so these point
// at the real domain; the placeholder fallback keeps local builds working.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nova-studio.example"
).replace(/\/$/, "");
