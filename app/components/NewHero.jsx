"use client";

import { useEffect, useState } from "react";
import styles from "./NewHero.module.css";

export default function Hero() {
  const [imageIndex, setImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const heroImages = ["/hero.png", "/hero2.png"];

  // Change hero image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % heroImages.length);
        setIsAnimating(false);
      }, 1000);
    }, 5000);

    
    return () => clearInterval(interval);
  }, []);

  // Add hero animation on load
  useEffect(() => {
    const hero = document.querySelector(`.${styles.hero}`);
    if (hero) {
      setTimeout(() => hero.classList.add(styles.heroAnimate), 300);
    }
  }, []);

  const handleJoinCommunity = () => {
    // Option 1: Open email client
    window.location.href =
      "mailto:contact@gdgskncoe.com?subject=Join GDG SKNCOE Community";

    // Option 2: You can also use a modal or link to a registration form
    // For now, email is the simplest solution
  };

  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.googleText}>
    {"Google Developers Group".split("").map((char, i) => (
      <span key={i}>{char === " " ? "\u00A0" : char}</span>
    ))}
  </span>
          <br />
          On Campus
          <br />
          SKNCOE Pune
        </h1>
        <p className={styles.heroSubtitle}>Learn · Connect · Grow</p>
        <button className={styles.heroBtn} onClick={handleJoinCommunity}>
          Join Community
        </button>
      </div>

      {/* Uncomment if hero image is needed */}
      {/* <div className={styles.heroImage}>
        <img
          id="heroImg"
          src={heroImages[imageIndex]}
          alt="GDG Hero"
          className={isAnimating ? styles.fadeOut : styles.fadeIn}
        />
      </div> */}
    </section>
  );
}
