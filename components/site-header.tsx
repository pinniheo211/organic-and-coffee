"use client";

import { useEffect, useRef, useState } from "react";
import { contact, nav } from "@/lib/site";
import styles from "./site-header.module.css";

const DESKTOP = "(min-width: 1180px)";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP);
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (open) {
      document.body.style.overflow = "hidden";
      if (main instanceof HTMLElement) main.inert = true;
      drawerRef.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    } else {
      document.body.style.overflow = "";
      if (main instanceof HTMLElement) main.inert = false;
      if (wasOpen.current && !window.matchMedia(DESKTOP).matches) {
        burgerRef.current?.focus();
      }
    }
    wasOpen.current = open;
    return () => {
      document.body.style.overflow = "";
      if (main instanceof HTMLElement) main.inert = false;
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.bar} inert={open}>
        <a href="#top" className={styles.brand} aria-label="The Organic Market and Café, home">
          {/* SVG wordmark — kept as an image so the strokes are not rasterized. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.svg"
            alt="The Organic Market and Café"
            width={536}
            height={59}
            className={styles.logo}
          />
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.burgerLines} />
        </button>

        <a href="#shop" className={`btn ${styles.cta}`}>
          Shop Online
        </a>
      </div>

      <button
        type="button"
        className={`${styles.scrim} ${open ? styles.scrimOpen : ""}`}
        aria-label="Close menu"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      <div
        id="site-menu"
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        inert={!open}
      >
        <div className={styles.drawerTop}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.svg"
            alt=""
            width={900}
            height={59}
            className={styles.drawerLogo}
          />
          <button type="button" className={styles.close} data-close aria-label="Close menu" onClick={() => setOpen(false)}>
            <span className={styles.closeLines} />
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#shop" className={`btn ${styles.drawerCta}`} onClick={() => setOpen(false)}>
          Shop Online
        </a>

        <p className={styles.drawerFoot}>
          {contact.address[0]}, {contact.address[1]}
          <a href={contact.phoneHref}>{contact.phone}</a>
        </p>
      </div>
    </header>
  );
}
