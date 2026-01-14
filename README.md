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

The Resources page links to PDFs served from `public/resources/`:

- `public/resources/confession-repentance-and-forgiveness-of-sin.pdf`
- `public/resources/lessons-from-past-revivals.pdf`
- `public/resources/orderly-worship-and-the-use-of-spiritual-gifts.pdf`
- `public/resources/what-is-salvation-and-what-should-i-do-next.pdf`

**Preferred workflow (no code change):** replace the four PDF files locally using the exact same filenames, then commit and redeploy.

## Building the app

```bash
npm run build
```

For more information and support, please contact Base44 support at app@base44.com.