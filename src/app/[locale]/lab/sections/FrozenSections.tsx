"use client";

import { useEffect, useState } from "react";
import AgentTrace from "@/components/premium/AgentTrace";
import NightShift from "@/components/premium/NightShift";

/** Clamp a raw query value to 0..1, or undefined when it is not a number. */
function freeze(v: string | null) {
  if (v === null || v === "" || Number.isNaN(Number(v))) return undefined;
  return Math.min(1, Math.max(0, Number(v)));
}

/**
 * The two self-playing sections, with their debug freeze params read on the
 * client.
 *
 * `?trace=0..1` / `?night=0..1` used to be read through the page's
 * `searchParams`, which reads the request on the server. The production build
 * is a static export (the Pages workflow injects `output: "export"`), and a
 * static export has no request to read, so that turned the whole deploy red.
 * Reading them from `window.location.search` in an effect is what /lab already
 * does for its own `?p=`, and it keeps the tool working.
 *
 * With no params present, which is every real visit, the state never changes
 * and this renders exactly once.
 */
export default function FrozenSections() {
  const [trace, setTrace] = useState<number | undefined>();
  const [night, setNight] = useState<number | undefined>();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setTrace(freeze(q.get("trace")));
    setNight(freeze(q.get("night")));
  }, []);

  return (
    <>
      <AgentTrace debugProgress={trace} />
      <NightShift debugProgress={night} />
    </>
  );
}
