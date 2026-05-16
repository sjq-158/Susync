"use client";

import { useEffect } from "react";

export default function DateFilterScript() {
  useEffect(() => {
    const trigger = document.getElementById("dateFilter");
    const menu = document.getElementById("dateMenu");
    const label = document.getElementById("dateFilterLabel");
    if (!trigger || !menu || !label) return;
    const options = menu.querySelectorAll(".date-option");

    function setOpen(open) {
      trigger.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function onTriggerClick(e) {
      e.stopPropagation();
      setOpen(!menu.classList.contains("open"));
    }
    function onTriggerKey(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(!menu.classList.contains("open"));
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onDocClick(e) {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) setOpen(false);
    }
    const optHandlers = [];
    options.forEach((opt) => {
      const h = (e) => {
        e.stopPropagation();
        options.forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        label.textContent = opt.dataset.value;
        setOpen(false);
      };
      opt.addEventListener("click", h);
      optHandlers.push([opt, h]);
    });

    trigger.addEventListener("click", onTriggerClick);
    trigger.addEventListener("keydown", onTriggerKey);
    document.addEventListener("click", onDocClick);

    return () => {
      trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKey);
      document.removeEventListener("click", onDocClick);
      optHandlers.forEach(([opt, h]) => opt.removeEventListener("click", h));
    };
  }, []);

  return null;
}
