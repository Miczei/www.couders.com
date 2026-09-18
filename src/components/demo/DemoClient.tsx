"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

/**
 * The prospect-facing demo: an assistant that already knows the visitor's own
 * catalogue, opened from a link in a cold e-mail.
 *
 * Everything that makes it specific to one company (the knowledge, the system
 * prompt, the expiry) lives behind the n8n webhook in NEXT_PUBLIC_DEMO_API.
 * This component only knows how to render a conversation, which is why one
 * static page can serve every prospect.
 */

type Config = {
  ok: boolean;
  company?: string;
  tagline?: string;
  intro?: string;
  suggested?: string[];
  expiresAt?: string;
  error?: string;
};

type Message = { role: "user" | "assistant"; content: string };

const API = process.env.NEXT_PUBLIC_DEMO_API ?? "";

const COPY = {
  pl: {
    loading: "Wczytuję demo...",
    missingId: "Brak identyfikatora demo w adresie.",
    notConfigured: "Demo nie jest jeszcze skonfigurowane.",
    badge: "Wersja testowa",
    placeholder: "Zapytaj o ofertę, ceny, terminy...",
    send: "Wyślij",
    thinking: "Asystent pisze...",
    failed: "Nie udało się połączyć z asystentem. Spróbuj jeszcze raz.",
    expires: (d: string) => `Demo aktywne do ${d}.`,
    footer: "Zbudowane przez",
    cta: "Chcesz takiego asystenta u siebie?",
  },
  en: {
    loading: "Loading the demo...",
    missingId: "No demo id in the address.",
    notConfigured: "This demo is not configured yet.",
    badge: "Test version",
    placeholder: "Ask about the offer, prices, lead times...",
    send: "Send",
    thinking: "The assistant is typing...",
    failed: "Could not reach the assistant. Please try again.",
    expires: (d: string) => `Demo active until ${d}.`,
    footer: "Built by",
    cta: "Want one of these for your own site?",
  },
} as const;

export default function DemoClient({ locale }: { locale: Locale }) {
  const t = COPY[locale === "en" ? "en" : "pl"];

  const [id, setId] = useState<string | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const streamEnd = useRef<HTMLDivElement>(null);

  // Read the token from the query string directly rather than through
  // useSearchParams, which would force this subtree into a Suspense boundary
  // for no benefit on a statically exported page.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);

  useEffect(() => {
    if (id === null) return;
    if (!id || !API) {
      setConfig({ ok: false, error: !id ? t.missingId : t.notConfigured });
      return;
    }
    let cancelled = false;
    fetch(`${API}/demo-config?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data: Config) => {
        if (cancelled) return;
        setConfig(data);
        if (data.ok && data.intro) {
          setMessages([{ role: "assistant", content: data.intro }]);
        }
      })
      .catch(() => {
        if (!cancelled) setConfig({ ok: false, error: t.failed });
      });
    return () => {
      cancelled = true;
    };
  }, [id, t.missingId, t.notConfigured, t.failed]);

  useEffect(() => {
    streamEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy || !id) return;

      // The transcript is sent with the request, so build it once and use the
      // same value for the request and the optimistic render.
      const next: Message[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      setInput("");
      setBusy(true);

      try {
        const res = await fetch(`${API}/demo-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, messages: next }),
        });
        const data = await res.json();
        setMessages([
          ...next,
          { role: "assistant", content: data.reply ?? data.error ?? t.failed },
        ]);
      } catch {
        setMessages([...next, { role: "assistant", content: t.failed }]);
      } finally {
        setBusy(false);
      }
    },
    [busy, id, messages, t.failed]
  );

  if (!config) {
    return <Shell><p className="text-[var(--muted)]">{t.loading}</p></Shell>;
  }

  if (!config.ok) {
    return (
      <Shell>
        <p className="text-lg font-medium">{config.error ?? t.notConfigured}</p>
        <a className="mt-6 inline-block underline" href={`/${locale}`}>
          couders.com
        </a>
      </Shell>
    );
  }

  const expires = config.expiresAt
    ? new Date(config.expiresAt).toLocaleDateString(locale === "en" ? "en-GB" : "pl-PL", {
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <Shell>
      <header className="mb-8">
        <span className="inline-block rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--muted)]">
          {t.badge}
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-4xl">
          {config.company}
        </h1>
        {config.tagline ? (
          <p className="mt-3 max-w-xl text-[var(--muted)]">{config.tagline}</p>
        ) : null}
      </header>

      <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-4 shadow-sm sm:p-6">
        <div className="max-h-[52vh] space-y-4 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <p
                className={[
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-[var(--fg)] text-white"
                    : "bg-black/[0.04] text-[var(--fg)]",
                ].join(" ")}
              >
                {m.content}
              </p>
            </div>
          ))}
          {busy ? <p className="text-sm text-[var(--muted)]">{t.thinking}</p> : null}
          <div ref={streamEnd} />
        </div>

        {messages.length <= 1 && config.suggested?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {config.suggested.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="min-w-0 flex-1 rounded-full border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-[var(--fg)]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-full bg-[var(--fg)] px-5 py-3 text-sm text-white transition-opacity disabled:opacity-40"
          >
            {t.send}
          </button>
        </form>
      </div>

      <footer className="mt-8 flex flex-col gap-2 text-sm text-[var(--muted)]">
        {expires ? <span>{t.expires(expires)}</span> : null}
        <span>
          {t.cta}{" "}
          <a className="underline" href={`/${locale}/contact`}>
            {t.footer} Couders
          </a>
        </span>
      </footer>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:py-24">{children}</main>
  );
}
