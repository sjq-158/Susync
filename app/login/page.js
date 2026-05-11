import AuthLoginClient from "@/components/AuthLoginClient";
import { loadImport } from "@/lib/loadImport";

export default function Page() {
  const { css } = loadImport("08_auth_login_SEE");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="susync-root">
        <AuthLoginClient />
      </div>
    </>
  );
}
