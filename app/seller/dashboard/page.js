import DashboardLayout from "@/components/DashboardLayout";
import StaticHtmlPage from "@/components/StaticHtmlPage";

export default function Page() {
  return (
    <DashboardLayout role="seller">
      <StaticHtmlPage slug="10_dashboard_SELLER" />
    </DashboardLayout>
  );
}