import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['*', "55e5968e-321a-4037-a8d2-067fcf1b3b38.preview.emergentagent.com", "vscode-55e5968e-321a-4037-a8d2-067fcf1b3b38.preview.emergentagent.com", "rich-interactions.preview.emergentagent.com"]
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
