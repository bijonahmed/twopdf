import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 99900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              // Group React and ReactDOM into a specific chunk
              return 'react-vendors';
            }
            // Group all other node_modules dependencies into a vendor chunk
            return 'vendor';
          }
          // Add more conditions for other libraries or dependencies as needed
        },
      },
    },
  },
});
