"use client";

import Navbar from "../components/Navbar";
import EventsSection from "../components/NewEventsSection";
import Footer from "../components/Footer";

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh" }}>
        <EventsSection />
      </main>
      <Footer />
    </>
  );
}

