"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { contact, hours, type Story } from "@/lib/site";
import styles from "./cafe-showcase.module.css";
import { PhotoSlot } from "./photo-slot";

const cafeHours = hours.map((slot) => ({
  id: slot.id,
  label: slot.label,
  when: slot.rows.find(([what]) => what === "Café")?.[1] ?? "",
  note: slot.rows.find(([what]) => what === "Kitchen")?.[1],
}));

export function CafeShowcase({ story }: { story: Story }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: section, start: "top 78%", once: true } as const;

      gsap.fromTo(
        "[data-zoom]",
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          immediateRender: true,
          scrollTrigger: trigger,
        },
      );

      gsap.from("[data-panel]", {
        y: 24,
        autoAlpha: 0,
        duration: 0.85,
        delay: 0.12,
        ease: "power2.out",
        immediateRender: true,
        scrollTrigger: trigger,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id={story.id} ref={rootRef} className={styles.split}>
      <figure className={styles.photo}>
        <div data-zoom className={styles.zoom}>
          <PhotoSlot
            src={story.image}
            alt={story.alt}
            hint={story.imageFile}
            tone="frame"
            sizes="(max-width: 800px) 100vw, 58vw"
          />
        </div>
      </figure>

      <div data-panel className={styles.panel}>
        {/* <Image
          className={styles.bloom}
          src="/assets/background-bottom.png"
          alt=""
          width={1254}
          height={1254}
          aria-hidden
        /> */}
        <h2 className={styles.title}>{story.title}</h2>

        <p className={styles.lead}>
          Our seasonal menu includes daily specials and plenty of options to satisfy specific dietary preferences.
        </p>
        <p className={styles.lead}>
          Nestled in a region of outstanding artisan food production, the Organic Market and Café (OM for short) is a
          true mecca for organic and Adelaide Hills produce. You will find us in the heart of Stirling, gateway to the
          Adelaide Hills.
        </p>

        <div className="flex gap-20 items-start">
          
          <div className={styles.block}>
            <p className={styles.label}>Opening hours</p>
            <ul className={styles.hours}>
              {cafeHours.map((slot) => (
                <li key={slot.id}>
                  <p className={styles.day}>{slot.label}</p>
                  <p className={styles.time}>
                    {slot.when}
                    {slot.note ? <span>Kitchen {slot.note}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Stirling</p>
            <p className={styles.place}>
              {contact.address[0]}
              <br />
              {contact.address[1]}
            </p>
          </div>
        </div>

        <a className={`btn btn-wheat ${styles.visit}`} href={story.href}>
          View Menu
        </a>
      </div>
    </section>
  );
}
