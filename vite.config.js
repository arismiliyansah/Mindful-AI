import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Local-dev shim: serves /api/claude using the same Workers-style handler that
// runs in production on Cloudflare Pages Functions. Re-reads .env.local on every
// request so key rotation works without restart. Translates Node req/res ↔ Web
// Request/Response so the handler code is identical to production.
function claudeApiDev() {
  return {
    name: 'claude-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/claude', async (req, res) => {
        let apiKey = process.env.ANTHROPIC_API_KEY || '';
        try {
          const envPath = path.join(server.config.root, '.env.local');
          if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, 'utf8');
            const m = raw.match(/^ANTHROPIC_API_KEY\s*=\s*(.*)$/m);
            if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, '');
          }
        } catch { /* ignore — handler will surface missing-key error */ }

        let raw = '';
        for await (const chunk of req) raw += chunk;

        const proto = (req.socket && req.socket.encrypted) ? 'https' : 'http';
        const url = `${proto}://${req.headers.host || 'localhost'}${req.url || '/'}`;
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) {
          if (Array.isArray(v)) headers.set(k, v.join(', '));
          else if (v != null) headers.set(k, String(v));
        }
        const request = new Request(url, {
          method: req.method,
          headers,
          body: raw || undefined,
        });

        const env = { ANTHROPIC_API_KEY: apiKey, ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '' };
        const { onRequest } = await server.ssrLoadModule('/functions/api/claude.js');
        const response = await onRequest({ request, env });

        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));

        if (!response.body) { res.end(); return; }
        const reader = response.body.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            res.write(Buffer.from(value));
          }
        } finally {
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), claudeApiDev()],
});
