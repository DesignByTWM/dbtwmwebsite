# Design By TWM — Coming Soon Page + Lead Form

## Structure
- `public/index.html` — the coming soon page (hero slideshow, logo, monogram, services, lead form)
- `api/submit-request.js` — Vercel serverless function that sends form submissions via Resend
- `package.json` — declares the `resend` dependency

## Deploy (Vercel)
1. Push this folder to a GitHub repo (or drop it directly into the existing `vercel.com/design-by-twm` project).
2. In Vercel → Project Settings → Environment Variables, add:
   - `RESEND_API_KEY` — your Resend API key
   - `RESEND_FROM` — a verified sender address on your Resend domain, e.g. `Design By TWM <noreply@designbytwm.com>`
   - `RESEND_TO` — the inbox that should receive leads, e.g. `info@designbytwm.com`
3. Deploy. Vercel auto-detects `public/` as the static site and `api/` as serverless functions — no extra config needed.

## What I need from you
- Confirm `designbytwm.com` (or the subdomain you're sending from) is a **verified domain** in Resend — unverified domains will get emails blocked or spam-filtered.
- Your Resend API key (paste it only into Vercel's environment variables, never in chat or in the code).
- Confirm the inbox that should receive leads (defaulting to `info@designbytwm.com` unless you say otherwise).
- Confirm it's OK to deploy this into the existing `vercel.com/design-by-twm` project, or if it should go elsewhere.
