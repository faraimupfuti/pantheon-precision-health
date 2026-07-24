import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12181A",
        paper: "#FFFFFF",
        mist: "#F6F7F7",
        line: "#E4E7E7",
        stone: "#68716F",
        clinical: {
          50: "#EBF5F2",
          100: "#CFE6DE",
          300: "#7FB8A5",
          500: "#2E7D66",
          600: "#1F6350",
          700: "#175041",
          900: "#0C2B22"
        },
        signal: {
          amber: "#B4620A",
          red: "#A32B2B"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      letterSpacing: {
        widest2: "0.24em"
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,24,26,0.04), 0 8px 24px rgba(18,24,26,0.06)"
      }
    }
  },
  plugins: []
};

export default config;
