# Deploy ke Cloudflare Pages

## Arsitektur

- **Frontend statis**: `dist/` (hasil `vite build`) — disajikan oleh Pages CDN.
- **API**: `functions/api/claude.js` — Pages Function (Workers runtime). Otomatis di-route ke `/api/claude`.

Tidak ada `vercel.json`, tidak ada folder `api/` lagi. Semua serverless masuk `functions/`.

## Pertama kali — connect repo

1. Push repo ini ke GitHub/GitLab.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pilih repo. Konfigurasi build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (kosongkan)
4. Sebelum klik **Save and Deploy**, buka **Environment variables** → tambahkan:
   - Name: `ANTHROPIC_API_KEY` — Value: `sk-ant-...` (production secret).
   - (Opsional) `ALLOWED_ORIGINS` — comma-separated, contoh: `https://mindful.example.com`.
5. **Save and Deploy**. Build pertama jalan ~1-2 menit.

Setelah live, app ada di `https://<project>.pages.dev`. Endpoint `/api/claude` otomatis aktif.

## Update env var setelah deploy

Cloudflare Dashboard → Pages project → **Settings** → **Variables and Secrets** → tambahkan untuk **Production** dan/atau **Preview**. Klik **Save** lalu **Retry deployment** kalau butuh aktif segera.

## Domain custom

**Settings** → **Custom domains** → **Set up a custom domain**. Cloudflare otomatis kelola SSL & DNS kalau domainmu ada di Cloudflare. Kalau domain di registrar lain, ikuti instruksi CNAME yang muncul.

## Local dev

`npm run dev` — masih jalan seperti biasa. Vite middleware (`claudeApiDev` di [vite.config.js](vite.config.js)) mem-bridge handler Workers ke Node req/res, jadi kode `functions/api/claude.js` yang sama yang dijalankan lokal & production.

API key lokal: `.env.local` di root, isi `ANTHROPIC_API_KEY=sk-ant-...`. File ini di-gitignore.

## Catatan teknis

- **SSE streaming** — Cloudflare Workers nggak punya hard timeout untuk streaming response. Heartbeat tiap 5 detik di stream tetap penting buat anti-buffer di proxy/CDN intermediate.
- **Origin allowlist** — di [functions/api/claude.js](functions/api/claude.js) `isAllowedOrigin()` allow `*.pages.dev`, `localhost`, dan `ALLOWED_ORIGINS` env. Kalau pakai custom domain, tambahkan ke `ALLOWED_ORIGINS`.
- **Bundle size** — Cloudflare Pages Functions punya limit 1 MiB per Worker (compressed). `@anthropic-ai/sdk` masih jauh di bawah limit.
- **Wrangler (opsional)** — kalau mau dev pakai Wrangler runtime asli (`wrangler pages dev dist --compatibility-date=2025-01-01`), buat `.dev.vars` dengan format yang sama seperti `.env.local`. Tidak wajib — Vite mirror sudah cukup untuk dev sehari-hari.
