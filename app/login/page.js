import { Suspense } from "react";
import AuthLoginClient from "@/components/AuthLoginClient";
import { loadImport } from "@/lib/loadImport";

export default function Page() {
  const { css } = loadImport("08_auth_login_SEE");
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root">
        {/* Wrap AuthLoginClient in Suspense. 
          This prevents the "useSearchParams() should be wrapped in a suspense boundary" error
          during the Vercel production build.
        */}
        <Suspense fallback={<div className="loading-state">Loading login...</div>}>
          <AuthLoginClient />
        </Suspense>
      </div>
    </>
  );
}