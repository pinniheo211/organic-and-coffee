"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Display faces swap in after hydration, which moves every trigger point, so the
 * first element to mount schedules one refresh for the whole page.
 */
let refreshQueued = false;

function setup() {
  gsap.registerPlugin(ScrollTrigger);
  if (refreshQueued || typeof document === "undefined" || !document.fonts) return;
  refreshQueued = true;
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

function isStill() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate these descendants one after another instead of the wrapper itself. */
  select?: string;
  stagger?: number;
  y?: number;
  delay?: number;
};

export function Reveal({ children, className, select, stagger = 0.09, y = 28, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setup();
    if (isStill()) return;

    const ctx = gsap.context(() => {
      const targets = select ? Array.from(el.querySelectorAll(select)) : el;
      if (Array.isArray(targets) && targets.length === 0) return;
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 0.7,
        delay,
        ease: "power3.out",
        stagger: select ? stagger : 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, select, stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Drifts its contents against the page while the parent scrolls past. The parent
 * has to clip, and this layer has to be taller than it, or the drift shows a gap.
 */
export function Parallax({
  children,
  className,
  distance = 14,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setup();
    if (isStill()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -distance / 2 },
        {
          yPercent: distance / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
