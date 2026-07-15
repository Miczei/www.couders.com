"use client";

/* ============================================================
   WIDGET CHATBOTA AI — wersja komponentu Next.js / React
   ------------------------------------------------------------
   GDZIE WKLEIĆ:
   1. Zapisz ten plik jako: src/components/ChatWidget.tsx
   2. W pliku src/app/layout.tsx zaimportuj go na górze:
        import ChatWidget from "@/components/ChatWidget";
      i wstaw <ChatWidget /> tuż przed zamykającym tagiem
      </body> (patrz przykład na dole tego pliku w komentarzu).

   KONFIGURACJA: edytuj TYLKO obiekt CHAT_CONFIG poniżej.
   ============================================================ */

import { useEffect, useRef, useState } from "react";

const CHAT_CONFIG = {
  webhookUrl: "TU_WKLEJ_URL_WEBHOOKA_Z_MAKE", // np. https://hook.eu2.make.com/xxxxxxxx
  botName: "Asystent AI",
  botSubtitle: "Zwykle odpowiadamy w kilka sekund",
  welcomeMessage: "Dzień dobry! 👋 Jestem asystentem firmy. W czym mogę pomóc?",
  placeholder: "Napisz wiadomość…",
  errorMessage:
    "Przepraszamy, wystąpił problem z połączeniem. Spróbuj ponownie za chwilę.",
  timeoutMs: 90000, // 90 s — asystent z analizą PDF bywa wolniejszy
};

type Message = {
  id: number;
  text: string;
  role: "bot" | "user" | "error";
};

let idCounter = 0;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const threadIdRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Wczytaj zapamiętany wątek rozmowy (przetrwa odświeżenie karty)
  useEffect(() => {
    try {
      threadIdRef.current = sessionStorage.getItem("aiw_thread_id") || "";
    } catch {
      /* tryb prywatny przeglądarki — pomijamy */
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function addMessage(text: string, role: Message["role"]) {
    idCounter += 1;
    setMessages((prev) => [...prev, { id: idCounter, text, role }]);
  }

  function openPanel() {
    setIsOpen(true);
    if (!welcomed) {
      setWelcomed(true);
      addMessage(CHAT_CONFIG.welcomeMessage, "bot");
    }
    setTimeout(() => inputRef.current?.focus(), 250);
  }

  function closePanel() {
    setIsOpen(false);
  }

  async function sendMessage() {
    const text = inputValue.trim();
    if (!text || isWaiting) return;

    if (!CHAT_CONFIG.webhookUrl.startsWith("http")) {
      addMessage(
        "Konfiguracja niekompletna: wklej URL webhooka z Make.com w CHAT_CONFIG.webhookUrl.",
        "error"
      );
      return;
    }

    addMessage(text, "user");
    setInputValue("");
    setIsWaiting(true);
    setIsTyping(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHAT_CONFIG.timeoutMs);

    try {
      const res = await fetch(CHAT_CONFIG.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          thread_id: threadIdRef.current,
          page_url: window.location.href,
        }),
      });

      console.log(
        "[Chatbot] Status HTTP:",
        res.status,
        "| Content-Type:",
        res.headers.get("content-type")
      );

      if (!res.ok) throw new Error("HTTP " + res.status);

      const raw = await res.text();
      console.log("[Chatbot] Surowa odpowiedź z Make:", raw);

      let reply = "";
      try {
        const data = JSON.parse(raw);
        if (data && typeof data.reply === "string" && data.reply.trim()) {
          reply = data.reply.trim();
        }
        if (data && data.thread_id) {
          threadIdRef.current = data.thread_id;
          try {
            sessionStorage.setItem("aiw_thread_id", data.thread_id);
          } catch {
            /* ignorujemy */
          }
        }
      } catch (parseError) {
        console.warn(
          "[Chatbot] Odpowiedź nie jest JSON-em, używam jej jako czystego tekstu.",
          parseError
        );
        reply = raw.trim();
      }

      clearTimeout(timer);
      setIsTyping(false);

      if (reply) {
        addMessage(reply, "bot");
      } else {
        console.error(
          "[Chatbot] Odpowiedź pusta lub bez pola 'reply'. Sprawdź moduł Webhook Response w Make."
        );
        addMessage(CHAT_CONFIG.errorMessage, "error");
      }
    } catch (error: any) {
      clearTimeout(timer);
      setIsTyping(false);
      console.error("[Chatbot] Błąd połączenia lub sieci:", error);
      if (error?.name === "AbortError") {
        console.error(
          "[Chatbot] Przekroczono limit czasu (" +
            CHAT_CONFIG.timeoutMs +
            " ms). Scenariusz w Make działa zbyt wolno lub nie zwraca Webhook Response."
        );
      } else if (error instanceof TypeError) {
        console.error(
          "[Chatbot] Prawdopodobny błąd CORS lub brak sieci. Sprawdź zakładkę Network w DevTools."
        );
      }
      addMessage(CHAT_CONFIG.errorMessage, "error");
    } finally {
      setIsWaiting(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === "Escape") closePanel();
  }

  return (
    <div id="aiw-root">
      <style>{`
        #aiw-root {
          --aiw-brand: #14532d;
          --aiw-brand-dark: #0d3b20;
          --aiw-accent: #d1fae5;
          --aiw-bg: #ffffff;
          --aiw-surface: #f4f6f5;
          --aiw-text: #1a1f1c;
          --aiw-muted: #6b7570;
          --aiw-radius: 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }
        #aiw-launcher {
          position: fixed; right: 22px; bottom: 22px; z-index: 999998;
          width: 60px; height: 60px; border-radius: 50%;
          background: var(--aiw-brand); color: #fff; border: none; cursor: pointer;
          box-shadow: 0 6px 24px rgba(0,0,0,.22);
          display: flex; align-items: center; justify-content: center;
          transition: transform .18s ease, background .18s ease;
        }
        #aiw-launcher:hover { transform: scale(1.06); background: var(--aiw-brand-dark); }
        #aiw-launcher svg { width: 28px; height: 28px; }
        #aiw-launcher:focus-visible { outline: 3px solid var(--aiw-accent); outline-offset: 3px; }
        #aiw-panel {
          position: fixed; right: 22px; bottom: 96px; z-index: 999999;
          width: 372px; max-width: calc(100vw - 32px);
          height: 540px; max-height: calc(100vh - 130px);
          background: var(--aiw-bg); border-radius: var(--aiw-radius);
          box-shadow: 0 12px 48px rgba(0,0,0,.25);
          display: none; flex-direction: column; overflow: hidden;
          opacity: 0; transform: translateY(14px);
          transition: opacity .22s ease, transform .22s ease;
        }
        #aiw-panel.aiw-open { display: flex; }
        #aiw-panel.aiw-visible { opacity: 1; transform: translateY(0); }
        .aiw-header {
          background: var(--aiw-brand); color: #fff;
          padding: 14px 16px; display: flex; align-items: center; gap: 10px;
        }
        .aiw-status-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,.28); flex: none;
        }
        .aiw-header-title { font-size: 15px; font-weight: 600; line-height: 1.2; }
        .aiw-header-sub { font-size: 12px; opacity: .78; }
        .aiw-close {
          margin-left: auto; background: transparent; border: none; color: #fff;
          font-size: 22px; line-height: 1; cursor: pointer; padding: 4px 8px; border-radius: 8px;
        }
        .aiw-close:hover { background: rgba(255,255,255,.15); }
        .aiw-messages {
          flex: 1; overflow-y: auto; padding: 16px 14px;
          display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
        }
        .aiw-msg {
          max-width: 82%; padding: 10px 13px; border-radius: 14px;
          font-size: 14px; line-height: 1.5; color: var(--aiw-text);
          white-space: pre-wrap; word-break: break-word;
        }
        .aiw-msg-bot { background: var(--aiw-surface); border-bottom-left-radius: 4px; align-self: flex-start; }
        .aiw-msg-user { background: var(--aiw-accent); border-bottom-right-radius: 4px; align-self: flex-end; }
        .aiw-msg-error {
          background: #fdecec; color: #8a1f1f; align-self: flex-start;
          border-bottom-left-radius: 4px; font-size: 13px;
        }
        .aiw-typing { display: inline-flex; gap: 5px; padding: 13px 15px; }
        .aiw-typing span {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--aiw-muted); animation: aiw-blink 1.2s infinite ease-in-out;
        }
        .aiw-typing span:nth-child(2) { animation-delay: .18s; }
        .aiw-typing span:nth-child(3) { animation-delay: .36s; }
        @keyframes aiw-blink { 0%,80%,100% { opacity: .25 } 40% { opacity: 1 } }
        .aiw-inputbar {
          display: flex; gap: 8px; padding: 12px;
          border-top: 1px solid #e6eae8; background: var(--aiw-bg);
        }
        .aiw-input {
          flex: 1; border: 1.5px solid #d7ddda; border-radius: 12px;
          padding: 10px 12px; font-size: 14px; font-family: inherit;
          resize: none; max-height: 96px; outline: none; color: var(--aiw-text); background: #fff;
        }
        .aiw-input:focus { border-color: var(--aiw-brand); }
        .aiw-send {
          background: var(--aiw-brand); color: #fff; border: none; cursor: pointer;
          border-radius: 12px; width: 44px; flex: none;
          display: flex; align-items: center; justify-content: center; transition: background .15s ease;
        }
        .aiw-send:hover:not(:disabled) { background: var(--aiw-brand-dark); }
        .aiw-send:disabled { opacity: .45; cursor: not-allowed; }
        .aiw-send svg { width: 19px; height: 19px; }
        .aiw-footer { text-align: center; font-size: 11px; color: var(--aiw-muted); padding: 0 0 8px; background: var(--aiw-bg); }
        @media (max-width: 480px) {
          #aiw-panel { right: 0; bottom: 0; width: 100vw; max-width: 100vw; height: 100dvh; max-height: 100dvh; border-radius: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          #aiw-panel, #aiw-launcher { transition: none; }
          .aiw-typing span { animation: none; opacity: .6; }
        }
      `}</style>

      <button
        id="aiw-launcher"
        aria-label="Otwórz czat"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closePanel() : openPanel())}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      <div
        id="aiw-panel"
        className={`${isOpen ? "aiw-open" : ""} ${isOpen ? "aiw-visible" : ""}`}
        role="dialog"
        aria-label="Okno czatu"
        aria-modal="false"
      >
        <div className="aiw-header">
          <span className="aiw-status-dot" aria-hidden="true"></span>
          <div>
            <div className="aiw-header-title">{CHAT_CONFIG.botName}</div>
            <div className="aiw-header-sub">{CHAT_CONFIG.botSubtitle}</div>
          </div>
          <button className="aiw-close" aria-label="Zamknij czat" onClick={closePanel}>
            &times;
          </button>
        </div>

        <div className="aiw-messages" aria-live="polite">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`aiw-msg ${
                m.role === "user" ? "aiw-msg-user" : m.role === "error" ? "aiw-msg-error" : "aiw-msg-bot"
              }`}
            >
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className="aiw-msg aiw-msg-bot aiw-typing" aria-label="Asystent pisze">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="aiw-inputbar">
          <textarea
            ref={inputRef}
            className="aiw-input"
            rows={1}
            maxLength={1000}
            placeholder={CHAT_CONFIG.placeholder}
            aria-label={CHAT_CONFIG.placeholder}
            value={inputValue}
            disabled={isWaiting}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="aiw-send" aria-label="Wyślij wiadomość" disabled={isWaiting} onClick={sendMessage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className="aiw-footer">Rozmowa z asystentem AI</div>
      </div>
    </div>
  );
}

/* ============================================================
   PRZYKŁAD UŻYCIA w src/app/layout.tsx:

   import ChatWidget from "@/components/ChatWidget";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="pl">
         <body>
           {children}
           <ChatWidget />
         </body>
       </html>
     );
   }
   ============================================================ */
