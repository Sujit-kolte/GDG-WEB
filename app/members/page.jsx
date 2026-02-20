import Navbar from "../components/Navbar";
import MembersSection from "../components/MembersSection";
import Footer from "../components/Footer";

export default function MembersPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh" }}>
        <MembersSection />
      </main>
      <Footer />
    </>
  );
}

