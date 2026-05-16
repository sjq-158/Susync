import SellerShell from "@/components/SellerShell";

export default function SellerLayout({ children }) {
  return (
    <div className="susync-root">
      <SellerShell>{children}</SellerShell>
    </div>
  );
}
