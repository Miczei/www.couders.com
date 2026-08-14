import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoudersHero from "@/components/couders/CoudersHero";
import ProblemSection from "@/components/couders/ProblemSection";
import ThreePillars from "@/components/couders/ThreePillars";
import LogoTicker from "@/components/couders/LogoTicker";
import IndustriesSection from "@/components/couders/IndustriesSection";
import CtaSection from "@/components/couders/CtaSection";
import { getDictionary } from "@/i18n/dictionaries";
import { getCouders } from "@/i18n/couders";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

// See layout.tsx: params must be typed as `string` to match the type Next.js
// generates from generateStaticParams; narrow to Locale here instead.
function toLocale(value: string): Locale {
  return (locales as readonly string[]).includes(value)
    ? (value as Locale)
    : defaultLocale;
}

// Experimental homepage-only light theme. Every couders/ section accepts a
// `light` prop (dark by default), and the wrapper's `couders-light` class
// re-lightens the shared Navbar/Footer via scoped rules in globals.css.
// Flipping this back to false fully reverts to the dark homepage — nothing
// else on the site reads this flag.
const LIGHT_MODE_EXPERIMENT = true;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const dict = getDictionary(locale);
  const couders = getCouders(locale);

  return (
    <div className={`sub-shell couders-shell ${LIGHT_MODE_EXPERIMENT ? "couders-light" : ""}`}>
      <Navbar locale={locale} dict={dict} />
      <main>
        <CoudersHero content={couders.hero} locale={locale} light={LIGHT_MODE_EXPERIMENT} />
        <ProblemSection content={couders.problem} light={LIGHT_MODE_EXPERIMENT} />
        <ThreePillars content={couders.pillars} light={LIGHT_MODE_EXPERIMENT} />
        <LogoTicker content={couders.logoTicker} light={LIGHT_MODE_EXPERIMENT} />
        <IndustriesSection content={couders.industries} light={LIGHT_MODE_EXPERIMENT} />
        <CtaSection
          content={couders.cta}
          email={dict.sections.contact.email}
          locale={locale}
          light={LIGHT_MODE_EXPERIMENT}
        />
      </main>
      <Footer dict={dict} locale={locale} />
    </div>
  );
}
