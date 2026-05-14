// app/buyer/transactions/[id]/page.js
import StaticHtmlPage from "@/components/StaticHtmlPage";

export default async function Page({ params }) {
  // We accept the [id] param so the route matches /buyer/transactions/<anything>,
  // but for now we render the same hardcoded tracker regardless of ID.
  // Wire this to real data later.
  await params; // satisfies Next.js 15's async params requirement

  return <StaticHtmlPage slug="transactions_tracker" />;
}