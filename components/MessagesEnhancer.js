"use client";

import { useEffect } from "react";

export default function MessagesEnhancer() {
  useEffect(() => {
    const input = document.getElementById("msg-attach-input");
    const chipRow = document.getElementById("msg-attach-chip-row");
    const thread = document.querySelector(".messages-thread");
    if (!input || !chipRow) return undefined;

    const files = [];

    function fmtSize(b) {
      if (b < 1024) return `${b} B`;
      if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
      return `${(b / 1024 / 1024).toFixed(1)} MB`;
    }

    function render() {
      chipRow.innerHTML = "";
      if (files.length === 0) {
        chipRow.style.display = "none";
        return;
      }
      chipRow.style.display = "flex";
      files.forEach((f, idx) => {
        const chip = document.createElement("div");
        chip.style.cssText =
          "display:inline-flex; align-items:center; gap:6px; background:#EBF2FF; color:#1A56DB; border:1px solid #BFD2F5; border-radius:999px; padding:6px 10px; font-size:12px; font-weight:600;";
        const isImg = f.type.startsWith("image/");
        chip.innerHTML = `<span class="material-icons" style="font-size:14px;">${isImg ? "image" : "description"}</span><span>${f.name}</span><span style="color:#6B7280; font-weight:500;">${fmtSize(f.size)}</span>`;
        const x = document.createElement("button");
        x.type = "button";
        x.setAttribute("aria-label", "Remove attachment");
        x.style.cssText =
          "border:none; background:transparent; color:#1A56DB; cursor:pointer; padding:0; display:inline-flex; align-items:center;";
        x.innerHTML = `<span class="material-icons" style="font-size:14px;">close</span>`;
        x.addEventListener("click", () => {
          files.splice(idx, 1);
          render();
        });
        chip.appendChild(x);
        chipRow.appendChild(chip);
      });
    }

    function onChange(e) {
      const list = Array.from(e.target.files || []);
      list.forEach((f) => files.push(f));
      input.value = "";
      render();
    }

    function sendAttachments() {
      if (files.length === 0) return;
      if (!thread) {
        files.length = 0;
        render();
        return;
      }
      const wrap = document.createElement("div");
      wrap.className = "msg-bubble msg-me";
      wrap.style.padding = "10px";
      const imgs = files.filter((f) => f.type.startsWith("image/"));
      const docs = files.filter((f) => !f.type.startsWith("image/"));
      imgs.forEach((f) => {
        const url = URL.createObjectURL(f);
        const img = document.createElement("img");
        img.src = url;
        img.alt = f.name;
        img.style.cssText = "max-width:240px; max-height:180px; border-radius:10px; display:block; margin-bottom:6px;";
        wrap.appendChild(img);
      });
      docs.forEach((f) => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; align-items:center; gap:8px; padding:6px 0;";
        row.innerHTML = `<span class="material-icons" style="font-size:18px;">description</span><span style="font-size:13px;">${f.name}</span><span style="font-size:11px; opacity:0.8;">${fmtSize(f.size)}</span>`;
        wrap.appendChild(row);
      });
      const t = document.createElement("span");
      t.className = "msg-time";
      t.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      wrap.appendChild(t);
      thread.appendChild(wrap);
      thread.scrollTop = thread.scrollHeight;
      files.length = 0;
      render();
    }

    input.addEventListener("change", onChange);

    const sendBtn = document.querySelector(".send-btn");
    const msgInput = document.querySelector(".msg-input");
    function onSend(e) {
      if (files.length > 0) {
        e?.preventDefault?.();
        sendAttachments();
      } else if (msgInput && msgInput.value.trim() && thread) {
        const wrap = document.createElement("div");
        wrap.className = "msg-bubble msg-me";
        wrap.textContent = msgInput.value;
        const t = document.createElement("span");
        t.className = "msg-time";
        t.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        wrap.appendChild(t);
        thread.appendChild(wrap);
        thread.scrollTop = thread.scrollHeight;
        msgInput.value = "";
      }
    }
    sendBtn?.addEventListener("click", onSend);
    function onKey(e) {
      if (e.key === "Enter") onSend(e);
    }
    msgInput?.addEventListener("keydown", onKey);

    return () => {
      input.removeEventListener("change", onChange);
      sendBtn?.removeEventListener("click", onSend);
      msgInput?.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
