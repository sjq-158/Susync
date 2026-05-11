import { Suspense } from "react";
import AuthLoginClient from "@/components/AuthLoginClient";
import { loadImport } from "@/lib/loadImport";

export default function Page() {
  const { css } = loadImport("08_auth_login_SEE");
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root">
        {/* This Suspense component is the key to fixing the build error */}
        <Suspense fallback={<div>Loading...</div>}>
          <AuthLoginClient />
        </Suspense>
      </div>
    </>
  );
}