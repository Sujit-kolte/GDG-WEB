"use client";

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/logo.png" alt="GDG Logo" />
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/events">Events</Link>
        <Link href="/members">Members</Link>
        <Link href="/snippets">Code Snippets</Link>
      </nav>

      <div className={styles.navSocials}>
        <ThemeSwitcher />
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer">
          <i className="fab fa-instagram" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer">
          <i className="fab fa-linkedin" />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github" />
        </a>
      </div>
    </header>
  );
}

