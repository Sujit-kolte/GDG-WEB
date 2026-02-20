"use client";

import { useEffect, useState } from "react";
import styles from "./FAQSection.module.css";

const faqData = [
  {
    question: "Who can join GDG SKNCOE?",
    answer:
      "Any student from SKNCOE, regardless of their branch or year, is welcome to join.",
  },
  {
    question: "Where is the campus located?",
    answer: "Survey No. 44/1, Sinhgad Institute Rd, Vadgaon Budruk, Pune.",
  },
  {
    question: "Are the events free?",
    answer:
      "Yes! Most of our workshops and speaker sessions are completely free.",
  },
  {
    question: "How to reach?",
    answer:
      "You can reach via local PMPML buses or by 20-minute drive from Swargate.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.mapFaqSection} id="faq">
      <div className={styles.splitContainer}>
        {/* Map Side */}
        <div className={styles.mapSide}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "25px" }}>
            Where we are Located
          </h1>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.4419076016625!2d73.8336332752033!3d18.463624582619476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc29550e58f01eb%3A0x6960d1396152a129!2sSmt.%20Kashibai%20Navale%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            style={{
              width: "100%",
              height: "400px",
              border: "none",
              borderRadius: "1rem",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* FAQ Side */}
        <div className={styles.faqSide}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqWrapper}>
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${
                  activeIndex === index ? styles.active : ""
                }`}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}>
                  {item.question}
                  <span className={styles.icon}>
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={styles.faqAnswer}
                  aria-hidden={activeIndex !== index}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
