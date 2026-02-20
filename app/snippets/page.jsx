"use client";

import Navbar from "../components/Navbar";
import SnippetsSection from "../components/SnippetsSection";
import Footer from "../components/Footer";

export default function SnippetsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh" }}>
        <SnippetsSection />
      </main>
      <Footer />
    </>
  );
}

