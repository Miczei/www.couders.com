import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Footer — server component. Caps the page with brand, nav, and copyright.
 */
export default function Footer({ dict }: { dict: Dictionary }) {
  const f = dict.sections.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <span className="nav__brand">NOVA</span>
          <span className="footer__tagline">{f.tagline}</span>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <a href="#work">{dict.nav.work}</a>
          <a href="#capabilities">{dict.nav.capabilities}</a>
          <a href="#agents">{dict.nav.aiChatbots}</a>
          <a href="#process">{dict.nav.process}</a>
        </nav>

        <div className="footer__meta">
          © {year} NOVA. {f.rights}
        </div>
      </div>
    </footer>
  );
}
