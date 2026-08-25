import { SITE_URL } from "./site";
import type { Locale } from "@/i18n/config";
import type { PageContent } from "@/i18n/pages";
import type { AboutContent } from "@/i18n/about";
import type { SolutionsContent } from "@/i18n/solutions";
import type { FaqContent } from "@/i18n/faq";
import type { LegalContent } from "@/i18n/legal";
import { LEGAL_ENTITY } from "./legal";

/**
 * Two-level BreadcrumbList (home, then this page), the shape every page on the
 * site uses. Extracted so the newer builders below do not repeat it.
 */
function breadcrumbFor(locale: Locale, name: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Couders",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: url,
      },
    ],
  };
}

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
      name: "Couders",
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
        name: "Couders",
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

/**
 * JSON-LD for the About page: an AboutPage, the Organization it describes (with
 * founding location for local relevance) and a BreadcrumbList.
 */
export function buildAboutSchema(locale: Locale, about: AboutContent) {
  const url = `${SITE_URL}/${locale}/${about.slug}`;

  const aboutPage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: about.metaTitle,
    description: about.metaDescription,
    url,
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Couders",
    url: `${SITE_URL}/${locale}`,
    description: about.metaDescription,
    foundingLocation: {
      "@type": "Place",
      name: "Kraków, Poland",
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
        name: "Couders",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: about.breadcrumb,
        item: url,
      },
    ],
  };

  return [aboutPage, organization, breadcrumb];
}

/**
 * JSON-LD for the Solutions page: a Service (what we offer), an FAQPage built
 * from the same copy shown on the page (so schema and visible content never
 * drift apart) and a BreadcrumbList.
 */
export function buildSolutionsSchema(locale: Locale, solutions: SolutionsContent) {
  const url = `${SITE_URL}/${locale}/${solutions.slug}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI & Automation Solutions",
    serviceType: "Workflow automation, web scraping, marketing automation",
    description: solutions.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      name: "Couders",
      url: `${SITE_URL}/${locale}`,
    },
    areaServed: ["Europe", "North America", "Asia-Pacific"],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: solutions.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Couders",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: solutions.breadcrumb,
        item: url,
      },
    ],
  };

  return [service, faqPage, breadcrumb];
}

/**
 * JSON-LD for the standalone FAQ page: an FAQPage built from every question on
 * the page (flattened across categories, since FAQPage has no notion of
 * grouping) plus a BreadcrumbList. Built from the same content object the page
 * renders, so the markup cannot describe questions a visitor cannot see, which
 * is what Google's structured data guidelines require.
 */
export function buildFaqSchema(locale: Locale, faq: FaqContent) {
  const url = `${SITE_URL}/${locale}/${faq.slug}`;

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: faq.metaTitle,
    description: faq.metaDescription,
    url,
    mainEntity: faq.categories.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return [faqPage, breadcrumbFor(locale, faq.breadcrumb, url)];
}

/**
 * JSON-LD for a legal document (/terms, /privacy): a WebPage carrying the
 * publisher and the revision date, plus a BreadcrumbList. schema.org has no
 * dedicated privacy-policy type, so WebPage with an explicit `about` is the
 * standard way to describe these.
 */
export function buildLegalSchema(locale: Locale, page: LegalContent) {
  const url = `${SITE_URL}/${locale}/${page.slug}`;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url,
    inLanguage: locale === "pl" ? "pl-PL" : "en-US",
    dateModified: LEGAL_ENTITY.lastUpdated,
    about: page.h1,
    publisher: {
      "@type": "Organization",
      name: LEGAL_ENTITY.brand,
      url: `${SITE_URL}/${locale}`,
      email: LEGAL_ENTITY.email,
    },
  };

  return [webPage, breadcrumbFor(locale, page.breadcrumb, url)];
}
