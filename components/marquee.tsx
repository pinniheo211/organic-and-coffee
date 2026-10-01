"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

type MarqueeProps = {
  items: string[];
  /** Seconds for one full pass. Lower is faster. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
};

export function Marquee({ items, duration = 26, reverse = false, className, itemClassName }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The track holds two identical runs, so sliding it half its width lands on
    // the copy and the jump back to 0 is invisible.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
      );
    }, ref);

    return () => ctx.revert();
  }, [duration, reverse]);

  return (
    <div className={className}>
      <div ref={ref} style={{ display: "flex", width: "max-content" }}>
        {[0, 1].map((run) => (
          <ul key={run} aria-hidden={run === 1} style={{ display: "flex", margin: 0, padding: 0, listStyle: "none" }}>
            {items.map((item) => (
              <li key={item} className={itemClassName}>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
