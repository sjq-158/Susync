import StaticHtmlPage from "@/components/StaticHtmlPage";
import DateFilterScript from "./DateFilterScript";

export default function Page() {
  return (
    <>
      <StaticHtmlPage slug="sales_activity" noRoot />
      <DateFilterScript />
    </>
  );
}
