import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

const distPath = path.join(__dirname, 'dist');

// Admin Data Persistence API
app.post('/api/admin/save-data', (req, res) => {
  try {
    const data = req.body;
    const jsonStr = JSON.stringify(data, null, 2);

    const distFile = path.join(distPath, 'admin_data.json');
    const publicFile = path.join(__dirname, 'public', 'admin_data.json');

    try {
      if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });
      fs.writeFileSync(distFile, jsonStr, 'utf-8');
    } catch {}

    try {
      const publicDir = path.join(__dirname, 'public');
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
      fs.writeFileSync(publicFile, jsonStr, 'utf-8');
    } catch {}

    res.status(200).json({ success: true, message: 'Saved successfully to server' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/get-data', (_req, res) => {
  try {
    const distFile = path.join(distPath, 'admin_data.json');
    const publicFile = path.join(__dirname, 'public', 'admin_data.json');
    if (fs.existsSync(distFile)) {
      return res.status(200).sendFile(distFile);
    }
    if (fs.existsSync(publicFile)) {
      return res.status(200).sendFile(publicFile);
    }
  } catch {}
  res.status(404).json({ error: 'Data not found' });
});
app.use(
  express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('rss.xml')) {
        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      } else if (filePath.endsWith('sitemap.xml')) {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400');
      } else if (filePath.endsWith('index.html') || filePath.endsWith('site.webmanifest')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.includes(path.sep + 'assets' + path.sep)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      }
    },
  })
);

// Health check endpoint for Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Legacy notice URLs 301 redirect to homepage (matches public/_redirects)
const legacyNotices = ['/notice/93', '/notice/97', '/notice/95', '/notice/354', '/notice/355', '/notice/118'];
app.get(legacyNotices, (_req, res) => {
  res.redirect(301, '/');
});

// Explicit RSS and Feed endpoints (serves valid XML feed directly without SPA fallback)
app.get(['/rss', '/rss.xml', '/feed', '/feed.xml'], (_req, res) => {
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.sendFile(path.join(distPath, 'rss.xml'));
});

app.get('/atom.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.sendFile(path.join(distPath, 'atom.xml'));
});

// Single Page Application (SPA) fallback to index.html
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(distPath, 'index.html'));
});

const startServer = (port: number) => {
  const server = app.listen(port, HOST, () => {
    console.log(`Production server running at http://${HOST}:${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE' && port !== 3000) {
      console.warn(`Port ${port} is in use, falling back to port 3000...`);
      startServer(3000);
    } else {
      console.error('Server listen error:', err);
    }
  });

  // Graceful shutdown for Cloud Run container lifecycle
  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer(PORT);
