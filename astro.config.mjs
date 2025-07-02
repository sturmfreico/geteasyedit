import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://positivustheme.vercel.app",
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
