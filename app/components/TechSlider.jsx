"use client";

import { useEffect, useRef } from "react";
import styles from "./TechSlider.module.css";

const techCards = [
  {
    title: "Android",
    image: "/android.jpg",
    description:
      "Creating smart, scalable mobile apps that deliver seamless experiences on Android devices.",
  },
  {
    title: "Cloud",
    image: "/cloud.jpg",
    description:
      "Enabling secure, scalable, and on-demand computing resources over the internet.",
  },
  {
    title: "AI/ML",
    image: "/aiml.png",
    description:
      "Empowering machines to learn, predict, and make intelligent decisions from data.",
  },
  {
    title: "Cyber Security",
    image: "/cyber.avif",
    description:
      "Protecting systems, networks, and data from digital threats and cyber attacks.",
  },
  {
    title: "Web",
    image: "/web.jpg",
    description:
      "Building responsive, user-friendly websites and web applications that power the digital world.",
  },
];

export default function TechSlider() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Auto-scroll the slider for infinite loop effect
    let scrollAmount = 0;
    const scrollSpeed = 0.5;

    const autoScroll = () => {
      scrollAmount += scrollSpeed;
      slider.scrollLeft = scrollAmount;

      // Reset scroll position for infinite loop
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const scrollInterval = setInterval(autoScroll, 20);

    // Pause on hover
    slider.addEventListener("mouseenter", () => clearInterval(scrollInterval));
    slider.addEventListener("mouseleave", () => {
      const newInterval = setInterval(autoScroll, 20);
      const newIntervalId = setInterval(autoScroll, 20);
    });

    return () => clearInterval(scrollInterval);
  }, []);

  // Duplicate cards for infinite scroll effect
  const allCards = [...techCards, ...techCards];

  return (
    <section className={styles.techSlider}>
      <h1 className={styles.techHeader}>Tech where we work</h1>

      <div className={styles.sliderTrack} ref={sliderRef}>
        {allCards.map((card, index) => (
          <div key={`${card.title}-${index}`} className={styles.techCard}>
            <div className={styles.techCardImg}>
              <img src={card.image} alt={card.title} />
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
