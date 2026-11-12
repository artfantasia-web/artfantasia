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

// Serve uploaded assets statically
app.use('/uploads', express.static(publicUploads));
app.use('/uploads', express.static(distUploads));

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

// Explicit robots.txt endpoint for search crawlers (Naver Yeti, Googlebot, etc.)
app.get('/robots.txt', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('X-Robots-Tag', 'all');
  const candidate = path.join(distPath, 'robots.txt');
  const fallback = path.join(__dirname, 'public', 'robots.txt');
  const target = fs.existsSync(candidate) ? candidate : fallback;
  res.sendFile(target);
});

// Explicit Naver verification file endpoint (handles naver*.html directly)
app.get('/naver:code.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('X-Robots-Tag', 'all');
  const fileName = `naver${req.params.code}.html`;
  const candidate = path.join(distPath, fileName);
  const fallback = path.join(__dirname, 'public', fileName);
  if (fs.existsSync(candidate)) return res.sendFile(candidate);
  if (fs.existsSync(fallback)) return res.sendFile(fallback);
  res.status(200).send(`naver-site-verification: ${fileName}\n`);
});

// Explicit LLMs / AI agents context endpoint (llms.txt standard)
app.get(['/llms.txt', '/.well-known/llms.txt'], (_req, res) => {
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'all');
  const candidate = path.join(distPath, 'llms.txt');
  const fallback = path.join(__dirname, 'public', 'llms.txt');
  const target = fs.existsSync(candidate) ? candidate : fallback;
  res.sendFile(target);
});

// Explicit sitemap.xml endpoint
app.get('/sitemap.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('X-Robots-Tag', 'all');
  const candidate = path.join(distPath, 'sitemap.xml');
  const fallback = path.join(__dirname, 'public', 'sitemap.xml');
  const target = fs.existsSync(candidate) ? candidate : fallback;
  res.sendFile(target);
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
  const candidate = path.join(distPath, 'rss.xml');
  const fallback = path.join(__dirname, 'public', 'rss.xml');
  const target = fs.existsSync(candidate) ? candidate : fallback;
  res.sendFile(target);
});

app.get('/atom.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  const candidate = path.join(distPath, 'atom.xml');
  const fallback = path.join(__dirname, 'public', 'atom.xml');
  const target = fs.existsSync(candidate) ? candidate : fallback;
  res.sendFile(target);
});


// Serve dedicated HTML for independent sub-pages if available
const subpages = ['about', 'video', 'audio', 'afanmusic', 'marketing', 'notice', 'inquiry'];
subpages.forEach((page) => {
  app.get([`/${page}`, `/${page}/`], (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const subpageHtml = path.join(distPath, page, 'index.html');
    if (fs.existsSync(subpageHtml)) {
      return res.sendFile(subpageHtml);
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
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
