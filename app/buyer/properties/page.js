import PropertyBrowseEnhancer from "@/components/PropertyBrowseEnhancer";
import StaticHtmlPage from "@/components/StaticHtmlPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <StaticHtmlPage slug="view_properties_BUYER" />
      <Suspense fallback={null}>
        <PropertyBrowseEnhancer />
      </Suspense>
    </>
  );
}
