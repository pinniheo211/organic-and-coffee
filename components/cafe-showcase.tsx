"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { hours, type Story } from "@/lib/site";
import styles from "./cafe-showcase.module.css";
import { PhotoSlot } from "./photo-slot";

const drinks = [
  {
    src: "/assets/cf1.jpg",
    file: "public/assets/cf1.jpg",
    name: "Latte",
    alt: "Latte with a heart poured into the foam",
  },
  {
    src: "/assets/cf2.jpg",
    file: "public/assets/cf2.jpg",
    name: "Long black",
    alt: "A long black in a white cup",
  },
  {
    src: "/assets/cf3.jpg",
    file: "public/assets/cf3.jpg",
    name: "Mocha",
    alt: "A mocha dusted with cocoa",
  },
  {
    src: "/assets/cf4.jpg",
    file: "public/assets/cf4.jpg",
    name: "Espresso",
    alt: "Espresso in a glass with cream on the side",
  },
] as const;

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

      gsap.from("[data-copy]", {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        immediateRender: true,
        scrollTrigger: trigger,
      });

      gsap.fromTo(
        "[data-hero-zoom]",
        { scale: 1.18 },
        {
          scale: 1,
          duration: 1.45,
          ease: "power3.out",
          immediateRender: true,
          scrollTrigger: trigger,
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile, i) => {
        gsap.from(tile, {
          y: 48,
          autoAlpha: 0,
          duration: 0.95,
          delay: 0.12 + i * 0.1,
          ease: "power3.out",
          immediateRender: true,
          scrollTrigger: trigger,
        });
        const zoom = tile.querySelector("[data-zoom]");
        if (zoom) {
          gsap.fromTo(
            zoom,
            { scale: 1.14 },
            {
              scale: 1,
              duration: 1.3,
              delay: 0.12 + i * 0.1,
              ease: "power3.out",
              immediateRender: true,
              scrollTrigger: trigger,
            },
          );
        }
      });

      gsap.from("[data-board]", {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        immediateRender: true,
        scrollTrigger: trigger,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const [hero, ...counter] = drinks;

  return (
    <section id={story.id} ref={rootRef} className={styles.cafe}>
      <div className={styles.intro}>
        <div data-copy className={styles.copy}>
          <p className={styles.kicker}>{story.kicker}</p>
          <h2 className={styles.title}>{story.title}</h2>
          <p className={styles.body}>{story.copy}</p>
          <p className={styles.body}>
            The counter pours coffee through the day, and the kitchen keeps the vegetarian menu going until close.
          </p>
          <a className="btn btn-wheat" href={story.href}>
            {story.action}
          </a>
        </div>

        <figure className={styles.hero}>
          <div className={styles.heroShot}>
            <div data-hero-zoom className={styles.zoom}>
              <PhotoSlot src={hero.src} alt={hero.alt} hint={hero.file} tone="frame" sizes="(max-width: 800px) 86vw, 34vw" />
            </div>
          </div>
          <figcaption className={styles.heroName}>{hero.name}</figcaption>
        </figure>
      </div>

      <div className={styles.counter}>
        {counter.map((drink) => (
          <figure key={drink.src} data-tile className={styles.tile}>
            <div className={styles.tileShot}>
              <div data-zoom className={styles.zoom}>
                <PhotoSlot src={drink.src} alt={drink.alt} hint={drink.file} tone="frame" sizes="(max-width: 800px) 100vw, 30vw" />
              </div>
            </div>
            <figcaption className={styles.tileName}>{drink.name}</figcaption>
          </figure>
        ))}
      </div>

      <div data-board className={styles.board}>
        <div>
          <p className={styles.boardLabel}>From the kitchen</p>
          <ul className={styles.menu}>
            {story.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <ul className={styles.hours}>
          {cafeHours.map((slot) => (
            <li key={slot.id}>
              <p className={styles.hourLabel}>{slot.label}</p>
              <p className={styles.hourWhen}>{slot.when}</p>
              {slot.note ? <p className={styles.hourNote}>Kitchen {slot.note}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
