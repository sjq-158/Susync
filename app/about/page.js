import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StaticHtmlPage from "@/components/StaticHtmlPage";

export default function Page() {
  return (
    <>
      <Navbar />
      <StaticHtmlPage slug="02_about_us" />
      <Footer />
    </>
  );
}