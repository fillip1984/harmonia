import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssForm from "@tailwindcss/forms";

export default {
  content: ["./src/app/**/*.tsx"],
  theme: {
    colors: {
      primary: "#57a773",
      secondary: "#157145",
      black: "#000",
      white: "#fff",
      gray: "#595758",
      danger: "#f64740",
      warning: "#f4e04d",
      background: "#2e3d4a",
      foreground: "#16293a",
      transparent: "inherit",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [tailwindcssForm],
} satisfies Config;
