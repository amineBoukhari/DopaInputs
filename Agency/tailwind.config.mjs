/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

// ============================================
// 🎨 VITANORIX BTP - ALIGNED COLOR PALETTE
// ============================================
// STRUCTURE KEPT — VALUES NORMALIZED
// Visual result: Blue / White / Charcoal only

const colors = {
  // ------------------------------------------
  // PRIMARY COLORS (Blue - Brand / CTA)
  // ------------------------------------------
  primary: {
    50:  "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#1E3A8A",
    600: "#1E3A8A",
    700: "#1E3A8A",
    800: "#1E3A8A",
    900: "#1E3A8A",
    950: "#1E3A8A",
  },

  // ------------------------------------------
  // SECONDARY COLORS (Mapped to Blue)
  // ------------------------------------------
  secondary: {
    50:  "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#1E3A8A",
    600: "#1E3A8A",
    700: "#1E3A8A",
    800: "#1E3A8A",
    900: "#1E3A8A",
    950: "#1E3A8A",
  },

  // ------------------------------------------
  // ACCENT COLORS (Mapped to Blue)
  // ------------------------------------------
  accent: {
    50:  "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#1E3A8A",
    600: "#1E3A8A",
    700: "#1E3A8A",
    800: "#1E3A8A",
    900: "#1E3A8A",
    950: "#1E3A8A",
  },

  // ------------------------------------------
  // NEUTRAL COLORS (White → Charcoal)
  // ------------------------------------------
  neutral: {
    50:  "#FFFFFF",
    100: "#F9FAFB",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#111827",
  },

  // ------------------------------------------
  // SUCCESS COLORS (Neutralized → Blue)
  // ------------------------------------------
  success: {
    50:  "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#1E3A8A",
    600: "#1E3A8A",
    700: "#1E3A8A",
    800: "#1E3A8A",
    900: "#1E3A8A",
    950: "#1E3A8A",
  },

  // ------------------------------------------
  // WARNING COLORS (Neutralized → Charcoal)
  // ------------------------------------------
  warning: {
    50:  "#F9FAFB",
    100: "#E5E7EB",
    200: "#D1D5DB",
    300: "#9CA3AF",
    400: "#6B7280",
    500: "#374151",
    600: "#374151",
    700: "#374151",
    800: "#374151",
    900: "#111827",
    950: "#111827",
  },

  // ------------------------------------------
  // ERROR COLORS (Neutralized → Charcoal)
  // ------------------------------------------
  error: {
    50:  "#F9FAFB",
    100: "#E5E7EB",
    200: "#D1D5DB",
    300: "#9CA3AF",
    400: "#6B7280",
    500: "#374151",
    600: "#374151",
    700: "#374151",
    800: "#111827",
    900: "#111827",
    950: "#111827",
  },

  // ------------------------------------------
  // SPECIAL COLORS
  // ------------------------------------------
  transparent: "transparent",
  current: "currentColor",
  white: "#FFFFFF",
  black: "#000000",

  // ------------------------------------------
  // GRADIENT COLORS (Neutralized)
  // ------------------------------------------
  gradient: {
    primary: { from: "#1E3A8A", to: "#1E3A8A" },
    blue: { from: "#1E3A8A", to: "#1E3A8A" },
    purple: { from: "#1E3A8A", to: "#1E3A8A" },
    animate: {
      start: "#1E3A8A",
      mid: "#1E3A8A",
      end: "#1E3A8A",
    },
  },
};

// ============================================
// 🔤 TYPOGRAPHY SETTINGS
// ============================================
const typography = {
  fontFamily: {
    sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
    headings: ["Inter Variable", ...defaultTheme.fontFamily.sans],
  },
};

// ============================================
// TAILWIND CONFIGURATION
// ============================================
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ["selector"],

  safelist: [
    { pattern: /col-span-(\d+)/, variants: ["lg"] },
    { pattern: /h-(0|2|3|4|6|8|12|16|24|32)/, variants: ["lg"] },
    {
      pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/,
      variants: ["lg"],
    },
    {
      pattern:
        /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
    },
    { pattern: /text-(left|center|right)/ },
  ],

  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,

      keyframes: {
        dropdown: {
          "0%": { transform: "translateY(-1rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeUp: {
          "0%": { transform: "translateY(1rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },

      animation: {
        dropdown: "dropdown 300ms ease-in-out forwards",
        fadeUp: "fadeUp 500ms ease-in-out forwards",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss/plugin")(function ({ addVariant }) {
      addVariant("dark-me", ".dark_&");
    }),
  ],
};
