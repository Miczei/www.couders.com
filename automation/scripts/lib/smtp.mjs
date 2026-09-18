/**
 * Sending through the team's own mailbox over SMTP.
 *
 * No sending service, no API key: the message leaves from the same account a
 * reply will come back to, which is the whole point of the setup and also why
 * the pacing in drip.mjs matters. Gmail and Microsoft 365 both need an app
 * password here, not the account password.
 *
 * nodemailer is the one dependency in this directory. Hand-rolling SMTP would
 * mean hand-rolling MIME and RFC 2047 header encoding too, and a subject line
 * with Polish diacritics encoded wrongly is itself a spam signal.
 */

import nodemailer from "nodemailer";

const PRESETS = {
  gmail: { host: "smtp.gmail.com", port: 465, secure: true },
  outlook: { host: "smtp.office365.com", port: 587, secure: false },
};

export function createTransport(cfg) {
  const preset = PRESETS[cfg.smtpPreset] ?? null;
  const host = cfg.smtpHost || preset?.host;
  const port = cfg.smtpPort || preset?.port;

  if (!host || !port) {
    throw new Error(
      "Brak konfiguracji SMTP. Ustaw SMTP_PRESET=gmail albo SMTP_HOST i SMTP_PORT."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: cfg.smtpSecure ?? preset?.secure ?? port === 465,
    auth: { user: cfg.smtpUser, pass: cfg.smtpPass },
    // One connection, one message at a time. Pooling exists to send fast,
    // which is the opposite of what this script is for.
    pool: false,
  });
}

/**
 * Proves the credentials work before the first message goes out. Without it a
 * wrong app password is discovered after the script has been "running" for
 * eleven minutes.
 */
export async function verifyTransport(transport) {
  try {
    await transport.verify();
  } catch (err) {
    throw new Error(
      `Nie mogę zalogować się do skrzynki: ${err.message}\n` +
        "Przy Gmailu prawie zawsze znaczy to brak hasła aplikacji (wymaga włączonego 2FA) " +
        "albo użycie zwykłego hasła do konta."
    );
  }
}

export async function sendMessage(transport, cfg, { to, subject, text }) {
  const info = await transport.sendMail({
    from: cfg.from,
    to,
    subject,
    text,
    ...(cfg.replyTo ? { replyTo: cfg.replyTo } : {}),
    headers: {
      "List-Unsubscribe": `<mailto:${cfg.unsubscribeMailbox}?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  return { messageId: info.messageId ?? "" };
}
