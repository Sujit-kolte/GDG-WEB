"use client";

import React, { useState } from 'react';
import styles from "./EventsSection.module.css";

const EventsDetail = [
  {
    year: 2025,
    events: [
      {
        Date: "October 26, 2025",
        Key: "Workshop / Study Group",
        Point: "Google Cloud Study Jams: Hands-on Workshop",
        photos: ["assets/images/cyber1.jpeg", "assets/images/cyber2.jpeg", "assets/images/cyber3.jpeg", "assets/images/cyber4.jpeg"]
      },
      {
        Date: "October 3, 2025",
        Key: "Speaker Session / Tech Talk",
        Point: "Cyber Threat Intelligence Workshop",
        photos: ["assets/images/img1.jpg", "assets/images/img2.jpg", "assets/images/img1.jpg", "assets/images/img2.jpg"]
      },
      {
        Date: "September 19, 2025",
        Key: "Info Session",
        Point: "GDGoC Member Orientation 2025"
      },
      {
        Date: "September 19, 2025",
        Key: "Workshop / Study Group",
        Point: "Profile to Perfection: Enhance Your LinkedIn Presence"
      },
      {
        Date: "March 25, 2025",
        Key: "Workshop / Study Group",
        Point: "FlutterFlow Masterclass: Build Flutter Apps Without Code"
      },
      {
        Date: "Jan 27, 2025",
        Key: "Hackathon",
        Point: "Solution Series"
      }
    ]
  },
  {
    year: 2024,
    events: [
      {
        Date: "Dec 25, 2024",
        Key: "Info Session",
        Point: "Tech Winter Break Introduction to Solutions Challenge – GDG On Campus SKNCOE",
        photos: ["assets/images/img1.jpg", "assets/images/img2.jpg", "assets/images/img1.jpg", "assets/images/img2.jpg"]
      },
      {
        Date: "Dec 6, 2024",
        Key: "Workshop / Study Group",
        Point: "Tech Winter Break – GDG On Campus SKNCOE"
      },
      {
        Date: "Nov 14, 2024",
        Key: "Conference",
        Point: "GDG Orientation: Welcome to the Community!"
      },
      {
        Date: "Oct 4, 2024",
        Key: "Info Session",
        Point: "Gen-AI in Action: Tools, Techniques, and Trends"
      }
    ]
  }
];

const TimelineItem = ({ yearObj }) => {
  // Set to true by default so events are visible initially
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles['year-wrapper']}>
      <div className={styles.year}>
        <h4>{yearObj.year}</h4>
        <button 
          className={styles['toggle-btn']} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "^" : "˅"}
        </button>
      </div>

      {/* This mimics the 'hidden' toggle from your original JS */}
      <div className={`${styles['event-container']} ${!isOpen ? styles.hidden : ''}`}>
        {yearObj.events.map((event, index) => (
          <div className={styles['event-section']} key={index}>
            <div className={styles['event-info']}>
              <h3>{event.Key}</h3>
              <h4>{event.Date}</h4>
              <p>{event.Point}</p>
            </div>

            {event.photos && event.photos.length > 0 && (
              <div className={styles['event-photo']}>
                {event.photos.map((img, imgIdx) => (
                  <img key={imgIdx} src={img} alt="event photo" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PastEvents = () => {
  return (
    <section className={styles.pastEvents}>
      <div className={styles['pastEvent-header']}>
        <h1 className={styles['pastEvent-title']}>Past Events</h1>
        <p className={styles['pastEvent-subtitle']}>hfkksjj</p>
      </div>
      <div id="timeline">
        {EventsDetail.map((yearData) => (
          <TimelineItem key={yearData.year} yearObj={yearData} />
        ))}
      </div>
    </section>
  );
};

export default PastEvents;