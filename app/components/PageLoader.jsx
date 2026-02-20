"use client";

import { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

/**
 * PageLoader Component
 * Displays a loading screen on initial page load
 * Features:
 * - GDG logo animation
 * - Calligraphy text animation
 * - Auto-hides after configurable timeout (default: 2 seconds)
 *
 * Environment Variables:
 * - NEXT_PUBLIC_PAGE_LOADER_TIMEOUT: Custom timeout in milliseconds
 *   Example: NEXT_PUBLIC_PAGE_LOADER_TIMEOUT=3000 for 3 seconds
 */

// Get timeout from environment variable with sensible default (2 seconds)
const PAGE_LOADER_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_PAGE_LOADER_TIMEOUT || "2000",
  10
);

// Validate timeout range (minimum 500ms, maximum 10 seconds)
const VALID_TIMEOUT = Math.min(Math.max(PAGE_LOADER_TIMEOUT, 500), 10000);

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loader after configured timeout (default: 2 seconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, VALID_TIMEOUT);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loaderContent}>
        <div className={styles.logoBox}>
          <img
            src="https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_1080,q_100,w_1080/v1/gcs/platform-data-goog/chapter_banners/GDG%20Cloud%20Boston_%20Logo%20Square%20(1).png"
            alt="GDG Logo"
            className={styles.mainLogo}
          />
          <div className={styles.logoBorder} />
        </div>
        <div className={styles.textHolder}>
          <h1 className={styles.calligraphyLoader}>GDG SKNCOE</h1>
        </div>
      </div>
    </div>
  );
}
