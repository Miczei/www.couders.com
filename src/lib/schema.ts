import { SITE_URL } from "./site";
import type { Locale } from "@/i18n/config";
import type { PageContent } from "@/i18n/pages";

/**
 * JSON-LD for a service silo page: a Service (what we offer) plus a
 * BreadcrumbList (crawlable position in the site). Rendered into the page as
 * an application/ld+json script.
 */
export function buildPageSchema(locale: Locale, page: PageContent) {
  const url = `${SITE_URL}/${locale}/${page.slug}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.breadcrumb,
    serviceType: page.eyebrow,
    description: page.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      name: "NOVA",
      url: `${SITE_URL}/${locale}`,
    },
    areaServed: ["Europe", "North America", "Asia-Pacific"],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "NOVA",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumb,
        item: url,
      },
    ],
  };

  return [service, breadcrumb];
}
