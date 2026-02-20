"use client";

import { useEffect } from "react";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  useEffect(() => {
    // Intersection Observer for scroll animation
    const elements = document.querySelectorAll(`.${styles.animateOnScroll}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          } else {
            entry.target.classList.remove(styles.animate);
          }
        });
      },
      { threshold: 0.3 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.aboutUs} ${styles.values}`} id="about">
      <div className={styles.sectionContainer}>
        <div className={styles.aboutContainer}>
          <div className={`${styles.textSection} ${styles.animateOnScroll}`}>
            <h2 className={styles.sectionTitle}>Who We Are</h2>
            <p>
              GDG SKNCOE is a student-led tech community focused on learning,
              innovation, and collaboration. We bring together developers and
              tech enthusiasts to explore Google technologies, enhance practical
              skills, and build solutions that create real-world impact.
            </p>
          </div>

          <div className={`${styles.imageSection} ${styles.animateOnScroll}`}>
            <img src="/grp.jpg" alt="GDG Community" />
          </div>
        </div>
      </div>
    </section>
  );
}
