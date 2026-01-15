# Base44 App


This app was created automatically by Base44.
It's a Vite+React app that communicates with the Base44 API.

## Running the app

```bash
npm install
npm run dev
```

## Deployment (Vercel)

### SPA routing (no 404 on refresh)

This project is a Vite/React SPA. The repo includes a `vercel.json` rewrite so that refreshing routes like `/Connect` never returns 404.

### Contact form email (serverless)

The contact form posts to a Vercel Serverless Function at `/api/send-email`.

**Required Vercel environment variables**

- `RESEND_API_KEY` (required)
- `CONTACT_TO_EMAIL` (optional, defaults to `transformfreo@gmail.com`)
- `CONTACT_FROM_EMAIL` (optional, defaults to `Transform Fremantle <noreply@transformfreo.com>`)

Notes:

- `CONTACT_FROM_EMAIL` must be a sender identity verified in Resend.
- User email is set as `Reply-To` for safe deliverability.

## Updating Resource PDFs

The Resources page links to PDFs served from `public/files/` (static Vite hosting).

### Source of truth

- Drop new PDFs into `public/files/`.
- Do not hardcode PDF URLs in React components.
- The site renders resources from a single generated manifest: `src/resources/resources.manifest.json`.

### Automatic manifest + verification

The build runs these steps automatically via `prebuild`:

- `npm run resources:generate` (scans `public/files/**/*.pdf` and generates `src/resources/resources.manifest.json`)
- `npm run resources:verify` (fails the build if links/manifest/files are inconsistent)

You can run them manually:

```bash
npm run resources:generate
npm run resources:verify
```

### Resource versioning / cache busting policy

- Resource URLs are generated as `/files/<filename>.pdf?v=<hashprefix>`.
- The `v=` value is derived from a content hash, so it changes whenever the PDF contents change.
- This makes the URL immutable for caches (browser/CDN), even if you overwrite a file with the same filename.

Recommendation (optional): consider adding a date suffix to filenames for human clarity, e.g. `my-resource-2026-01.pdf`.

## Building the app

```bash
npm run build
```

For more information and support, please contact Base44 support at app@base44.com.