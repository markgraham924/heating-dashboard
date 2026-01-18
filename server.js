import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Get HA configuration
const HA_URL = process.env.VITE_HA_URL || 'http://192.168.0.208:8123';
const HA_TOKEN = process.env.VITE_HA_TOKEN;

console.log('Starting proxy server...');
console.log('HA URL:', HA_URL);
console.log('HA Token:', HA_TOKEN ? 'SET' : 'MISSING');

// Proxy /api requests to Home Assistant
app.use('/api', createProxyMiddleware({
  target: HA_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // Keep the /api prefix
  },
  onProxyReq: (proxyReq) => {
    // Add authorization header
    if (HA_TOKEN) {
      proxyReq.setHeader('Authorization', `Bearer ${HA_TOKEN}`);
    }
    console.log(`[Proxy] ${proxyReq.method} ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req) => {
    console.log(`[Proxy] Response ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy] Error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Serve static files from dist
const distPath = join(__dirname, 'dist');
app.use(express.static(distPath));

// Generate config.js with runtime environment variables
app.get('/config.js', (req, res) => {
  const config = `
window.ENV = {
  VITE_HA_URL: '${HA_URL}',
  VITE_HA_TOKEN: '${HA_TOKEN || ''}'
};
console.log('Runtime config injected:', window.ENV.VITE_HA_URL ? 'HA_URL set' : 'HA_URL missing', window.ENV.VITE_HA_TOKEN ? 'Token set' : 'Token missing');
  `.trim();
  
  res.setHeader('Content-Type', 'application/javascript');
  res.send(config);
});

// Fallback to index.html for client-side routing - must be last
app.use((req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Proxying /api requests to ${HA_URL}`);
});
