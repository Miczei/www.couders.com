"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getChatUi, type ChatUi } from "@/i18n/chat";

// Default is the n8n Chat Trigger. The request carries both payload shapes and
// the reader accepts both replies, so to roll back to the old Make scenario set
// NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://hook.eu1.make.com/0krgthjdn9jelek8s8edykmzqis7nttj
// (or revert this commit) — no other code change needed.
const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ??
  "https://couders.app.n8n.cloud/webhook/obrotni-demo-czat/chat";
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

// Temporary shim: the Make.com scenario concatenates an empty variable, so a
// literal "null"/"undefined" gets glued into the reply, anywhere in the text,
// e.g. "...praktyki specjalistycznenull. W czym..." or "...gabinetunull.".
// Strip the token wherever it sits right before whitespace, punctuation, or the
// end of the string. The lookahead means real words like "nullable" (null + a
// letter) are left untouched. Remove this once Make's output mapping is fixed.
function sanitizeReply(text: string): string {
  return text
    .replace(/(?:null|undefined)(?=[\s\p{P}]|$)/giu, "")
    // tidy up any doubled space or space-before-punctuation left behind
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([.,!?;:])/g, "$1")
    .trim();
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

    // n8n keys its conversation memory off sessionId and never sends one back,
    // so the client owns it. Mint it on the first message and keep it for the
    // whole visit, otherwise every turn starts a fresh, amnesiac thread.
    if (!threadIdRef.current) {
      threadIdRef.current =
        globalThis.crypto?.randomUUID?.() ?? `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      try {
        sessionStorage.setItem("aiw_thread_id", threadIdRef.current);
      } catch {
        // private browsing
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      // Both protocols in one body: n8n's Chat Trigger reads action/chatInput/
      // sessionId, the Make scenario reads message/thread_id/page_url. Each
      // ignores the other's fields, so one client works with either backend.
      body: JSON.stringify({
        action: "sendMessage",
        chatInput: text,
        sessionId: threadIdRef.current,
        message: text,
        thread_id: threadIdRef.current,
        page_url: window.location.href,
      }),
    })
      .then((res) => {
        console.log("[Chat] HTTP status:", res.status, "| Content-Type:", res.headers.get("content-type"));
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text(); // read as text first, so a non-JSON body is still usable
      })
      .then((raw) => {
        clearTimeout(timer);
        console.log("[Chat] Raw response:", raw);

        let reply = "";
        try {
          const data = JSON.parse(raw);
          // n8n Chat Trigger returns { output }. "reply" is kept as a fallback so
          // pointing NEXT_PUBLIC_CHAT_WEBHOOK_URL back at the old endpoint still works.
          const candidate =
            typeof data?.output === "string"
              ? data.output
              : typeof data?.reply === "string"
                ? data.reply
                : "";
          if (candidate.trim()) reply = candidate.trim();
        } catch (parseError) {
          console.warn("[Chat] Response wasn't valid JSON, using raw text as the reply.", parseError);
          reply = raw.trim();
        }

        reply = sanitizeReply(reply);

        if (!reply) {
          console.error("[Chat] Empty reply — check that the n8n workflow is Active and its last node returns output.");
        }
        setMessages((m) => [
          ...m,
          { id: idRef.current++, text: reply || ui.errorMessage, sender: reply ? "bot" : "error" },
        ]);
      })
      .catch((error) => {
        clearTimeout(timer);
        console.error("[Chat] Network/connection error:", error);
        if (error?.name === "AbortError") {
          console.error("[Chat] Timed out after " + TIMEOUT_MS + " ms — the n8n workflow may be inactive, slow, or blocked by CORS.");
        }
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
