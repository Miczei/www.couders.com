/**
 * Sending goes through Resend's HTTP API so this stays dependency-free and
 * runs on a bare Node 20 runner. To move to another provider, replace this
 * one function: everything else in the pipeline is provider-agnostic.
 *
 * Messages are plain text on purpose. A cold message that arrives as a
 * hand-typed note outperforms an HTML template, and it gives spam filters
 * far less to dislike.
 */

const ENDPOINT = "https://api.resend.com/emails";

export async function sendEmail(cfg, { to, subject, text, headers = {} }) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: cfg.from,
      to: [to],
      subject,
      text,
      ...(cfg.replyTo ? { reply_to: cfg.replyTo } : {}),
      headers: {
        // One-click unsubscribe support. Gmail and Outlook both surface this,
        // and honouring it is cheaper than being reported.
        "List-Unsubscribe": `<mailto:${cfg.unsubscribeMailbox}?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        ...headers,
      },
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Resend odrzucił wiadomość (HTTP ${res.status}): ${payload.message ?? JSON.stringify(payload).slice(0, 200)}`
    );
  }
  return { messageId: payload.id ?? "" };
}
