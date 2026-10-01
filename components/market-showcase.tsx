"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { Story } from "@/lib/site";
import styles from "./home-base.module.css";
import { PhotoSlot } from "./photo-slot";

export function MarketShowcase({ story }: { story: Story }) {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    const photo = photoRef.current;
    const zoom = zoomRef.current;
    const copy = copyRef.current;
    if (!section || !photo || !zoom || !copy) return;

    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        zoom,
        { scale: 1.22 },
        {
          scale: 1,
          duration: 1.45,
          ease: "power3.out",
          immediateRender: true,
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        },
      );
      gsap.from(copy, {
        y: 56,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.18,
        ease: "power3.out",
        immediateRender: true,
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });
      gsap.fromTo(
        photo,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id={story.id} ref={rootRef} className={styles.market}>
      <div className={styles.marketStage}>
        <div className={styles.marketFrame}>
          <div ref={photoRef} className={styles.marketPhoto}>
            <div ref={zoomRef} className={styles.marketZoom}>
              <PhotoSlot
                src={story.image}
                alt={story.alt}
                hint={story.imageFile}
                tone="frame"
                fit="cover"
                sizes="100vw"
              />
            </div>
          </div>
        </div>

        <div ref={copyRef} className={styles.marketCopy}>
          <p className={styles.kicker}>{story.kicker}</p>
          <h2 className={styles.title}>{story.title}</h2>
          <p className={styles.body}>{story.copy}</p>
          <p className={styles.aside}>{story.tags.join(" · ")}</p>
          <a className="btn btn-wheat" href={story.href}>
            {story.action}
          </a>
        </div>
      </div>
    </section>
  );
}
