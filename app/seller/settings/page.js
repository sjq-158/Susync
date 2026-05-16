import StaticHtmlPage from "@/components/StaticHtmlPage";
import SettingsEnhancer from "@/components/SettingsEnhancer";

export default function Page() {
  return (
    <>
      <StaticHtmlPage slug="settings_SELLER" noRoot />
      <SettingsEnhancer />
    </>
  );
}
