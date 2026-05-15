import { loadImport } from "@/lib/loadImport";

export default function StaticHtmlPage({ slug, noRoot = false }) {
  const { css, html } = loadImport(slug);
  if (noRoot) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  }
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
