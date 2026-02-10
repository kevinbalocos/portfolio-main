import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
