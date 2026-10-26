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
const publicUploads = path.join(__dirname, 'public', 'uploads');
const distUploads = path.join(distPath, 'uploads');

// Serve uploaded files statically
app.use('/uploads', express.static(publicUploads));
app.use('/uploads', express.static(distUploads));

// Admin File Upload API: Saves uploaded logo images permanently
app.post('/api/admin/upload-file', (req, res) => {
  try {
    const { fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No file data provided' });
    }

    let ext = '.png';
    let base64Content = fileData;

    const publicUploadPath = path.join(__dirname, 'public', 'uploads', 'logos');
    const distUploadPath = path.join(distPath, 'uploads', 'logos');
    fs.mkdirSync(publicUploadPath, { recursive: true });
    fs.mkdirSync(distUploadPath, { recursive: true });

    if (fileData.startsWith('data:image/svg+xml')) {
      ext = '.svg';
      const commaIdx = fileData.indexOf(',');
      const raw = fileData.slice(commaIdx + 1);
      const text = fileData.includes(';base64,') ? Buffer.from(raw, 'base64').toString('utf-8') : decodeURIComponent(raw);
      const safeName = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.svg`;
      fs.writeFileSync(path.join(publicUploadPath, safeName), text, 'utf-8');
      fs.writeFileSync(path.join(distUploadPath, safeName), text, 'utf-8');
      return res.status(200).json({ success: true, url: `/uploads/logos/${safeName}` });
    } else if (fileData.startsWith('data:image/')) {
      const match = fileData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        ext = match[1] === 'jpeg' ? '.jpg' : `.${match[1]}`;
        base64Content = match[2];
      }
    }

    const safeName = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
    const buffer = Buffer.from(base64Content, 'base64');

    fs.writeFileSync(path.join(publicUploadPath, safeName), buffer);
    fs.writeFileSync(path.join(distUploadPath, safeName), buffer);

    return res.status(200).json({ success: true, url: `/uploads/logos/${safeName}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

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

    // Persist to source code fixedLogos.ts so non-logged-in users and rebuilds get the exact logos
    if (Array.isArray(data.logos) && data.logos.length > 0) {
      try {
        const cleaned = data.logos.map((l: any) => ({ logoUrl: l.logoUrl }));
        const fixedLogosFile = path.join(__dirname, 'src', 'data', 'fixedLogos.ts');
        const logosCode = `import { InternationalLogoItem } from "../types";\n\nexport const FIXED_INTERNATIONAL_LOGOS: InternationalLogoItem[] = ${JSON.stringify(cleaned, null, 2)};\n`;
        fs.writeFileSync(fixedLogosFile, logosCode, 'utf-8');
      } catch (e) {
        console.warn('Could not write to fixedLogos.ts:', e);
      }
    }

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
