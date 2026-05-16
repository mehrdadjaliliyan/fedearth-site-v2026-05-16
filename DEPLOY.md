# Federation of Earth — Deployment Guide

This is a standard Next.js 14 (App Router) site. It is **zero-config**: it
deploys with no API keys, no SMTP credentials, no database. All forms still
deliver to `contact@fedearth.org` thanks to a built-in mailto fallback.

---

## 1. Quick deploy (no keys needed)

Recommended: **Vercel** or **Netlify**. Both auto-detect Next.js.

### Vercel

1. Create a Vercel account at https://vercel.com (free hobby plan is fine).
2. Push this folder to a GitHub repo (or drag-and-drop the folder into Vercel).
3. Vercel auto-detects Next.js — click **Deploy**. No env vars needed.
4. Add your custom domain in **Settings → Domains** (point `fedearth.org`'s
   DNS at the values Vercel shows).

### Netlify

1. Sign up at https://netlify.com (free tier).
2. Drag the folder onto the dashboard, or connect a GitHub repo.
3. Build command: `npm run build` · Publish directory: `.next` ·
   the Next.js plugin handles the rest.

### Cloudflare Pages

1. Connect the repo.
2. Framework preset: **Next.js**. Build command: `npm run build`.
3. Deploy.

---

## 2. How forms work without any keys

Forms on `/contact`, `/auth/register`, and the homepage newsletter all POST to
`/api/applications`. That endpoint:

1. **If SMTP environment variables are present** → sends a real email via
   nodemailer to `contact@fedearth.org`. User sees a success screen.
2. **If SMTP is NOT configured (default)** → returns the message body and the
   client opens the visitor's email app pre-filled to `contact@fedearth.org`
   with subject + body already typed. The visitor just hits **Send**.

In both modes the message reaches the inbox. The mailto fallback works on
every browser, every host, with zero configuration.

---

## 3. Optional upgrade — real SMTP delivery

If you want forms to send silently (no email-app pop-up for the visitor), add
SMTP credentials to your host's environment-variable panel. Pick **one**
provider:

### Option A · Resend (easiest, free tier 100/day)

1. Sign up at https://resend.com.
2. Add domain `fedearth.org` and paste the DNS records they show into your DNS
   provider (SPF + DKIM, 2-3 TXT records).
3. Create an API key.
4. Add these to Vercel/Netlify/Cloudflare → Environment Variables:

```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=<paste API key>
SMTP_FROM=Federation of Earth <no-reply@fedearth.org>
APPLICATIONS_INBOX=contact@fedearth.org
```

5. Redeploy.

### Option B · Your existing email provider's SMTP

Most mailbox providers (Google Workspace, Microsoft 365, Infomaniak, Proton,
etc.) expose SMTP for outgoing mail. Use that mailbox's SMTP host / username
/ app-password. Same four `SMTP_*` env vars above — only the values change.

### Option C · Other relays

Postmark (`smtp.postmarkapp.com`), SendGrid (`smtp.sendgrid.net`), Mailgun
(`smtp.mailgun.org`) all work — same shape, different host name.

---

## 4. Optional · Supabase (member accounts + voting)

The marketing site works fully without a database. To turn on the platform
features (member sign-in, dashboard, voting, communities, proposals) you need
a Supabase project. Add to env vars:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key>
```

When these are missing, the public site still works perfectly and the membership
form falls back to email-only mode.

---

## 5. Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run build && npm run start` to test the production bundle locally.

---

## 6. What's included

- Cinematic homepage (Framer Motion + Lenis smooth scroll, animated globe,
  parallax hero, scroll-triggered reveals).
- All marketing pages: mandate, programs, governance, platform, principles,
  leadership, support, membership path, newsletter.
- `/links` — social media for Ali Mizani Oskui (Chairman).
- `/contact` — multi-kind form (contact / partner / donor) with auto-mailto.
- `/auth/register` — membership application form with auto-mailto.
- `/donate`, `/join`, `/impact`, `/transparency`, `/legal` pages.
- Authenticated platform shell (dashboard, communities, proposals) — gated
  behind Supabase config.

That's it. Deploy and it works.
