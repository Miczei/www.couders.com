"use client";

import { motion } from "framer-motion";
import { ChatHeader, ChatInput, ChatMessages, QuickReplies } from "@/components/chat/ChatBox";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * The hero's focal point: an always-visible, embedded version of the same
 * chat as ChatLauncher (shares ChatProvider, so the conversation is one
 * thread regardless of which surface you type into). Its entrance is gated
 * by `ready` (flipped by CoudersHero's onReveal, which fires early — during
 * the logo's final settling phase, not after it — so this overlaps the tail
 * of the logo animation with zero added delay of its own).
 *
 * `light` is only ever passed true from the homepage's light-mode
 * experiment (see page.tsx) — /lab's debug preview never passes it, so it
 * stays on the normal dark chrome by default.
 */
export default function HeroChat({ ready = true, light }: { ready?: boolean; light?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.9, delay: 0, ease: EASE }}
      className={`mt-8 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border px-0 shadow-2xl backdrop-blur-xl sm:mt-10 ${
        light ? "border-slate-200 bg-white/80" : "border-white/15 bg-black/60"
      }`}
    >
      <ChatHeader light={light} />
      <ChatMessages light={light} className="h-[220px] px-4 py-4 sm:h-[260px]" />
      <QuickReplies light={light} />
      <ChatInput light={light} />
    </motion.div>
  );
}
