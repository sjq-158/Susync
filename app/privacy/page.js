import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Ensure this path is correct
import StaticHtmlPage from "@/components/StaticHtmlPage";

export default function Page() {
  return (
    <>
      <Navbar />
      <StaticHtmlPage slug="06_privacy_policy" />
      <Footer />
    </>
  );
}