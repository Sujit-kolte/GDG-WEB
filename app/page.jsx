"use client";

import Navbar from "./components/Navbar";
import NewPageLoader from "./components/NewPageLoader";
import NewHero from "./components/NewHero";
import AboutSection from "./components/AboutSection";
import VisionMission from "./components/VisionMission";
import TechSlider from "./components/TechSlider";
import SponsorsSection from "./components/SponsorsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import UpcomingEvents from "./components/UpcomingEvents";
import NewNavbar from "./components/NewNavbar";


export default function Home() {
  return (
    <>
      <NewPageLoader />
      <NewNavbar />
      <main>
        <NewHero />
        <AboutSection />
        <VisionMission />
        <TechSlider />
        <UpcomingEvents />
        <SponsorsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

