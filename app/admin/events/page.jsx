"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cloudinary upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [form, setForm] = useState({
    category: "",
    title: "",
    day: "",
    month: "",
    year: "",
    time: "",
    location: "",
    description: "",
    regLink: "",
  });

  // 1) FETCH ALL EVENTS
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2) CLOUDINARY UPLOAD
  const uploadToCloudinary = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
      );

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dje1r9qg1";
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();
      if (res.ok && data.secure_url) {
        setUploadedImages((prev) => [...prev, data.secure_url]);
      } else {
        alert(`Upload failed: ${data.error?.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error: Could not reach Cloudinary ❌");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 4) CREATE EVENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      alert("Please upload at least one image before publishing.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        day: Number(form.day),
        year: Number(form.year),
        images: uploadedImages,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to create event");
        return;
      }

      alert("Event Published ✅");
      setForm({
        category: "",
        title: "",
        day: "",
        month: "",
        year: "",
        time: "",
        location: "",
        description: "",
        regLink: "",
      });
      setUploadedImages([]);
      fetchEvents();
    } catch (err) {
      alert("Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

  // 5) DELETE EVENT
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Event deleted ✅");
        fetchEvents();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>GDG Event Management</h1>

      <div className={styles.card}>
        <h2 className={styles.subHeading}>Add New Event</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required>
              <option value="">Select Category</option>
              <option value="Workshop">Workshop</option>
              <option value="Tech Talk">Tech Talk</option>
              <option value="Hackathon">Hackathon</option>
            </select>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
            />

            <div className={styles.dateRow}>
              <input
                type="number"
                name="day"
                value={form.day}
                onChange={handleChange}
                placeholder="DD"
                min="1"
                max="31"
                required
              />
              <input
                type="text"
                name="month"
                value={form.month}
                onChange={handleChange}
                placeholder="Month"
                required
              />
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="YYYY"
                required
              />
            </div>

            <input
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="Time"
              required
            />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />
            <input
              type="url"
              name="regLink"
              value={form.regLink}
              onChange={handleChange}
              placeholder="Registration Link"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />

            <div className={styles.uploadSection}>
              <label className={styles.uploadLabel}>Event Images:</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadToCloudinary(file);
                }}
              />
              {uploading && <p className={styles.status}>Uploading...</p>}

              {uploadedImages.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                  {uploadedImages.map((url, index) => (
                    <div key={index} className={styles.imageWrapper}>
                      <img src={url} alt="preview" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeBtn}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.publishBtn}
            disabled={uploading || submitting}>
            {submitting ? "Publishing..." : "Publish Event"}
          </button>
        </form>
      </div>

      <h2 className={styles.subHeading}>Upcoming Events</h2>
      <div className={styles.eventsGrid}>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className={styles.eventCard}>
              {/* IMAGE FIXED HERE */}
              {event.images?.[0] && (
                <div className={styles.cardImageContainer}>
                  <img
                    src={event.images[0]}
                    alt="event"
                    className={styles.cardImg}
                  />
                </div>
              )}
              <h3>{event.title}</h3>
              <p className={styles.meta}>
                {event.category} • {event.day} {event.month} {event.year}
              </p>
              <p className={styles.meta}>
                {event.time} • {event.location}
              </p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleDelete(event._id)}
                  className={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
