import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import SocialLinks from "@/components/SocialLinks";

/**
 * Footer — server component. Caps the page with brand, cross-silo links, and
 * copyright. Section anchors are locale-prefixed so they work from any page.
 *
 * The bottom row carries the utility links (terms, privacy, FAQ, sitemap). It
 * stays visible at every width, unlike `.footer__links` above it, which the
 * mobile stylesheet hides: the legal documents have to be reachable from every
 * page on a phone too, not just on desktop.
 */
export default function Footer({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const f = dict.sections.footer;
  const year = new Date().getFullYear();
  const home = `/${locale}`;
  const legalLabel = locale === "pl" ? "Informacje prawne" : "Legal";

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <span className="nav__brand">Couders</span>
          <span className="footer__tagline">{f.tagline}</span>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <Link href={`${home}/about`}>{dict.nav.about}</Link>
          <Link href={`${home}/services/ai-engine`}>{dict.nav.aiEngine}</Link>
          <Link href={`${home}/services/security-data`}>{dict.nav.securityData}</Link>
          <Link href={`${home}/methodology`}>{dict.nav.methodology}</Link>
          <Link href={`${home}/contact`}>{dict.nav.contact}</Link>
        </nav>
      </div>

      {/* Social gets a line of its own rather than sharing the utility row:
          it reads as its own thing, and the list is meant to grow. No rule
          above it, so the footer keeps a single hairline instead of stacking
          two a few pixels apart. */}
      <div className="shell footer__socialRow">
        <SocialLinks locale={locale} />
      </div>

      <div className="shell footer__bottom">
        <div className="footer__meta">
          © {year} Couders. {f.rights}
        </div>

        <nav className="footer__legal" aria-label={legalLabel}>
          <Link href={`${home}/faq`}>{f.faq}</Link>
          <Link href={`${home}/terms`}>{f.terms}</Link>
          <Link href={`${home}/privacy`}>{f.privacy}</Link>
          <a href="/sitemap.xml">{f.sitemap}</a>
        </nav>
      </div>
    </footer>
  );
}
