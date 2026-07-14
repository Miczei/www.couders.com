"use client";

import { useEffect, useRef } from "react";
import { useChat } from "./ChatProvider";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-white/[0.06] px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ChatHeader() {
  const { ui } = useChat();
  return (
    <div className="flex flex-none items-center gap-3 border-b border-white/10 px-4 py-3.5">
      <span className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/[0.06]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C7CCD6"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 3l2.2 5.2L19 10l-4.8 2.2L12 17l-2.2-4.8L5 10l4.8-1.8L12 3z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{ui.botName}</p>
        <p className="truncate text-xs text-zinc-500">{ui.botSubtitle}</p>
      </div>
      <span className="flex flex-none items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
        {ui.online}
      </span>
    </div>
  );
}

export function ChatMessages({ className }: { className?: string }) {
  const { messages, isWaiting } = useChat();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isWaiting]);

  return (
    <div className={`flex flex-col gap-2.5 overflow-y-auto ${className ?? ""}`}>
      {messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
            m.sender === "user"
              ? "self-end rounded-br-sm bg-[#C06C4C] text-white"
              : m.sender === "error"
                ? "self-start rounded-bl-sm bg-red-500/10 text-red-200"
                : "self-start rounded-bl-sm bg-white/[0.06] text-zinc-200"
          }`}
        >
          {m.text}
        </div>
      ))}
      {isWaiting && <TypingDots />}
      <div ref={endRef} />
    </div>
  );
}

export function QuickReplies() {
  const { ui, sendMessage, isWaiting } = useChat();
  return (
    <div className="flex flex-none flex-wrap gap-2 border-t border-white/10 px-3 pt-3">
      {ui.quickReplies.map((q) => (
        <button
          key={q}
          type="button"
          disabled={isWaiting}
          onClick={() => sendMessage(q)}
          className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition-colors duration-300 hover:border-[#C06C4C]/60 hover:text-white disabled:opacity-40"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

export function ChatInput({ autoFocus }: { autoFocus?: boolean }) {
  const { ui, isWaiting, sendMessage } = useChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const el = inputRef.current;
    if (!el) return;
    sendMessage(el.value);
    el.value = "";
    el.style.height = "auto";
  }

  return (
    <div className="flex flex-none items-end gap-2 border-t border-white/10 p-3">
      <textarea
        ref={inputRef}
        rows={1}
        maxLength={1000}
        autoFocus={autoFocus}
        placeholder={ui.placeholder}
        disabled={isWaiting}
        aria-label={ui.placeholder}
        className="max-h-24 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13.5px] text-white outline-none transition-colors duration-300 placeholder:text-zinc-500 focus:border-white/30 disabled:opacity-50"
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = Math.min(el.scrollHeight, 96) + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        type="button"
        aria-label={ui.sendLabel}
        disabled={isWaiting}
        onClick={handleSend}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#C06C4C] text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
