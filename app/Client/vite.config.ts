import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "app", // Tell Vite the source root is now the 'app' folder
  base: "./",
  build: {
    outDir: "../dist", // Build output goes to Client/dist (outside the source root)
    emptyOutDir: true, // Required because outDir is outside the root
  },
});
