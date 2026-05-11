"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ROUTES = [
  { label: "All Transactions", href: "/buyer/transactions" },
  { label: "In Progress", href: "/buyer/transactions?tab=in_progress" },
  { label: "Completed", href: "/buyer/transactions?tab=completed" },
  { label: "Cancelled", href: "/buyer/transactions?tab=cancelled" },
];

export default function TransactionTabsEnhancer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname !== "/buyer/transactions") return undefined;
    const root = document.querySelector(".susync-root");
    if (!root) return undefined;
    const buttons = root.querySelectorAll(".filter-btn");
    if (!buttons.length) return undefined;

    const tab = searchParams.get("tab");
    const activeLabel =
      tab === "in_progress"
        ? "In Progress"
        : tab === "completed"
          ? "Completed"
          : tab === "cancelled"
            ? "Cancelled"
            : tab === "all"
              ? "All Transactions"
              : "All Transactions";

    buttons.forEach((btn) => {
      const t = btn.textContent?.trim() ?? "";
      if (t === activeLabel || (activeLabel === "All Transactions" && t === "All Transactions" && !tab)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const handlers = [];
    buttons.forEach((btn) => {
      const label = btn.textContent?.trim() ?? "";
      const route = ROUTES.find((r) => r.label === label);
      if (!route) return;
      const h = (e) => {
        e.preventDefault();
        router.push(route.href);
      };
      btn.addEventListener("click", h);
      handlers.push([btn, h]);
    });

    return () => {
      handlers.forEach(([btn, h]) => btn.removeEventListener("click", h));
    };
  }, [pathname, router, searchParams]);

  return null;
}
