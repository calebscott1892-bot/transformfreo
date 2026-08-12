# Transform Fremantle

The website for Transform Fremantle — transformfreo.com

A Vite + React site deployed on Vercel. Content is edited through a CMS at
`/admin` that writes JSON files back to this repository.

- **Editing the site?** Read [EDITING-GUIDE.md](EDITING-GUIDE.md).
- **Moving the site between accounts, or fixing something?** Read
  [HANDOVER.md](HANDOVER.md).

---

## Running it locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173`. The editor at `/admin` offers **Work
with Local Repository**, which edits your working copy without touching GitHub.

```bash
npm run build     # production build into dist/
npm run lint
```

---

## How content works

No database. Every word on the site is in a JSON file, and the CMS at `/admin`
edits those files. A save is a commit; a commit is a deploy.

| Page | File |
| --- | --- |
| About Us (home) | `src/content/about.json` |
| Statement of Faith | `src/content/statement-of-faith.json` |
| Vision & Aim | `src/content/vision.json` |
| Resources (wording) | `src/content/resources.json` |
| Connect | `src/content/connect.json` |
| Header, footer, menu, logo | `src/content/site.json` |

Pages under `src/pages/` import their JSON directly and render it. Layout,
styling and routing stay in code, so a content edit can't break the design or
the navigation.

Icons offered in the CMS dropdowns are registered in `src/content/icons.js`.
Adding one means adding it there and to the matching `options:` list in
`public/admin/config.yml`.

## The CMS

[Sveltia CMS](https://github.com/sveltia/sveltia-cms), configured in
`public/admin/config.yml`.

The bundle is pinned in `package.json` and copied into `public/admin/` by
`scripts/sync-cms.mjs`, which runs before `dev` and `build`. It's served from
this site's own domain rather than a CDN, and it's gitignored because the
version is already pinned.

Login goes through GitHub via two serverless functions, `api/auth.js` and
`api/callback.js`. They need `GITHUB_OAUTH_CLIENT_ID` and
`GITHUB_OAUTH_CLIENT_SECRET` set in Vercel. See HANDOVER.md §5.

## Resource PDFs

PDFs live in `public/files/`. Don't hardcode PDF URLs in components.

`src/resources/resources.overrides.json` is the published list — it sets each
booklet's title and the order they appear in. The build then:

- `npm run resources:generate` — scans `public/files/`, applies the list, writes
  `src/resources/resources.manifest.json`
- `npm run resources:verify` — fails the build if the manifest, the files and
  the links disagree

Both run automatically via `prebuild`.

URLs come out as `/files/<name>.pdf?v=<hash>`, where the hash is derived from
the file's contents. Replacing a PDF with the same filename still busts every
cache.

A PDF in `public/files/` that isn't in the list is kept in the manifest but
marked deprecated, so it stays off the site. The build prints a note when that
happens.

## Environment variables

Set in Vercel. See HANDOVER.md for where each value comes from.

| Name | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Contact form delivery. Required. |
| `CONTACT_TO_EMAIL` | Where form messages go. Defaults to `transformfreo@gmail.com`. |
| `CONTACT_FROM_EMAIL` | Must be verified in Resend. |
| `GITHUB_OAUTH_CLIENT_ID` | CMS login. Required for `/admin`. |
| `GITHUB_OAUTH_CLIENT_SECRET` | CMS login. Required for `/admin`. |
| `GITHUB_OAUTH_SCOPE` | Defaults to `repo`. See HANDOVER.md §5. |

## Assets

`public/images/` holds the logo and banner photos, and is the CMS media folder.
`public/brand/logo-1024.png` is the full-resolution logo, kept out of the media
picker so it doesn't get chosen for the web by mistake.

## SPA routing

`vercel.json` rewrites unmatched paths to `/` so refreshing a route like
`/Connect` doesn't 404. `/admin` and `/api/*` are excluded from that rewrite.
