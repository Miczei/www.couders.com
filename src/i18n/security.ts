import type { Locale } from "./config";

/**
 * UI-only copy for the Security & Data page's status ticker (MiniAgent) and
 * spec index label, mirroring src/i18n/engine.ts so both pages share the
 * same premium component (DecodeText, MiniAgent, PillarTile) with
 * domain-appropriate strings instead of the engine's own.
 */
export type SecurityUi = {
  agentLabel: string;
  agentStatuses: string[];
  specIndex: string;
};

const en: SecurityUi = {
  agentLabel: "Guardrail status monitor",
  agentStatuses: [
    "STANDBY",
    "VERIFYING ACCESS",
    "CHECKING RULES",
    "AUDIT LOGGED",
  ],
  specIndex: "Pillars 03 · 05 · 07 · 10",
};

const pl: SecurityUi = {
  agentLabel: "Monitor stanu zabezpieczeń",
  agentStatuses: [
    "CZUWANIE",
    "WERYFIKACJA DOSTĘPU",
    "SPRAWDZANIE REGUŁ",
    "AUDYT ZAPISANY",
  ],
  specIndex: "Filary 03 · 05 · 07 · 10",
};

const SECURITY: Record<Locale, SecurityUi> = { en, pl };

export const getSecurityUi = (locale: Locale): SecurityUi => SECURITY[locale] ?? en;
