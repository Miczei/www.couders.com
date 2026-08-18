"use client";

import { useEffect, useState } from "react";
import CoudersHero from "@/components/couders/CoudersHero";
import ImpactTelemetry from "@/components/couders/ImpactTelemetry";
import { getCouders } from "@/i18n/couders";

export default function LabClient() {
  const [debugProgress, setDebugProgress] = useState<number | undefined>();
  const [ready, setReady] = useState(false);
  // Premium motion layer A/B: shader backdrop + SplitText H1 vs. the current
  // AmbientGlow + block fade. Defaults on here so the lab shows the new work;
  // production still renders the old hero until this is signed off.
  const [experimental, setExperimental] = useState(true);
  const [light, setLight] = useState(false);
  const couders = getCouders("en");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p");
    if (p !== null && !Number.isNaN(Number(p))) {
      setDebugProgress(Math.min(1, Math.max(0, Number(p))));
    }
    setReady(true);
  }, []);

  if (!ready) return <div className="relative z-10 min-h-screen bg-black" />;

  return (
    <div className={`relative z-10 ${light ? "bg-white" : "bg-black"}`}>
      <div className="fixed right-4 top-4 z-50 flex gap-2 rounded-full border border-white/15 bg-black/70 p-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur">
        <button
          type="button"
          onClick={() => setExperimental((v) => !v)}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            experimental ? "bg-[#22E0C8] text-black" : "hover:bg-white/10"
          }`}
        >
          {experimental ? "shader + split" : "obecna wersja"}
        </button>
        <button
          type="button"
          onClick={() => setLight((v) => !v)}
          className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
        >
          {light ? "light" : "dark"}
        </button>
      </div>

      <CoudersHero
        // Remount on toggle so SplitText re-splits from clean markup instead
        // of layering a second split over the previous one's spans.
        key={`${experimental}-${light}`}
        content={couders.hero}
        locale="en"
        debugProgress={debugProgress}
        experimental={experimental}
        light={light}
      />
      <ImpactTelemetry content={couders.telemetry} />
    </div>
  );
}
