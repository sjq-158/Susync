import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StaticHtmlPage from "@/components/StaticHtmlPage";

export default function Page() {
  return (
    <>
      <Navbar />
      <StaticHtmlPage slug="04_contact_us" />
      <Footer />
    </>
  );
}