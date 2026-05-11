import { Suspense } from "react";
import AuthLoginClient from "@/components/AuthLoginClient";
import { loadImport } from "@/lib/loadImport";

export default function Page() {
  const { css } = loadImport("08_auth_login_SEE");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root">
        {/* CRITICAL: The boundary must surround the component 
            calling useSearchParams. 
        */}
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center">
            <p>Loading Secure Login...</p>
          </div>
        }>
          <AuthLoginClient />
        </Suspense>
      </div>
    </>
  );
}