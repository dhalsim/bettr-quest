import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';
  
  return {
    base: '/', // Using root path for Python's HTTP server
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: isDemo ? 'demo-dist' : 'dist',
      // Ensure source maps are generated for better debugging
      sourcemap: true,
    },
    define: {
      // Make the build mode available in the client code
      __DEMO__: isDemo,
      // You can add more environment variables here
      __API_MODE__: JSON.stringify(isDemo ? 'mock' : 'nostr'),
    },
  };
});
