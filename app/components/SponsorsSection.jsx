"use client";

import styles from "./SponsorsSection.module.css";

const sponsors = [
  {
    name: "Velocity Classes",
    logo: "/logo1.jpg",
    link: "https://velocity-pune.com",
  },
  {
    name: "Solithix",
    logo: "/logo2.jpg",
    link: "https://solithix.com",
  },
];

export default function SponsorsSection() {
  return (
    <section className={styles.communitySection} id="sponsors">
      <div className={styles.commHeader}>
        <h2>Meet Our Sponsors</h2>
        <p>
          Our mission at GDG SKNCOE is fueled by the generous support of our
          industry partners.
        </p>
      </div>

      <div className={styles.communityContainer}>
        {sponsors.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.communityCard}
            title={sponsor.name}>
            <div className={styles.commImageWrapper}>
              <img src={sponsor.logo} alt={sponsor.name} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
