export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { locales } from "@/i18n/config";

/**
 * Every locale-prefixed route, emitted once per language with hreflang
 * alternates. Legal documents are listed too (crawlers use them as a trust
 * signal) but at a low priority and a yearly change frequency, so they never
 * compete with the commercial pages for crawl budget.
 */
type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const PATHS: Entry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "about", changeFrequency: "monthly", priority: 0.8 },
  { path: "services/ai-engine", changeFrequency: "monthly", priority: 0.8 },
  { path: "services/security-data", changeFrequency: "monthly", priority: 0.8 },
  { path: "methodology", changeFrequency: "monthly", priority: 0.8 },
  { path: "faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const { path, changeFrequency, priority } of PATHS) {
    const suffix = path ? `/${path}` : "";
    for (const l of locales) {
      entries.push({
        url: `${SITE_URL}/${l}${suffix}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((x) => [x, `${SITE_URL}/${x}${suffix}`])
          ),
        },
      });
    }
  }
  return entries;
}
