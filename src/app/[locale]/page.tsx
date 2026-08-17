import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoudersHero from "@/components/couders/CoudersHero";
import ProblemSection from "@/components/couders/ProblemSection";
import ThreePillars from "@/components/couders/ThreePillars";
import LogoTicker from "@/components/couders/LogoTicker";
import MetricsSection from "@/components/couders/MetricsSection";
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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const dict = getDictionary(locale);
  const couders = getCouders(locale);

  return (
    <div className="sub-shell">
      <Navbar locale={locale} dict={dict} />
      <main>
        <CoudersHero content={couders.hero} locale={locale} light />
        <ThreePillars content={couders.pillars} locale={locale} light />
        <IndustriesSection content={couders.industries} light />
        <ProblemSection content={couders.problem} light />
        <LogoTicker content={couders.logoTicker} light />
        <MetricsSection content={couders.metrics} />
        <CtaSection
          content={couders.cta}
          email={dict.sections.contact.email}
          locale={locale}
          light
        />
      </main>
      <Footer dict={dict} locale={locale} />
    </div>
  );
}
