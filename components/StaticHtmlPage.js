import { loadImport } from "@/lib/loadImport";

export default function StaticHtmlPage({ slug }) {
  const { css, html } = loadImport(slug);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
