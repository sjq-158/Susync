import AuthRegisterClient from "@/components/AuthRegisterClient";
import { loadImport } from "@/lib/loadImport";
import { Suspense } from "react";

function Inner() {
  const { css } = loadImport("09_auth_register_BUYER_SEE");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root">
        <AuthRegisterClient />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
