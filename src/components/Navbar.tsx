"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Transparent, sticky navbar. Glass-blurs in once the user leaves the hero top.
 * The "PL / EN" toggle in the top-right is real locale links (SEO-friendly) —
 * switching language navigates between /pl and /en.
 */
export default function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <Link className="nav__brand" href={`/${locale}`}>
        NOVA
      </Link>

      <nav className="nav__links" aria-label="Primary">
        <a href="#capabilities">{dict.nav.capabilities}</a>
        <a href="#agents">{dict.nav.aiChatbots}</a>
        <a href="#process">{dict.nav.process}</a>
        <a href="#globe">{dict.nav.reach}</a>
      </nav>

      <div className="nav__right">
        <div className="lang-toggle" role="group" aria-label={dict.nav.languageLabel}>
          <Link
            href="/pl"
            hrefLang="pl"
            aria-current={locale === "pl" ? "true" : undefined}
            className={`lang ${locale === "pl" ? "lang--active" : ""}`}
          >
            PL
          </Link>
          <span className="lang-sep" aria-hidden="true">
            /
          </span>
          <Link
            href="/en"
            hrefLang="en"
            aria-current={locale === "en" ? "true" : undefined}
            className={`lang ${locale === "en" ? "lang--active" : ""}`}
          >
            EN
          </Link>
        </div>

        <a className="nav__cta" href="#contact">
          {dict.nav.cta}
        </a>
      </div>
    </header>
  );
}
