"use client";

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./NewNavbar.module.css";
import { usePathname } from "next/navigation"; // 1. Import the hook

export default function Navbar() {
  const pathname = usePathname(); // 2. Declare the variable here
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/logo.png" alt="GDG Logo" />
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <Link href="/" className={pathname === "/" ? styles.active : ""}>
          Home
        </Link>
        <Link
          href="/events"
          className={pathname === "/events" ? styles.active : ""}>
          Events
        </Link>
        <Link
          href="/members"
          className={pathname === "/members" ? styles.active : ""}>
          Members
        </Link>
        <Link
          href="/snippets"
          className={pathname === "/snippets" ? styles.active : ""}>
          Code Snippets
        </Link>
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
