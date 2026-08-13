"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({
  open,
  onClose,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999997] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999998] flex flex-col overflow-y-auto border border-white/15 bg-[#0A0A0B] p-6 shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[85vh] sm:w-[min(560px,90vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-10"
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors duration-300 hover:text-white sm:right-6 sm:top-6"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="mt-8 flex flex-1 flex-col justify-center sm:mt-0">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
