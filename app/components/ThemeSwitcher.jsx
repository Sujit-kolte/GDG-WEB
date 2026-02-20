"use client";

import { useState, useEffect } from "react";
import styles from "./ThemeSwitcher.module.css";

/**
 * ThemeSwitcher Component
 * Manages theme switching (light/dark mode) with localStorage persistence
 * and system preference detection.
 *
 * Features:
 * - Toggles between light and dark themes
 * - Persists preference in localStorage
 * - Respects system preference on first load
 * - Smooth transitions
 */
export default function ThemeSwitcher({ onThemeChange }) {
  const [currentTheme, setCurrentTheme] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const STORAGE_KEY =
    process.env.NEXT_PUBLIC_THEME_STORAGE_KEY || "gdg-theme-preference";
  const DARK_THEME = "dark";
  const LIGHT_THEME = "light";

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    // Get system preference
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? DARK_THEME
      : LIGHT_THEME;

    // Use saved theme or fall back to system theme
    const initialTheme = savedTheme || systemTheme;

    applyTheme(initialTheme);
    setCurrentTheme(initialTheme);
    setIsHydrated(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        setCurrentTheme(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, []);

  const applyTheme = (theme, animate = true) => {
    const html = document.documentElement;

    if (!animate) {
      html.classList.add("no-transition");
    }

    if (theme === DARK_THEME) {
      html.setAttribute("data-theme", DARK_THEME);
    } else {
      html.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn("localStorage not available:", e);
    }

    if (!animate) {
      void html.offsetHeight; // Force reflow
      html.classList.remove("no-transition");
    }

    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  if (!isHydrated) {
    return <button className={styles.themeToggle} disabled />;
  }

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      title={`Switch to ${currentTheme === DARK_THEME ? "light" : "dark"} mode`}
      aria-label="Toggle dark/light theme">
      <i
        className={currentTheme === DARK_THEME ? "fas fa-sun" : "fas fa-moon"}
      />
    </button>
  );
}
