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
  botName: "Couders AI Assistant",
  botSubtitle: "We usually reply within seconds",
  online: "Online",
  welcomeMessage: "Hi! \u{1F44B} I'm the Couders assistant. How can I help?",
  placeholder: "Type a message…",
  errorMessage: "Sorry, something went wrong on our end. Please try again in a moment.",
  quickReplies: [
    "How does the AI engine work?",
    "Get a project quote",
    "How long does deployment take?",
  ],
  openLabel: "Open chat",
  closeLabel: "Close chat",
  sendLabel: "Send message",
};

const pl: ChatUi = {
  botName: "Couders AI Assistant",
  botSubtitle: "Zwykle odpowiadamy w kilka sekund",
  online: "Online",
  welcomeMessage: "Dzień dobry! \u{1F44B} Jestem asystentem Couders. W czym mogę pomóc?",
  placeholder: "Napisz wiadomość…",
  errorMessage: "Przepraszamy, wystąpił problem z połączeniem. Spróbuj ponownie za chwilę.",
  quickReplies: ["Jak działa silnik AI?", "Wycena projektu", "Ile trwa wdrożenie?"],
  openLabel: "Otwórz czat",
  closeLabel: "Zamknij czat",
  sendLabel: "Wyślij wiadomość",
};

const CHAT: Record<Locale, ChatUi> = { en, pl };

export const getChatUi = (locale: Locale): ChatUi => CHAT[locale] ?? en;
