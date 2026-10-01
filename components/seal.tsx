"use client";

import gsap from "gsap";
import { useEffect, useId, useRef } from "react";

/** A slowly turning stamp of words set around a circle. */
export function Seal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  // useId ships colons, which are legal in an id but awkward in a selector.
  const ring = `seal-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(el, { rotation: 360, duration: 34, ease: "none", repeat: -1 });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <svg ref={ref} className={className} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id={ring} fill="none" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text>
        <textPath href={`#${ring}`}>{text}</textPath>
      </text>
    </svg>
  );
}
