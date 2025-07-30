import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['*', 'e7596918-5ea3-4390-beb9-1eafe82bec3e-00-12858xkq6katu.worf.replit.dev']
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
