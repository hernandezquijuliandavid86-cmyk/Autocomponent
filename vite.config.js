import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" permite publicar en GitHub Pages sin importar el nombre del repo
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
