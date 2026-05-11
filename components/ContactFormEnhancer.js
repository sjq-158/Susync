"use client";

import { useEffect } from "react";

/**
 * Attaches submit handler to the contact page form (matches static markup).
 */
export default function ContactFormEnhancer() {
  useEffect(() => {
    const root = document.querySelector(".susync-root");
    if (!root) return undefined;
    const form = root.querySelector(".form-card form");
    if (!form) return undefined;

    async function onSubmit(e) {
      e.preventDefault();
      const get = (labelText) => {
        const groups = form.querySelectorAll(".form-group");
        for (const g of groups) {
          const lab = g.querySelector("label");
          if (lab && lab.textContent.trim() === labelText) {
            const field = g.querySelector("input, select, textarea");
            return field?.value ?? "";
          }
        }
        return "";
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: get("First Name"),
          lastName: get("Last Name"),
          email: get("Email Address"),
          inquiryType: get("Inquiry Type"),
          message: get("Your Message"),
        }),
      });
      const data = await res.json();
      if (data.demoReadonly) {
        alert("Demo deployment: message not saved to SQLite. See README.");
      } else {
        alert("Message sent. Thank you!");
      }
      form.reset();
    }

    form.addEventListener("submit", onSubmit);
    return () => {
      form.removeEventListener("submit", onSubmit);
    };
  }, []);
  return null;
}
