"use client";

import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand Section */}
        <div className={styles.footerSection + " " + styles.footerBrand}>
          <div className={styles.footerLogo}>
            <span>
              <img src="/logo.png" alt="GDG Logo" />
            </span>
            <span>
              <h1>On Campus</h1>
              <h2>---Smt. Kashibai Navale College of Engineering</h2>
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className={styles.footerSection + " " + styles.footerInfo}>
          <p>&copy; {currentYear} All Rights Reserved</p>
          <a href="mailto:contact@gdgskncoe.com" className={styles.footerMail}>
            contact@gdgskncoe.com
          </a>
        </div>

        {/* Socials Section */}
        <div className={styles.navSocials}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram">
            <i className="fab fa-instagram" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn">
            <i className="fab fa-linkedin" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub">
            <i className="fab fa-github" />
          </a>
        </div>
      </div>

      
    </footer>
  );
}
