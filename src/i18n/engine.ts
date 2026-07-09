import type { Locale } from "./config";

export type EngineUi = {
  agentLabel: string;
  agentStatuses: string[];
  specIndex: string;
};

const en: EngineUi = {
  agentLabel: "Engine status monitor",
  agentStatuses: [
    "STANDBY",
    "PARSING CONTEXT",
    "ROUTING MODELS",
    "MEMORY SYNCED",
  ],
  specIndex: "Pillars 02 · 04 · 06 · 08",
};

const pl: EngineUi = {
  agentLabel: "Monitor stanu silnika",
  agentStatuses: [
    "CZUWANIE",
    "PARSOWANIE KONTEKSTU",
    "ROUTING MODELI",
    "PAMIĘĆ ZSYNCHRONIZOWANA",
  ],
  specIndex: "Filary 02 · 04 · 06 · 08",
};

const ENGINE: Record<Locale, EngineUi> = { en, pl };

export const getEngineUi = (locale: Locale): EngineUi => ENGINE[locale] ?? en;
