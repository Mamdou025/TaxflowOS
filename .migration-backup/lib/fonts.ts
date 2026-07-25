import {
  Geist_Mono as createMono,
  Space_Grotesk as createSans,
} from "next/font/google";

// Space Grotesk — a more distinctive geometric sans (keeps the same CSS variable
// name so the whole app picks it up via --font-sans / Tailwind's font-sans).
export const sans = createSans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const mono = createMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});
