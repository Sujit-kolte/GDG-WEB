"use client";

import { useEffect } from "react";
import styles from "./VisionMission.module.css";

const visionMissionData = [
  {
    id: "vision",
    icon: "fa-eye",
    title: "Vision",
    description:
      "To build a vibrant tech-driven community that inspires innovation, learning, and collaboration among future developers. We aim to empower students to create impactful solutions using Google technologies and beyond.",
    iconBg: "var(--vision-icon-bg)",
    iconColor: "var(--vision-icon-color)",
  },
  {
    id: "mission",
    icon: "fa-bullseye",
    title: "Mission",
    description:
      "To provide hands-on learning, knowledge sharing, and real-world exposure through workshops, events, and peer collaboration. We strive to bridge the gap between academics and industry by nurturing practical skills and a growth mindset.",
    iconBg: "var(--mission-icon-bg)",
    iconColor: "var(--mission-icon-color)",
  },
  {
    id: "values",
    icon: "fa-gem",
    title: "Values",
    description:
      "We believe in inclusivity, curiosity, collaboration, and continuous learning. Our community grows through sharing knowledge, ethical innovation, and supporting each other's success.",
    iconBg: "var(--values-icon-bg)",
    iconColor: "var(--values-icon-color)",
  },
];

export default function VisionMission() {
  useEffect(() => {
    // Reveal animation for cards
    const revealElements = document.querySelectorAll(
      `.${styles.revealLeft}, .${styles.revealRight}`,
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.active);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <section className={styles.visionMission} id="vision-mission">
      <div className={styles.vmHeader}>
        <h2>Our Core Purpose</h2>
        <p>
          Driving innovation and fostering a community of lifelong learners.
        </p>
      </div>

      <div className={styles.vmWrapper}>
        {visionMissionData.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.vmCard} ${styles[item.id]} ${
              index % 2 === 0 ? styles.revealLeft : styles.revealRight
            }`}>
            <div className={styles.vmIcon}>
              <i className={`fas ${item.icon}`} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
