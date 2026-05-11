import { Suspense } from "react";
import AuthLoginClient from "@/components/AuthLoginClient";
import { loadImport } from "@/lib/loadImport";

export default function Page() {
  const { css } = loadImport("08_auth_login_SEE");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root">
        {/* By using null or a fragment as a fallback, we ensure 
            no extra HTML elements mess up your 'susync-root' layout 
            while the component is loading.
        */}
        <Suspense fallback={null}>
          <AuthLoginClient />
        </Suspense>
      </div>
    </>
  );
}