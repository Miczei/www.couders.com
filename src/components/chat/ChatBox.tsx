"use client";

import { useEffect, useRef } from "react";
import { useChat } from "./ChatProvider";

function TypingDots({ light }: { light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 self-start rounded-2xl rounded-bl-sm px-4 py-3 ${
        light ? "bg-slate-900/5" : "bg-white/[0.06]"
      }`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 animate-pulse rounded-full ${light ? "bg-slate-400" : "bg-zinc-400"}`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ChatHeader({ light }: { light?: boolean }) {
  const { ui } = useChat();
  return (
    <div
      className={`flex flex-none items-center gap-3 border-b px-4 py-3.5 ${
        light ? "border-slate-200" : "border-white/10"
      }`}
    >
      <span
        className={`relative flex h-9 w-9 flex-none items-center justify-center rounded-full ${
          light ? "bg-slate-900/5" : "bg-white/[0.06]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={light ? "#475569" : "#C7CCD6"}
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 3l2.2 5.2L19 10l-4.8 2.2L12 17l-2.2-4.8L5 10l4.8-1.8L12 3z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${light ? "text-slate-900" : "text-white"}`}>
          {ui.botName}
        </p>
        <p className={`truncate text-xs ${light ? "text-slate-500" : "text-zinc-500"}`}>{ui.botSubtitle}</p>
      </div>
      <span
        className={`flex flex-none items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
          light ? "border-emerald-600/20 bg-emerald-50 text-emerald-700" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
        {ui.online}
      </span>
    </div>
  );
}

export function ChatMessages({ className, light }: { className?: string; light?: boolean }) {
  const { messages, isWaiting } = useChat();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isWaiting]);

  return (
    <div
      data-lenis-prevent
      className={`flex flex-col gap-2.5 overflow-y-auto overscroll-contain ${className ?? ""}`}
    >
      {messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
            m.sender === "user"
              ? "self-end rounded-br-sm bg-[#C06C4C] text-white"
              : m.sender === "error"
                ? light
                  ? "self-start rounded-bl-sm bg-red-50 text-red-700"
                  : "self-start rounded-bl-sm bg-red-500/10 text-red-200"
                : light
                  ? "self-start rounded-bl-sm bg-slate-900/5 text-slate-800"
                  : "self-start rounded-bl-sm bg-white/[0.06] text-zinc-200"
          }`}
        >
          {m.text}
        </div>
      ))}
      {isWaiting && <TypingDots light={light} />}
      <div ref={endRef} />
    </div>
  );
}

export function QuickReplies({ light }: { light?: boolean }) {
  const { ui, sendMessage, isWaiting } = useChat();
  return (
    <div
      className={`flex flex-none flex-wrap gap-2 border-t px-3 pt-3 ${light ? "border-slate-200" : "border-white/10"}`}
    >
      {ui.quickReplies.map((q) => (
        <button
          key={q}
          type="button"
          disabled={isWaiting}
          onClick={() => sendMessage(q)}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 hover:border-[#C06C4C]/60 disabled:opacity-40 ${
            light
              ? "border-slate-200 bg-slate-900/[0.02] text-slate-600 hover:text-slate-900"
              : "border-white/15 bg-white/[0.03] text-zinc-300 hover:text-white"
          }`}
        >
          {q}
        </button>
      ))}
    </div>
  );
}

export function ChatInput({ autoFocus, light }: { autoFocus?: boolean; light?: boolean }) {
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
    <div className={`flex flex-none items-end gap-2 border-t p-3 ${light ? "border-slate-200" : "border-white/10"}`}>
      <textarea
        ref={inputRef}
        rows={1}
        maxLength={1000}
        autoFocus={autoFocus}
        placeholder={ui.placeholder}
        disabled={isWaiting}
        aria-label={ui.placeholder}
        className={`max-h-24 flex-1 resize-none rounded-xl border px-3 py-2 text-[13.5px] outline-none transition-colors duration-300 disabled:opacity-50 ${
          light
            ? "border-slate-200 bg-slate-900/[0.03] text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
            : "border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-500 focus:border-white/30"
        }`}
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
