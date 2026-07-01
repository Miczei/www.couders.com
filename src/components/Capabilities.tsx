"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * 02 CAPABILITIES — horizontal pinned scroll.
 * The section pins to the viewport while the card track translates on X,
 * driven by vertical scroll. Classic Apple-style horizontal moment.
 */
export default function Capabilities({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const c = dict.sections.capabilities;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current;
      if (!el) return;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: pin.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="capabilities" className="cap">
      <div ref={pin} className="cap__pin">
        <div className="shell cap__head">
          <p className="section-eyebrow">
            <span className="idx">02</span>
            <span>{c.label}</span>
          </p>
          <h2 className="section-title cap__title">{c.title}</h2>
        </div>

        <div ref={track} className="cap__track">
          {c.cards.map((card, i) => (
            <article className="cap-card" key={i}>
              <span className="cap-card__no">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cap-card__title">{card.title}</h3>
              <p className="cap-card__body">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
