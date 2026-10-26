import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'rss-feed-dev-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url?.split('?')[0];
            if (url === '/rss' || url === '/feed') {
              req.url = '/rss.xml';
              return next();
            }

            if (url === '/api/admin/upload-file' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const { fileData } = JSON.parse(body);
                  if (!fileData) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'No file data provided' }));
                    return;
                  }

                  let ext = '.png';
                  let base64Content = fileData;

                  const publicUploadDir = path.resolve(import.meta.dirname, 'public/uploads/logos');
                  fs.mkdirSync(publicUploadDir, { recursive: true });

                  if (fileData.startsWith('data:image/svg+xml')) {
                    ext = '.svg';
                    const commaIdx = fileData.indexOf(',');
                    const raw = fileData.slice(commaIdx + 1);
                    const text = fileData.includes(';base64,') ? Buffer.from(raw, 'base64').toString('utf-8') : decodeURIComponent(raw);
                    const safeName = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.svg`;
                    fs.writeFileSync(path.join(publicUploadDir, safeName), text, 'utf-8');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, url: `/uploads/logos/${safeName}` }));
                    return;
                  } else if (fileData.startsWith('data:image/')) {
                    const match = fileData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
                    if (match) {
                      ext = match[1] === 'jpeg' ? '.jpg' : `.${match[1]}`;
                      base64Content = match[2];
                    }
                  }

                  const safeName = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
                  const buffer = Buffer.from(base64Content, 'base64');
                  fs.writeFileSync(path.join(publicUploadDir, safeName), buffer);

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, url: `/uploads/logos/${safeName}` }));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
              return;
            }

            if (url === '/api/admin/save-data' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  const publicFile = path.resolve(import.meta.dirname, 'public/admin_data.json');
                  const srcFile = path.resolve(import.meta.dirname, 'src/data/persisted_admin_data.json');
                  const jsonStr = JSON.stringify(data, null, 2);
                  fs.writeFileSync(publicFile, jsonStr, 'utf-8');
                  fs.writeFileSync(srcFile, jsonStr, 'utf-8');

                  // Also persist directly into git-tracked TypeScript files so git push to GitHub/Netlify works out-of-the-box!
                  if (Array.isArray(data.logos) && data.logos.length > 0) {
                    const fixedLogosFile = path.resolve(import.meta.dirname, 'src/data/fixedLogos.ts');
                    const cleaned = data.logos.map((l: any) => ({ logoUrl: l.logoUrl }));
                    const logosCode = `import { InternationalLogoItem } from "../types";\n\nexport const FIXED_INTERNATIONAL_LOGOS: InternationalLogoItem[] = ${JSON.stringify(cleaned, null, 2)};\n`;
                    fs.writeFileSync(fixedLogosFile, logosCode, 'utf-8');
                  }
                  if (Array.isArray(data.notices) && data.notices.length > 0) {
                    const contentFile = path.resolve(import.meta.dirname, 'src/data/content.ts');
                    let contentTs = fs.readFileSync(contentFile, 'utf-8');
                    contentTs = contentTs.replace(
                      /export const NOTICES: NoticeItem\[\] = \[[\s\S]*?\];/,
                      `export const NOTICES: NoticeItem[] = ${JSON.stringify(data.notices, null, 2)};`
                    );
                    fs.writeFileSync(contentFile, contentTs, 'utf-8');
                  }

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, message: 'Saved successfully to disk and source files' }));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
              return;
            }

            if (url === '/api/admin/get-data' && req.method === 'GET') {
              try {
                const publicFile = path.resolve(import.meta.dirname, 'public/admin_data.json');
                if (fs.existsSync(publicFile)) {
                  const content = fs.readFileSync(publicFile, 'utf-8');
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(content);
                  return;
                }
              } catch {}
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Data not found' }));
              return;
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      target: 'es2022',
      minify: true,
      cssMinify: true,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
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
