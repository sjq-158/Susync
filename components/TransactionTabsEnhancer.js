"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ROUTES_BY_LABEL = {
  "All Deals": "/buyer/transactions?tab=all",
  "All Transactions": "/buyer/transactions?tab=all",
  "In Progress": "/buyer/transactions?tab=in_progress",
  Completed: "/buyer/transactions?tab=completed",
  Cancelled: "/buyer/transactions?tab=cancelled",
};

export default function TransactionTabsEnhancer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname !== "/buyer/transactions") return undefined;
    const root = document.querySelector(".susync-root, body");
    if (!root) return undefined;
    const buttons = document.querySelectorAll(".filter-btn");
    if (!buttons.length) return undefined;

    const tab = searchParams.get("tab");
    const activeLabels =
      tab === "in_progress"
        ? ["In Progress"]
        : tab === "completed"
          ? ["Completed"]
          : tab === "cancelled"
            ? ["Cancelled"]
            : ["All Deals", "All Transactions"];

    buttons.forEach((btn) => {
      const t = btn.textContent?.trim() ?? "";
      if (activeLabels.includes(t)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const handlers = [];
    buttons.forEach((btn) => {
      const label = btn.textContent?.trim() ?? "";
      const href = ROUTES_BY_LABEL[label];
      if (!href) return;
      const h = (e) => {
        e.preventDefault();
        router.push(href);
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
