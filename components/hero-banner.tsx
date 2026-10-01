"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { dishes } from "@/lib/site";
import { PhotoSlot } from "./photo-slot";
import styles from "./hero-banner.module.css";

const REST = 3.4;
const MOVE = 0.72;
const SLOTS = 3;
const TILT = 9;
const MOBILE = 980;

function mod(value: number, count: number) {
  return ((value % count) + count) % count;
}

function slotSpin(slot: number) {
  const s = mod(slot, SLOTS);
  const i = Math.floor(s);
  const t = s - i;
  const samples = [0, TILT, -TILT, 0];
  return samples[i] + (samples[i + 1] - samples[i]) * t;
}

type Pose = { x: number; y: number; spin: number; scale: number; z: number };

/**
 * Three fixed stops on one ellipse whose centre sits off to the right, so the
 * front stop lands on the left of the orbit (big, in view) and the other two
 * land past the right edge, where the hero crops them in half.
 */
function desktopPose(slot: number, rx: number, ry: number): Pose {
  const angle = Math.PI + (slot * 2 * Math.PI) / SLOTS;
  const depth = (1 - Math.cos(angle)) / 2;
  return {
    x: rx + Math.cos(angle) * rx,
    y: Math.sin(angle) * ry,
    spin: slotSpin(slot),
    scale: 0.46 + 0.54 * depth,
    z: Math.round(10 + depth * 30),
  };
}

/**
 * Ring along the bottom edge, bowing downward. The active plate is the large
 * front stop; the other two drop so half of each sits below the fold.
 * `y` is measured from the bottom edge, upward negative.
 */
function mobilePose(slot: number, width: number, plate: number): Pose {
  const angle = (slot * 2 * Math.PI) / SLOTS;
  const depth = (1 + Math.cos(angle)) / 2;
  const rx = width * 0.44;
  const ry = plate * 0.32;
  return {
    x: Math.sin(angle) * rx,
    y: -plate * 0.5 + (1 - Math.cos(angle)) * ry,
    spin: slotSpin(slot),
    scale: 0.5 + 0.5 * depth,
    z: Math.round(10 + depth * 30),
  };
}

export function HeroBanner() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const dishRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ring = useRef({ pos: 0 });
  const frontRef = useRef(0);
  const textSnap = useRef({ active: 0, front: 0 });
  const reduced = useRef(false);
  const paused = useRef(false);
  const timer = useRef<number | null>(null);
  const tween = useRef<gsap.core.Timeline | null>(null);

  const [active, setActive] = useState(0);
  const [front, setFront] = useState(0);
  const [slots, setSlots] = useState<[number, number]>([0, 0]);

  function paint() {
    const stage = stageRef.current;
    if (!stage) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const mobile = window.matchMedia(`(max-width: ${MOBILE}px)`).matches;
    const rx = width * 0.283;
    const ry = height * 0.4;
    // Keep the front plate's top edge below the headline and buttons.
    const plateCap = mobile ? Math.max(0, height - 32) : 0;

    for (let index = 0; index < SLOTS; index += 1) {
      const el = dishRefs.current[index];
      if (!el) continue;
      el.style.maxWidth = plateCap > 0 ? `${plateCap}px` : "";
    }

    for (let index = 0; index < SLOTS; index += 1) {
      const el = dishRefs.current[index];
      if (!el) continue;
      const slot = mod(index - ring.current.pos, SLOTS);
      const pose = mobile ? mobilePose(slot, width, el.offsetWidth) : desktopPose(slot, rx, ry);
      el.style.transform = `translate(-50%, -50%) translate(${pose.x}px, ${pose.y}px) rotate(${pose.spin.toFixed(2)}deg) scale(${pose.scale})`;
      el.style.opacity = "1";
      el.style.zIndex = String(pose.z);
    }
  }

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function schedule() {
    clearTimer();
    if (reduced.current || paused.current) return;
    timer.current = window.setTimeout(() => {
      const current = mod(Math.round(ring.current.pos), SLOTS);
      go(mod(current + 1, SLOTS), 1);
    }, REST * 1000);
  }

  function go(target: number, direction?: 1 | -1) {
    const from = ring.current.pos;
    const rounded = Math.round(from);
    const current = mod(rounded, SLOTS);
    const nextSlot = mod(target, SLOTS);
    if (nextSlot === current && Math.abs(from - rounded) < 0.02) return;

    let steps: number;
    if (direction === 1) steps = mod(nextSlot - current, SLOTS) || SLOTS;
    else if (direction === -1) steps = -(mod(current - nextSlot, SLOTS) || SLOTS);
    else {
      const forward = mod(nextSlot - current, SLOTS);
      const backward = mod(current - nextSlot, SLOTS);
      if (forward === 0) return;
      steps = backward < forward ? -backward : forward;
    }

    clearTimer();
    tween.current?.kill();
    gsap.killTweensOf(ring.current);

    const landing = mod(rounded + steps, SLOTS);
    const into = 1 - frontRef.current;
    setSlots((prev) => {
      const next = [...prev] as [number, number];
      next[into] = landing;
      return next;
    });
    frontRef.current = into;
    setFront(into);
    setActive(landing);

    const duration = (reduced.current ? 0.01 : MOVE) * Math.abs(steps);
    tween.current = gsap.timeline({ onComplete: schedule });
    tween.current.to(ring.current, {
      pos: rounded + steps,
      duration,
      ease: "power2.inOut",
      onUpdate: paint,
    });
  }

  useEffect(() => {
    if (textSnap.current.active === active && textSnap.current.front === front) return;
    textSnap.current = { active, front };
    const into = front;
    const out = 1 - front;
    const nodes = [lineRefs.current[0], lineRefs.current[1]].filter(Boolean);
    gsap.killTweensOf(nodes);
    const duration = reduced.current ? 0.01 : 0.36;
    const lead = reduced.current ? 0 : 0.18;
    gsap.set(lineRefs.current[into], { yPercent: 22, opacity: 0 });
    gsap.to(lineRefs.current[out], {
      yPercent: -18,
      opacity: 0,
      duration,
      delay: lead,
      ease: "power2.in",
    });
    gsap.to(lineRefs.current[into], {
      yPercent: 0,
      opacity: 1,
      duration: duration + 0.05,
      delay: lead + 0.1,
      ease: "power3.out",
    });
  }, [active, front]);

  useEffect(() => {
    const orbit = ring.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      reduced.current = media.matches;
    };
    applyMotion();
    media.addEventListener("change", applyMotion);

    const ctx = gsap.context(() => {
      paint();
      if (!reduced.current && copyRef.current) {
        gsap.from(copyRef.current, {
          y: 18,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
        });
      }
      schedule();
    }, rootRef);

    const onResize = () => {
      if (tween.current?.isActive()) return;
      paint();
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimer();
      tween.current?.kill();
      gsap.killTweensOf(orbit);
      media.removeEventListener("change", applyMotion);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // Mount-only: paint and the autoplay timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = () => {
    paused.current = true;
    clearTimer();
  };

  const release = () => {
    paused.current = false;
    if (!tween.current?.isActive()) schedule();
  };

  return (
    <section className={styles.hero} ref={rootRef} aria-roledescription="carousel" aria-label="Market, café and online shop">
      <div
        className={styles.copy}
        ref={copyRef}
        onMouseEnter={hold}
        onMouseLeave={release}
        onFocusCapture={hold}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) release();
        }}
      >
        <p className={styles.place}>Stirling, Adelaide Hills</p>
        <div className={styles.stack}>
          {slots.map((dishIndex, layer) => {
            const dish = dishes[dishIndex];
            const showing = layer === front;
            return (
              <div
                key={layer}
                ref={(el) => {
                  lineRefs.current[layer] = el;
                }}
                className={styles.layer}
                aria-hidden={showing ? undefined : true}
              >
                {showing ? (
                  <h1 className={styles.headline}>
                    {dish.lines[0]}
                    <br />
                    <span>{dish.lines[1]}</span>
                  </h1>
                ) : (
                  <p className={styles.headline}>
                    {dish.lines[0]}
                    <br />
                    <span>{dish.lines[1]}</span>
                  </p>
                )}
                <p className={styles.body}>{dish.body}</p>
              </div>
            );
          })}
        </div>
        <div className={`${styles.actions}`}>
          <a className="btn btn-rust" href="#market">
            Head to the Shop
          </a>
          <a className="btn btn-wheat" href="#cafe">
            About the Café
          </a>
        </div>
        {/* <ul className={styles.cards}>
          {dishes.map((dish, index) => {
            const on = index === active;
            return (
              <li key={dish.id}>
                <button
                  type="button"
                  className={on ? `${styles.card} ${styles.cardOn}` : styles.card}
                  aria-current={on ? "true" : undefined}
                  onClick={() => go(index)}
                >
                  <span className={styles.thumb}>
                    <PhotoSlot
                      src={dish.image}
                      alt=""
                      hint={dish.imageFile}
                      tone={dish.cutout ? "well" : "dashed"}
                      fit={dish.cutout ? "contain" : "cover"}
                      sizes="84px"
                    />
                  </span>
                  <span className={styles.cardName}>{dish.card}</span>
                </button>
              </li>
            );
          })}
        </ul> */}
      </div>

      <div className={styles.stage} ref={stageRef}>
        <span className={styles.disc} aria-hidden="true" />

        {dishes.map((dish, index) => (
          <button
            key={dish.id}
            type="button"
            className={dish.cutout ? `${styles.dish} ${styles.dishCutout}` : styles.dish}
            ref={(el) => {
              dishRefs.current[index] = el;
            }}
            aria-label={`Show ${dish.card}`}
            tabIndex={-1}
            onClick={() => go(index)}
          >
            <span className={dish.cutout ? `${styles.plate} ${styles.plateCutout}` : styles.plate}>
              <span className={styles.well}>
                <PhotoSlot
                  src={dish.image}
                  alt={dish.card}
                  hint={dish.imageFile}
                  tone="well"
                  fit={dish.cutout ? "contain" : "cover"}
                  sizes="(max-width: 1080px) 100vw, 840px"
                />
              </span>
            </span>
          </button>
        ))}

      </div>
    </section>
  );
}
