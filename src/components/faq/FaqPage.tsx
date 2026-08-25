import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FaqContent } from "@/i18n/faq";

/**
 * FAQ page (/faq). A server component built on native <details>, so every
 * answer is in the HTML whether or not a crawler expands it, and the page
 * needs no client JavaScript. The first item of the first category starts
 * open, purely so the pattern is obvious on arrival.
 *
 * The same `content.categories` feed the FAQPage JSON-LD in lib/schema.ts,
 * which is what keeps the structured data and the visible copy identical.
 */
export default function FaqPage({
  locale,
  dict,
  content,
}: {
  locale: Locale;
  dict: Dictionary;
  content: FaqContent;
}) {
  const home = `/${locale}`;

  return (
    <div className="sub-shell">
      <Navbar locale={locale} dict={dict} />

      <main className="sub">
        <article className="faq">
          <div className="shell">
            <nav className="sub__crumbs" aria-label="Breadcrumb">
              <Link href={home}>Couders</Link>
              <span aria-hidden="true">/</span>
              <span>{content.breadcrumb}</span>
            </nav>

            <header className="faq__head">
              <p className="section-eyebrow">
                <span>{content.eyebrow}</span>
              </p>
              <h1 className="sub__h1">{content.h1}</h1>
              <p className="sub__intro">{content.lead}</p>
            </header>

            {/* Category jump links. Plain anchors, so they work with JS off
                and give crawlers an outline of the page. */}
            <nav className="faq__jump" aria-label={content.jumpLabel}>
              {content.categories.map((cat) => (
                <a key={cat.id} href={`#${cat.id}`}>
                  {cat.label}
                </a>
              ))}
            </nav>

            {content.categories.map((cat, catIndex) => (
              <section
                key={cat.id}
                id={cat.id}
                className="faq__cat"
                aria-labelledby={`${cat.id}-h`}
              >
                <h2 id={`${cat.id}-h`} className="faq__catH2">
                  {cat.label}
                </h2>

                <div className="faq__list">
                  {cat.items.map((item, i) => (
                    <details key={item.q} open={catIndex === 0 && i === 0}>
                      <summary>
                        <h3 className="faq__q">{item.q}</h3>
                      </summary>
                      <div className="faq__a">{item.a}</div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            <section className="sub__cta" aria-labelledby="faq-cta-h">
              <h2 id="faq-cta-h" className="sub__ctaTitle">
                {content.ctaTitle}
              </h2>
              <p className="sub__lead faq__ctaBody">{content.ctaBody}</p>
              <div className="hero-actions">
                <Link className="btn btn--primary" href={`${home}/contact`}>
                  {content.ctaPrimary}
                </Link>
                <Link className="btn btn--ghost" href={`${home}/methodology`}>
                  {content.ctaSecondary}
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer dict={dict} locale={locale} />
    </div>
  );
}
