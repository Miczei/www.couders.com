import type { Locale } from "./config";

export type ChatUi = {
  botName: string;
  botSubtitle: string;
  online: string;
  welcomeMessage: string;
  placeholder: string;
  errorMessage: string;
  quickReplies: string[];
  openLabel: string;
  closeLabel: string;
  sendLabel: string;
};

const en: ChatUi = {
  botName: "Obrotni Nieruchomości",
  botSubtitle: "AI Assistant",
  online: "Online",
  welcomeMessage: "Hi! \u{1F44B} How can we help you today?",
  placeholder: "Type a message…",
  errorMessage: "Sorry, something went wrong on our end. Please try again in a moment.",
  quickReplies: [
    "I'm looking for an apartment",
    "I have a question about a listing",
    "I'd like to leave my contact info",
  ],
  openLabel: "Open chat",
  closeLabel: "Close chat",
  sendLabel: "Send message",
};

const pl: ChatUi = {
  botName: "Obrotni Nieruchomości",
  botSubtitle: "Asystent AI",
  online: "Online",
  welcomeMessage: "Dzień dobry! \u{1F44B} Jak możemy Ci dziś pomóc?",
  placeholder: "Napisz wiadomość…",
  errorMessage: "Przepraszamy, wystąpił problem z połączeniem. Spróbuj ponownie za chwilę.",
  quickReplies: ["Szukam mieszkania", "Mam pytanie o ofertę", "Chcę zostawić kontakt"],
  openLabel: "Otwórz czat",
  closeLabel: "Zamknij czat",
  sendLabel: "Wyślij wiadomość",
};

const CHAT: Record<Locale, ChatUi> = { en, pl };

export const getChatUi = (locale: Locale): ChatUi => CHAT[locale] ?? en;
