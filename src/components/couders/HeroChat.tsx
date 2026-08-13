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
 * `badges` render as small pills overlapping the panel's corners — an
 * optional prop so /lab's debug preview can render the same component
 * without passing hero copy.
 */
export default function HeroChat({
  ready = true,
  badges,
}: {
  ready?: boolean;
  badges?: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.9, delay: 0, ease: EASE }}
      className="relative mt-6 w-full max-w-3xl sm:mt-8 sm:max-w-4xl md:max-w-5xl"
    >
      {/* Ambient glow behind the panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(640px circle at 50% 25%, rgba(192,108,76,0.24), transparent 70%)",
        }}
      />

      {/* Gradient-border shell */}
      <div className="rounded-[1.75rem] bg-gradient-to-b from-white/25 via-[#C06C4C]/35 to-white/[0.06] p-px shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col overflow-hidden rounded-[1.75rem] bg-black/70 backdrop-blur-xl">
          <ChatHeader />
          <ChatMessages className="h-[320px] px-4 py-4 sm:h-[400px] md:h-[440px]" />
          <QuickReplies />
          <ChatInput />
        </div>
      </div>

      {badges?.[0] && (
        <span className="absolute -left-3 -top-3 z-10 flex items-center gap-1.5 rounded-full border border-[#C06C4C]/40 bg-black/90 px-3 py-1.5 text-[11px] font-medium text-[#E8B8A2] shadow-lg backdrop-blur-md sm:-left-4 sm:-top-4 sm:px-3.5 sm:py-2 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C06C4C] shadow-[0_0_6px_rgba(192,108,76,0.9)]" />
          {badges[0]}
        </span>
      )}
      {badges?.[1] && (
        <span className="absolute -bottom-3 -right-3 z-10 flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-black/90 px-3 py-1.5 text-[11px] font-medium text-emerald-300 shadow-lg backdrop-blur-md sm:-bottom-4 sm:-right-4 sm:px-3.5 sm:py-2 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
          {badges[1]}
        </span>
      )}
    </motion.div>
  );
}
