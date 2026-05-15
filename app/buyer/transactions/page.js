import StaticHtmlPage from "@/components/StaticHtmlPage";
import TransactionTabsEnhancer from "@/components/TransactionTabsEnhancer";
import { Suspense } from "react";

function Content({ slug }) {
  return (
    <>
      <StaticHtmlPage slug={slug} noRoot />
      <Suspense fallback={null}>
        <TransactionTabsEnhancer />
      </Suspense>
    </>
  );
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const tab = sp?.tab;
  let slug = "transactions_tracker";
  if (tab === "all") slug = "transactions_list_BUYER_ALLDEALS";
  else if (tab === "in_progress") slug = "transactions_list_BUYER_INPROGRESS";
  else if (tab === "completed") slug = "transactions_list_BUYER_COMPLETED";
  else if (tab === "cancelled") slug = "transactions_list_BUYER_CANCELLED";
  return <Content slug={slug} />;
}
