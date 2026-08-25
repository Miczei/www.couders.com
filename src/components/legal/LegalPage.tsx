import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LEGAL_ENTITY, entityAddressLines, entityRegistryLines } from "@/lib/legal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { LegalContent } from "@/i18n/legal";

/**
 * Shared renderer for the two legal documents (/terms, /privacy). A server
 * component: the whole page is static HTML, which is what a legal document
 * should be (readable with JS off, printable, easy to archive).
 *
 * The operator's identity is read from src/lib/legal.ts rather than the copy,
 * so registering the company later updates both documents at once. While
 * `registered` is false the identity card falls back to the honest
 * "unregistered project" wording instead of printing blank address fields.
 */
export default function LegalPage({
  locale,
  dict,
  content,
}: {
  locale: Locale;
  dict: Dictionary;
  content: LegalContent;
}) {
  const home = `/${locale}`;
  const entity = LEGAL_ENTITY;
  const addressLines = entityAddressLines(entity);
  const registryLines = entityRegistryLines(entity);

  const updated = new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${entity.lastUpdated}T00:00:00Z`));

  return (
    <div className="sub-shell">
      <Navbar locale={locale} dict={dict} />

      <main className="sub">
        <article className="legal">
          <div className="shell">
            <nav className="sub__crumbs" aria-label="Breadcrumb">
              <Link href={home}>Couders</Link>
              <span aria-hidden="true">/</span>
              <span>{content.breadcrumb}</span>
            </nav>

            <header className="legal__head">
              <p className="section-eyebrow">
                <span>{content.eyebrow}</span>
              </p>
              <h1 className="sub__h1">{content.h1}</h1>
              <p className="sub__intro">{content.lead}</p>
              <p className="legal__updated">
                {content.updatedLabel}:{" "}
                <time dateTime={entity.lastUpdated}>{updated}</time>
              </p>
            </header>

            <div className="legal__body">
              {/* Table of contents. Sticky beside the text on desktop, a
                  plain list above it on narrow screens. */}
              <nav className="legal__toc" aria-label={content.tocLabel}>
                <p className="legal__tocTitle">{content.tocLabel}</p>
                <ol>
                  <li>
                    <a href="#identity">{content.identity.h2}</a>
                  </li>
                  {content.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.h2}</a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="legal__doc">
                {/* Who we are / who the controller is. */}
                <section id="identity" className="legal__section" aria-labelledby="identity-h">
                  <h2 id="identity-h" className="legal__h2">
                    {content.identity.h2}
                  </h2>

                  {entity.registered ? (
                    <>
                      <p className="legal__p">{content.identity.intro}</p>
                      <div className="legal__identity">
                        <dl>
                          <div>
                            <dt>{content.identity.addressLabel}</dt>
                            <dd>
                              {addressLines.map((line) => (
                                <span key={line}>{line}</span>
                              ))}
                            </dd>
                          </div>
                          {registryLines.length > 0 && (
                            <div>
                              <dt>{content.identity.registryLabel}</dt>
                              <dd>
                                {registryLines.map((line) => (
                                  <span key={line}>{line}</span>
                                ))}
                              </dd>
                            </div>
                          )}
                          <div>
                            <dt>{content.identity.emailLabel}</dt>
                            <dd>
                              <a href={`mailto:${entity.privacyEmail}`}>{entity.privacyEmail}</a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="legal__p">{content.identity.unregistered}</p>
                      <div className="legal__identity">
                        <dl>
                          <div>
                            <dt>{content.identity.emailLabel}</dt>
                            <dd>
                              <a href={`mailto:${entity.privacyEmail}`}>{entity.privacyEmail}</a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </>
                  )}
                </section>

                {content.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="legal__section"
                    aria-labelledby={`${section.id}-h`}
                  >
                    <h2 id={`${section.id}-h`} className="legal__h2">
                      {section.h2}
                    </h2>
                    {section.blocks.map((block, i) =>
                      block.kind === "p" ? (
                        <p key={i} className="legal__p">
                          {block.text}
                        </p>
                      ) : (
                        <ul key={i} className="legal__ul">
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )
                    )}
                  </section>
                ))}
              </div>
            </div>

            <section className="sub__cta" aria-labelledby="legal-cta-h">
              <h2 id="legal-cta-h" className="sub__ctaTitle">
                {content.contactTitle}
              </h2>
              <p className="sub__lead legal__ctaBody">{content.contactBody}</p>
              <div className="hero-actions">
                <Link className="btn btn--primary" href={`${home}/contact`}>
                  {content.contactCta}
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
