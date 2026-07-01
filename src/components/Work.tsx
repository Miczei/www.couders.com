"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * 05 WORK — project grid with a batched reveal (cards fade/rise in as each
 * enters the viewport). Placeholder thumbnails use a large faint index number
 * until real project imagery is added.
 */
export default function Work({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const w = dict.sections.work;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".work-card", { y: 40, autoAlpha: 0 });
      ScrollTrigger.batch(".work-card", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="work">
      <div className="shell">
        <p className="section-eyebrow">
          <span className="idx">05</span>
          <span>{w.label}</span>
        </p>
        <h2 className="section-title">{w.title}</h2>

        <div className="work__grid">
          {w.projects.map((pr, i) => (
            <article className="work-card" key={i}>
              <div className="work-card__thumb" aria-hidden="true">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="work-card__meta">
                <h3 className="work-card__title">{pr.title}</h3>
                <span className="work-card__cat">{pr.category}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
