import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // brand green
        brand: {
          DEFAULT: "#5B9A24",
          hover: "#4d8a1c",
          deep: "#4a8118",
          ink: "#41701b",
        },
        // ink / surfaces
        ink: {
          DEFAULT: "#161A12",
          900: "#13160F",
          950: "#0F120B",
        },
        cream: "#F6F8F1",
        // borders
        line: {
          DEFAULT: "#E7E9E1",
          soft: "#EEF0E8",
          input: "#E2E5DB",
        },
        // muted text
        muted: {
          DEFAULT: "#5C6253",
          light: "#8A907E",
          soft: "#7B8170",
        },
        // soft-green badge
        leaf: {
          bg: "#EAF2DF",
          border: "#D8E6C4",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "Georgia", "serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      boxShadow: {
        card: "0 22px 44px -24px rgba(22,26,18,0.3)",
        search: "0 22px 50px -28px rgba(22,26,18,0.25)",
        hero: "0 30px 60px -30px rgba(22,26,18,0.4)",
        pill: "0 6px 16px rgba(91,154,36,0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
