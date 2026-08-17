import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and let later Tailwind utilities win over
 * earlier conflicting ones (e.g. a caller's `p-6` overriding a default `p-8`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
