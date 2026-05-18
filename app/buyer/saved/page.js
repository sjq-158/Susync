import { loadImport } from "@/lib/loadImport";
import SavedPropertiesClient from "./SavedPropertiesClient";

export default function Page() {
  const { css } = loadImport("saved_properties_BUYER");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <SavedPropertiesClient />
    </>
  );
}
