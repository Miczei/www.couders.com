import GlassNav from "@/components/premium/GlassNav";
import PremiumHero from "@/components/premium/PremiumHero";
import SystemThread from "@/components/premium/SystemThread";
import MetricsThread from "@/components/premium/MetricsThread";
import GlassCta from "@/components/premium/GlassCta";

/**
 * Private direction study. Light ground, one signature (the unbroken thread
 * from the wordmark), and the three effects from the research report in the
 * places they actually earn: refraction on the floating chrome, the thread in
 * the system diagram, counted numbers where the claims are.
 */
export default function Page() {
  return (
    <main className="premium-ground min-h-screen">
      <GlassNav />
      <PremiumHero />
      <SystemThread />
      <MetricsThread />
      <GlassCta />

      <footer className="border-t border-[color:var(--p-hair)] py-10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--p-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>Couders — studium kierunku</span>
          <span>Nieindeksowane. Liczby są przykładowe.</span>
        </div>
      </footer>
    </main>
  );
}
