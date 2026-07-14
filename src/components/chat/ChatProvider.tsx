"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getChatUi, type ChatUi } from "@/i18n/chat";

const WEBHOOK_URL = "https://hook.eu1.make.com/0krgthjdn9jelek8s8edykmzqis7nttj";
const TIMEOUT_MS = 90000; // an assistant that also reads PDFs can be slower

export type ChatMessage = {
  id: number;
  text: string;
  sender: "user" | "bot" | "error";
};

type ChatContextValue = {
  ui: ChatUi;
  messages: ChatMessage[];
  isWaiting: boolean;
  sendMessage: (text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Single conversation shared by every chat surface on the site (the
 * bottom-left floating launcher and the embedded hero chat box) so a
 * message sent in one shows up in the other. Provided once in the root
 * layout, above both surfaces.
 */
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

export default function ChatProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const ui = useMemo(() => getChatUi(locale), [locale]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const threadIdRef = useRef<string | null>(null);
  const idRef = useRef(0);
  const seededRef = useRef(false);

  useEffect(() => {
    try {
      threadIdRef.current = sessionStorage.getItem("aiw_thread_id");
    } catch {
      // private browsing: sessionStorage may throw
    }
  }, []);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    setMessages([{ id: idRef.current++, text: ui.welcomeMessage, sender: "bot" }]);
    // Seed once with whatever locale is active on first mount; a locale
    // switch mid-conversation shouldn't retroactively rewrite history.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || isWaiting) return;

    setMessages((m) => [...m, { id: idRef.current++, text, sender: "user" }]);
    setIsWaiting(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message: text,
        thread_id: threadIdRef.current || "",
        page_url: window.location.href,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        clearTimeout(timer);
        const reply =
          data && typeof data.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : ui.errorMessage;
        setMessages((m) => [...m, { id: idRef.current++, text: reply, sender: "bot" }]);
        if (data && data.thread_id) {
          threadIdRef.current = data.thread_id;
          try {
            sessionStorage.setItem("aiw_thread_id", data.thread_id);
          } catch {
            // private browsing
          }
        }
      })
      .catch(() => {
        clearTimeout(timer);
        setMessages((m) => [...m, { id: idRef.current++, text: ui.errorMessage, sender: "error" }]);
      })
      .finally(() => setIsWaiting(false));
  }

  return (
    <ChatContext.Provider value={{ ui, messages, isWaiting, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}
