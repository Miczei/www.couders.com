import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        ink: "#060608",
        elev: "#0C0D12",
        line: "rgba(255,255,255,0.08)",
        accent: "#6D5EF6",
        accent2: "#22E0C8",
      },
      maxWidth: {
        shell: "1240px",
      },
    },
  },
  plugins: [],
} satisfies Config;
