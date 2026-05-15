import BuyerShell from "@/components/BuyerShell";

export default function BuyerLayout({ children }) {
  return (
    <div className="susync-root">
      <BuyerShell>{children}</BuyerShell>
    </div>
  );
}
