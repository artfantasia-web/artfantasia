import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const rootDir = typeof import.meta.dirname !== 'undefined'
  ? import.meta.dirname
  : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'feed-and-llms-dev-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url?.split('?')[0];
            if (url === '/rss' || url === '/feed') {
              req.url = '/rss.xml';
              return next();
            }
            if (url === '/llms.txt' || url === '/.well-known/llms.txt') {
              const filePath = path.resolve('public/llms.txt');
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
                res.end(fs.readFileSync(filePath));
                return;
              }
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    build: {
      target: 'es2022',
      minify: true,
      cssMinify: true,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, 'index.html'),
          about: path.resolve(rootDir, 'about/index.html'),
          video: path.resolve(rootDir, 'video/index.html'),
          audio: path.resolve(rootDir, 'audio/index.html'),
          afanmusic: path.resolve(rootDir, 'afanmusic/index.html'),
          marketing: path.resolve(rootDir, 'marketing/index.html'),
          notice: path.resolve(rootDir, 'notice/index.html'),
          inquiry: path.resolve(rootDir, 'inquiry/index.html'),
        },
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'icons';
            }
            if (id.includes('/src/data/content')) {
              return 'portfolio-data';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
