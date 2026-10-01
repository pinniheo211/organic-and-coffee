import { about, contact, ethos, hours, mapsHref, marquee, nav, stories } from "@/lib/site";
import { CafeShowcase } from "./cafe-showcase";
import { MarketShowcase } from "./market-showcase";
import { Marquee } from "./marquee";
import { PhotoSlot } from "./photo-slot";
import { Parallax, Reveal } from "./scroll-fx";
import styles from "./home-base.module.css";

export function HomeBase() {
  return (
    <>
      <section id="about" className={styles.about}>
        <div className={`${styles.shell} ${styles.split}`}>
          <Reveal select="[data-step]">
            <p data-step className={styles.kicker}>
              {about.kicker}
            </p>
            <h2 data-step className={styles.title}>
              {about.title}
            </h2>
            <p data-step className={styles.aboutLead}>
              {about.body}
            </p>
            <p data-step className={styles.aside}>
              {ethos.join(" · ")}
            </p>
          </Reveal>

          <Reveal className={styles.cutout} delay={0.1}>
            <Parallax className={styles.cutoutInner}>
              <PhotoSlot
                src={about.image}
                alt={about.alt}
                hint={about.imageFile}
                tone="well"
                fit="contain"
                sizes="(max-width: 1024px) 90vw, 620px"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      <div className={styles.band} aria-hidden="true">
        <div className={styles.marquee}>
          <Marquee items={marquee} className={styles.track} itemClassName={styles.word} duration={32} />
        </div>
      </div>

      {stories.map((story, index) => {
        if (story.id === "market") {
          return <MarketShowcase key={story.id} story={story} />;
        }

        if (story.id === "cafe") {
          return <CafeShowcase key={story.id} story={story} />;
        }

        const flipped = index % 2 === 1;
        const cutout = story.id === "shop";
        return (
          <section key={story.id} id={story.id} className={styles.story}>
            <div className={`${styles.shell} ${styles.split} ${flipped ? styles.flip : ""}`}>
              <Reveal className={cutout ? styles.cutout : styles.frame}>
                <Parallax className={cutout ? styles.cutoutInner : styles.photo}>
                  <PhotoSlot
                    src={story.image}
                    alt={story.alt}
                    hint={story.imageFile}
                    tone={cutout ? "well" : "frame"}
                    fit={cutout ? "contain" : "cover"}
                    sizes="(max-width: 1024px) 90vw, 720px"
                  />
                </Parallax>
              </Reveal>

              <Reveal select="[data-step]">
                <p data-step className={styles.kicker}>
                  {story.kicker}
                </p>
                <h2 data-step className={styles.title}>
                  {story.title}
                </h2>
                <p data-step className={styles.body}>
                  {story.copy}
                </p>
                <p data-step className={styles.aside}>
                  {story.tags.join(" · ")}
                </p>
                <a data-step className="btn btn-rust" href={story.href}>
                  {story.action}
                </a>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section id="find" className={styles.find}>
        <div className={styles.shell}>
          <Reveal select="[data-step]">
            <p data-step className={styles.kicker}>
              5 Druid Ave, Stirling
            </p>
            <h2 data-step className={styles.title}>
              Find us in the Adelaide Hills
            </h2>
          </Reveal>

          <div className={styles.findGrid}>
            <Reveal className={styles.frame}>
              <Parallax className={styles.photo}>
                <PhotoSlot
                  src={contact.mapImage}
                  alt="Inside the shop at 5 Druid Ave"
                  hint={contact.mapImageFile}
                  tone="frame"
                  sizes="(max-width: 1024px) 90vw, 520px"
                />
              </Parallax>
            </Reveal>

            <Reveal delay={0.08}>
              <p className={styles.kicker}>Opening hours</p>
              <p className={styles.address}>
                {contact.name}
                <br />
                {contact.address[0]}, {contact.address[1]}
                <br />
                <a className={styles.panelLink} href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                {" · "}
                <a className={styles.panelLink} href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </p>

              <ul className={styles.hours}>
                {hours.map((slot) => (
                  <li key={slot.id} className={styles.slot}>
                    <p className={styles.slotLabel}>{slot.label}</p>
                    {slot.rows.map(([what, when]) => (
                      <div key={what} className={styles.slotRow}>
                        <span>{what}</span>
                        <span>{when}</span>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>

              <div className={styles.panelActions}>
                <a className="btn btn-wheat" href="#shop">
                  Shop Online
                </a>
                <a className={styles.textCta} href={mapsHref} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.shell} ${styles.footerGrid}`}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.svg"
              alt={contact.name}
              width={536}
              height={59}
              className={styles.footerLogo}
            />
            <p className={styles.footerTag}>Stirling, gateway to the Adelaide Hills.</p>
          </div>

          <div>
            <p className={styles.footerHead}>On this page</p>
            <ul className={styles.footerList}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a className={styles.footerLink} href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.footerHead}>Visit</p>
            <ul className={styles.footerList}>
              <li>
                {contact.address[0]}, {contact.address[1]}
              </li>
              <li>
                <a className={styles.footerLink} href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a className={styles.footerLink} href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`${styles.shell} ${styles.footerBase}`}>
          <span>{contact.name}</span>
          <span>Organic, biodynamic and local where we can.</span>
        </div>
      </footer>
    </>
  );
}
