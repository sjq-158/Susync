"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CARD_IDS = ["prop-1", "prop-2"];

export default function PropertyBrowseEnhancer() {
  const router = useRouter();

  useEffect(() => {
    const root = document.querySelector(".susync-root");
    if (!root) return undefined;

    const cards = root.querySelectorAll(".property-card");
    const cleanups = [];
    cards.forEach((card, i) => {
      card.style.cursor = "pointer";
      const id = CARD_IDS[i];
      if (!id) return;
      const go = () => router.push(`/buyer/properties/${id}`);
      card.addEventListener("click", go);
      cleanups.push(() => card.removeEventListener("click", go));
      const det = card.querySelector(".btn-details");
      if (det) {
        const h = (e) => {
          e.stopPropagation();
          go();
        };
        det.addEventListener("click", h);
        cleanups.push(() => det.removeEventListener("click", h));
      }
    });

    const searchInput = root.querySelector(".search-container input");
    const searchBtn = root.querySelector(".btn-search");
    const reset = root.querySelector(".reset-link");

    function applyFilter() {
      const q = (searchInput?.value ?? "").toLowerCase().trim();
      const types = [];
      root.querySelectorAll(".checkbox-item input:checked").forEach((el) => {
        const label = el.closest("label")?.textContent?.trim() ?? "";
        types.push(label.toLowerCase());
      });
      cards.forEach((card) => {
        const title = card.querySelector(".card-title")?.textContent?.toLowerCase() ?? "";
        const loc = card.querySelector(".card-loc")?.textContent?.toLowerCase() ?? "";
        const hay = `${title} ${loc}`;
        const matchQ = !q || hay.includes(q);
        let matchT = types.length === 0;
        if (!matchT) {
          matchT = types.some((t) => {
            if (t.includes("house")) return title.includes("house");
            if (t.includes("condo")) return title.includes("condo");
            if (t.includes("commercial")) return title.includes("commercial") || title.includes("office");
            if (t.includes("land")) return title.includes("lot") || title.includes("land");
            return false;
          });
        }
        card.style.display = matchQ && matchT ? "" : "none";
      });
    }

    const onSearch = (e) => {
      e.preventDefault();
      applyFilter();
    };
    const onReset = (e) => {
      e.preventDefault();
      root.querySelectorAll(".checkbox-item input").forEach((el) => {
        el.checked = false;
      });
      if (searchInput) searchInput.value = "";
      applyFilter();
    };

    searchBtn?.addEventListener("click", onSearch);
    reset?.addEventListener("click", onReset);
    cleanups.push(() => searchBtn?.removeEventListener("click", onSearch));
    cleanups.push(() => reset?.removeEventListener("click", onReset));

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [router]);

  return null;
}
