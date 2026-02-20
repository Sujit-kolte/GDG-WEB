"use client";

import { useEffect, useState } from "react";
import styles from "./UpcomingEvents.module.css";

/**
 * EventsSection Component
 * Fetches and displays upcoming events from the API
 * Features:
 * - Horizontal scrolling event cards
 * - Dynamic event data from backend
 * - Responsive image gallery within each card
 * - Registration links
 */
// Sample event data for fallback/demo
const SAMPLE_EVENTS = [
  {
    _id: "1",
    title: "Android Development Workshop",
    category: "Workshop",
    day: "15",
    month: "Feb",
    year: "2026",
    time: "10:00 AM",
    location: "SKNCOE Campus",
    regLink: "#",
    images: ["/android.jpg"],
  },
  {
    _id: "2",
    title: "Cloud Computing Seminar",
    category: "Seminar",
    day: "20",
    month: "Feb",
    year: "2026",
    time: "2:00 PM",
    location: "Auditorium",
    regLink: "#",
    images: ["/cloud.jpg"],
  },
  {
    _id: "3",
    title: "AI & ML Bootcamp",
    category: "Bootcamp",
    day: "25",
    month: "Feb",
    year: "2026",
    time: "9:00 AM",
    location: "Lab 301",
    regLink: "#",
    images: ["/aiml.png"],
  },
  {
    _id: "4",
    title: "Cybersecurity Challenge",
    category: "Competition",
    day: "28",
    month: "Feb",
    year: "2026",
    time: "11:00 AM",
    location: "Online",
    regLink: "#",
    images: ["/cyber.avif"],
  },
];

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events`);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Map MongoDB fields to the format expected by the component
          const formattedEvents = data.data.map(event => {
            const dateObj = new Date(event.date);
            return {
              _id: event._id,
              title: event.title,
              category: 'Event',
              day: dateObj.getDate().toString(),
              month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
              year: dateObj.getFullYear().toString(),
              time: event.time,
              location: event.location,
              regLink: event.registrationLink || '#',
              images: Array.isArray(event.images) ? event.images : (event.image ? [event.image] : [])
            };
          });
          setEvents(formattedEvents);
        } else {
          setEvents([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading events:", err);
        // Use sample data as fallback
        setEvents(SAMPLE_EVENTS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <section className={styles.currentEvents} id="events">
      <div className={styles.currentEventsHeader}>
        <h1 className={styles.currentEventsTitle}>Upcoming Events</h1>
        <p className={styles.currentEventsSubtitle}>
          Join our new upcoming events
        </p>
      </div>

      <div className={styles.currentTimeline}>
        {loading && (
          <div className={styles.loadingMessage}>
            <p>Loading events...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {!loading && events.length === 0 && !error && (
          <div className={styles.noEventsMessage}>
            <p>No events available at the moment.</p>
          </div>
        )}

        {!loading &&
          events.length > 0 &&
          events.map((event, index) => (
            <div
              key={event._id || index}
              className={styles.eventDisplayCard}
              style={{
                borderTopColor: ["#4285F4", "#EA4335", "#34A853", "#FBBC04"][
                  index % 4
                ],
              }}>
              {/* Image Gallery */}
              <div className={styles.imageGallery}>
                {event.images && event.images.length > 0 ? (
                  event.images.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={`${event.title} - Image ${imgIndex + 1}`}
                      className={styles.galleryImg}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x200?text=Error+Loading+Image";
                      }}
                    />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/300x200?text=No+Images"
                    alt="No images available"
                    className={styles.galleryImg}
                  />
                )}
              </div>

              {/* Event Details */}
              <h1>{event.title}</h1>
              <h2 className={styles.eventCategory}>{event.category}</h2>

              <p className={styles.eventDate}>
                📅{" "}
                <b>
                  {event.day} {event.month} {event.year}
                </b>{" "}
                | 🕒 {event.time}
              </p>
              <p className={styles.eventLocation}>📍 {event.location}</p>

              {/* Register Button */}
              <a
                href={event.regLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnRegister}>
                Register for Event
              </a>
            </div>
          ))}
      </div>
    </section>
  );
}
