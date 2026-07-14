"use client";

import { useEffect } from "react";

/**
 * Global floating chat widget wired to a Make.com webhook. Ported from a
 * vanilla HTML/CSS/JS embed snippet into a client component: the DOM-building
 * and event-wiring logic below is intentionally close to that original
 * script (still imperative, still builds markup via innerHTML) rather than
 * rewritten as idiomatic React state, so behavior stays identical to the
 * version that was authored and handed off. Styling lives in globals.css
 * (#aiw-* rules) rather than a runtime <style> tag, matching how this repo
 * keeps hand-written CSS.
 */
const CHAT_CONFIG = {
  webhookUrl: "https://hook.eu1.make.com/0krgthjdn9jelek8s8edykmzqis7nttj",
  botName: "Asystent AI",
  botSubtitle: "Zwykle odpowiadamy w kilka sekund",
  welcomeMessage: "Dzień dobry! 👋 Jestem asystentem firmy. W czym mogę pomóc?",
  placeholder: "Napisz wiadomość…",
  errorMessage: "Przepraszamy, wystąpił problem z połączeniem. Spróbuj ponownie za chwilę.",
  timeoutMs: 90000, // 90 s — asystent z analizą PDF bywa wolniejszy
};

export default function ChatWidget() {
  useEffect(() => {
    const root = document.getElementById("aiw-root");
    if (!root) return;

    let threadId: string | null = null;
    try {
      threadId = sessionStorage.getItem("aiw_thread_id");
    } catch {
      // private browsing mode: sessionStorage may throw
    }

    root.innerHTML =
      '<button id="aiw-launcher" aria-label="Otwórz czat" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
      "</svg>" +
      "</button>" +
      '<div id="aiw-panel" role="dialog" aria-label="Okno czatu" aria-modal="false">' +
      '<div class="aiw-header">' +
      '<span class="aiw-status-dot" aria-hidden="true"></span>' +
      '<div><div class="aiw-header-title"></div><div class="aiw-header-sub"></div></div>' +
      '<button class="aiw-close" aria-label="Zamknij czat">&times;</button>' +
      "</div>" +
      '<div class="aiw-messages" aria-live="polite"></div>' +
      '<div class="aiw-inputbar">' +
      '<textarea class="aiw-input" rows="1" maxlength="1000"></textarea>' +
      '<button class="aiw-send" aria-label="Wyślij wiadomość">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' +
      "</svg>" +
      "</button>" +
      "</div>" +
      '<div class="aiw-footer">Rozmowa z asystentem AI</div>' +
      "</div>";

    const launcher = document.getElementById("aiw-launcher") as HTMLButtonElement;
    const panel = document.getElementById("aiw-panel") as HTMLDivElement;
    const messages = panel.querySelector(".aiw-messages") as HTMLDivElement;
    const input = panel.querySelector(".aiw-input") as HTMLTextAreaElement;
    const sendBtn = panel.querySelector(".aiw-send") as HTMLButtonElement;
    const closeBtn = panel.querySelector(".aiw-close") as HTMLButtonElement;

    (panel.querySelector(".aiw-header-title") as HTMLElement).textContent = CHAT_CONFIG.botName;
    (panel.querySelector(".aiw-header-sub") as HTMLElement).textContent = CHAT_CONFIG.botSubtitle;
    input.setAttribute("placeholder", CHAT_CONFIG.placeholder);
    input.setAttribute("aria-label", CHAT_CONFIG.placeholder);

    let isOpen = false;
    let isWaiting = false;
    let welcomed = false;

    function addMessage(text: string, cls: string) {
      const el = document.createElement("div");
      el.className = "aiw-msg " + cls;
      el.textContent = text; // textContent = safe against XSS
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    function showTyping() {
      const el = document.createElement("div");
      el.className = "aiw-msg aiw-msg-bot aiw-typing";
      el.setAttribute("aria-label", "Asystent pisze");
      el.innerHTML = "<span></span><span></span><span></span>";
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    function setWaiting(state: boolean) {
      isWaiting = state;
      sendBtn.disabled = state;
      input.disabled = state;
      if (!state) input.focus();
    }

    function openPanel() {
      isOpen = true;
      panel.classList.add("aiw-open");
      requestAnimationFrame(() => panel.classList.add("aiw-visible"));
      launcher.setAttribute("aria-expanded", "true");
      if (!welcomed) {
        welcomed = true;
        addMessage(CHAT_CONFIG.welcomeMessage, "aiw-msg-bot");
      }
      setTimeout(() => input.focus(), 250);
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove("aiw-visible");
      launcher.setAttribute("aria-expanded", "false");
      setTimeout(() => panel.classList.remove("aiw-open"), 220);
    }

    function handleLauncherClick() {
      if (isOpen) closePanel();
      else openPanel();
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) closePanel();
    }

    function sendMessage() {
      const text = input.value.trim();
      if (!text || isWaiting) return;

      if (CHAT_CONFIG.webhookUrl.indexOf("http") !== 0) {
        addMessage(
          "Konfiguracja niekompletna: wklej URL webhooka z Make.com w CHAT_CONFIG.webhookUrl.",
          "aiw-msg-error"
        );
        return;
      }

      addMessage(text, "aiw-msg-user");
      input.value = "";
      input.style.height = "auto";
      setWaiting(true);
      const typingEl = showTyping();

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CHAT_CONFIG.timeoutMs);

      fetch(CHAT_CONFIG.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          thread_id: threadId || "",
          page_url: window.location.href,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then((data) => {
          clearTimeout(timer);
          typingEl.remove();
          const reply =
            data && typeof data.reply === "string" && data.reply.trim()
              ? data.reply.trim()
              : CHAT_CONFIG.errorMessage;
          addMessage(reply, "aiw-msg-bot");
          if (data && data.thread_id) {
            threadId = data.thread_id;
            try {
              sessionStorage.setItem("aiw_thread_id", threadId as string);
            } catch {
              // private browsing mode
            }
          }
        })
        .catch(() => {
          clearTimeout(timer);
          typingEl.remove();
          addMessage(CHAT_CONFIG.errorMessage, "aiw-msg-error");
        })
        .finally(() => {
          setWaiting(false);
        });
    }

    function handleInputKeydown(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }

    function handleInputResize() {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 96) + "px";
    }

    launcher.addEventListener("click", handleLauncherClick);
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", handleKeydown);
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", handleInputKeydown);
    input.addEventListener("input", handleInputResize);

    return () => {
      launcher.removeEventListener("click", handleLauncherClick);
      closeBtn.removeEventListener("click", closePanel);
      document.removeEventListener("keydown", handleKeydown);
      sendBtn.removeEventListener("click", sendMessage);
      input.removeEventListener("keydown", handleInputKeydown);
      input.removeEventListener("input", handleInputResize);
      root.innerHTML = "";
    };
  }, []);

  return <div id="aiw-root" />;
}
