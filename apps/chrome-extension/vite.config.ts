import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'index.html'),
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        content: resolve(__dirname, 'src/assets/content.jsx'),
        background: resolve(__dirname, 'src/assets/background.ts'),
        popup: resolve(__dirname, 'popup.html'),
      }
    }
  },
  plugins: [react()],
})
