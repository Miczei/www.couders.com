/**
 * The lead queue lives in a Google Sheet, reached through an Apps Script web
 * app (see ../../apps-script/queue.gs). The repository is public, so no lead
 * data is ever stored here: this module only knows the shape of a row.
 *
 * The web app is deliberately dumb. It returns rows and accepts status
 * writes; every scheduling decision happens in guards.mjs, where it is
 * readable, reviewable and testable without a network call.
 */

const TIMEOUT_MS = 20_000;

async function call(url, { method = "GET", token, body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      signal: controller.signal,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify({ ...body, token }) : undefined,
      redirect: "follow", // Apps Script answers with a 302 to script.googleusercontent.com
    });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(
        `Arkusz odpowiedział treścią, która nie jest JSON-em (HTTP ${res.status}). ` +
          `Zwykle znaczy to, że web app nie jest opublikowany dla "Anyone". Początek odpowiedzi: ${text.slice(0, 120)}`
      );
    }
    if (!res.ok || json.ok === false) {
      throw new Error(`Arkusz zwrócił błąd: ${json.error ?? res.status}`);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/** Normalises whatever the sheet holds into the row shape the sender expects. */
function normaliseRow(raw) {
  const get = (...keys) => {
    for (const k of keys) {
      const v = raw[k];
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "number") return String(v);
    }
    return "";
  };
  const email = get("email", "e-mail", "mail").toLowerCase();
  return {
    rowId: get("rowId", "row_id", "id"),
    email,
    domain: (get("domena", "domain") || email.split("@")[1] || "").toLowerCase(),
    firstName: get("imie", "imię", "firstName", "osoba").split(" ")[0],
    company: get("firma", "company"),
    demoUrl: get("demoUrl", "demo_url", "demo"),
    demoExpiry: get("demoExpiry", "demo_expiry", "demo_wygasa"),
    keyword: get("fraza", "keyword"),
    cpc: get("cpc"),
    detail: get("konkret", "detail"),
    status: (get("status") || "nowy").toLowerCase(),
    sequence: (get("sekwencja", "sequence") || "demo").toLowerCase(),
    firstSentAt: get("first_sent_at", "pierwsza_wysylka"),
    lastSentAt: get("data_kontaktu", "last_sent_at"),
    step: Number.parseInt(get("krok", "step") || "0", 10) || 0,
  };
}

export async function fetchRows(cfg) {
  const url = `${cfg.queueUrl}?action=rows&token=${encodeURIComponent(cfg.queueToken)}`;
  const json = await call(url, { token: cfg.queueToken });
  return (json.rows ?? []).map(normaliseRow).filter((r) => r.rowId);
}

export async function fetchSuppression(cfg) {
  const url = `${cfg.queueUrl}?action=suppression&token=${encodeURIComponent(cfg.queueToken)}`;
  const json = await call(url, { token: cfg.queueToken });
  const emails = new Set((json.emails ?? []).map((e) => String(e).trim().toLowerCase()).filter(Boolean));
  const domains = new Set((json.domains ?? []).map((d) => String(d).trim().toLowerCase()).filter(Boolean));
  return { emails, domains };
}

export async function markSent(cfg, { rowId, step, messageId, at }) {
  return call(cfg.queueUrl, {
    method: "POST",
    token: cfg.queueToken,
    body: { action: "markSent", rowId, step, messageId, at },
  });
}

export async function markFailed(cfg, { rowId, error }) {
  return call(cfg.queueUrl, {
    method: "POST",
    token: cfg.queueToken,
    body: { action: "markFailed", rowId, error: String(error).slice(0, 400) },
  });
}
