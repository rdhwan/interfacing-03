import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generouted({
      source: {
        routes: "./src/client/src/pages/**/[\\w[-]*.{jsx,tsx}",
        modals: "./src/client/src/pages/**/[+]*.{jsx,tsx}",
      },
      output: "./src/client/src/router.ts",
    }),
  ],
  resolve: { alias: { "@": "/src/client" } },
});
