import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

// Serve static assets with high-performance caching
const distPath = path.join(__dirname, 'dist');
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
