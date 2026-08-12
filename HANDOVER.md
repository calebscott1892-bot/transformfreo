# Transform Fremantle — handover runbook

Everything needed to move this website into Transform Fremantle's own accounts,
and to keep it running afterwards.

This document is for whoever is doing the transfer. The people who will edit the
website day-to-day don't need it — they need `EDITING-GUIDE.md`.

---

## 1. What the website is built from

| Piece | What it is |
| --- | --- |
| Code | A React site built with Vite. Source lives in `src/`. |
| Hosting | Vercel. Every push to the `main` branch redeploys the live site. |
| Code repository | GitHub — `c4studios/transformfreo`, public, default branch `main`. |
| Domain + DNS | Cloudflare (registrar **and** nameservers). |
| Contact form email | Resend, called from `api/send-email.js`. |
| Website editor | Sveltia CMS at `/admin`, signing in through GitHub. |

Content is not in a database. Every word on the site lives in JSON files under
`src/content/`, and the editor at `/admin` writes to those files. A save is a
commit, and a commit triggers a deploy. Nothing is lost or hidden — the full
history of every edit is in the repository.

### Where each page's words live

| Page | File |
| --- | --- |
| About Us (home) | `src/content/about.json` |
| Statement of Faith | `src/content/statement-of-faith.json` |
| Vision & Aim | `src/content/vision.json` |
| Resources (wording) | `src/content/resources.json` |
| Connect | `src/content/connect.json` |
| Header, footer, menu, logo | `src/content/site.json` |
| Resource booklet list | `src/resources/resources.overrides.json` |

Photos live in `public/images/`. Booklet PDFs live in `public/files/`. The
original full-resolution logo is kept at `public/brand/logo-1024.png` for print
and social use.

---

## 2. Accounts to move

Five accounts matter. Losing any one of them costs something specific.

| Account | Currently | What breaks without it |
| --- | --- | --- |
| GitHub | `c4studios` | The code, the edit history, and the editor login. |
| Vercel | C4 Studios | The site stops being deployed and served. |
| Cloudflare | C4 Studios | The domain itself, and the DNS that points it at the site. |
| Resend | C4 Studios | The contact form silently stops delivering email. |
| Base44 | Original build platform | Nothing. The site no longer calls it — see §7. |

**The domain renews on 6 December 2026.** Registered 6 December 2025 through
Cloudflare. Make sure it is on auto-renew in whichever account ends up holding
it, and that the card on file is one the client controls. A lapsed domain is the
one failure here that is genuinely hard to walk back.

---

## 3. Before you start

Have the client create these first, using an address that outlives any one
volunteer. A shared inbox like `transformfreo@gmail.com` is better than a
personal one.

- A GitHub account.
- A Vercel account, signed in **with that GitHub account**.
- A Cloudflare account.
- A Resend account.

Have them turn on two-factor authentication on all four before anything is
transferred into them.

Set aside about an hour. Don't start on a day when someone needs to edit the
site.

---

## 4. The transfer, in order

The order matters. The domain moves last, so the new setup is proven before
anything the public can see depends on it.

### Step 1 — Move the code repository

1. In GitHub, open `c4studios/transformfreo` → **Settings** → scroll to the
   **Danger Zone** → **Transfer ownership**.
2. Transfer to the client's GitHub account.
3. Ask the client to accept the transfer from their email.

GitHub leaves a redirect behind, so old links keep working. Don't rely on it.
Update your own local copy:

```bash
git remote set-url origin https://github.com/<new-owner>/transformfreo
```

> Worth knowing: this repo's local remote still points at
> `calebscott1892-bot/transformfreo`, an earlier name. It only works because of
> that redirect. Fix it at the same time.

### Step 2 — Point the CMS at the new repository

One line in `public/admin/config.yml` names the repository:

```yaml
backend:
  name: github
  repo: c4studios/transformfreo    # <- change to the new owner
```

Change it, commit, push. The editor at `/admin` will not save without this.

### Step 3 — Stand up hosting in the client's Vercel account

Build the new deployment alongside the old one. Don't touch the live site yet.

1. In the client's Vercel account, **Add New → Project**, and import the
   transferred GitHub repository.
2. Leave the build settings alone. Vercel detects Vite. The build command is
   `npm run build` and the output directory is `dist`.
3. Add these environment variables (**Settings → Environment Variables**), for
   Production, Preview and Development:

   | Name | Value | Required |
   | --- | --- | --- |
   | `RESEND_API_KEY` | From the client's Resend account, step 4 | Yes |
   | `CONTACT_TO_EMAIL` | Where form messages go. Defaults to `transformfreo@gmail.com` | No |
   | `CONTACT_FROM_EMAIL` | Defaults to `Transform Fremantle <noreply@transformfreo.com>` | No |
   | `GITHUB_OAUTH_CLIENT_ID` | From step 5 | Yes, for `/admin` |
   | `GITHUB_OAUTH_CLIENT_SECRET` | From step 5 | Yes, for `/admin` |
   | `GITHUB_OAUTH_SCOPE` | See step 5 | No |

4. Deploy. You'll get a `something.vercel.app` address. Check the site loads
   there before going further.

### Step 4 — Move the contact form email

1. In the client's Resend account, add and verify the domain
   `transformfreo.com`. Resend gives you DNS records to add; add them in
   Cloudflare.
2. Create an API key and put it in Vercel as `RESEND_API_KEY`.
3. Redeploy, then send yourself a test message through the Connect page on the
   `.vercel.app` address.

`CONTACT_FROM_EMAIL` has to be a sender Resend has verified for that domain, or
delivery fails. The visitor's own address is set as Reply-To, so replying from
the inbox goes back to them.

### Step 5 — Turn on the website editor

The editor signs in through GitHub. That needs a GitHub OAuth App, owned by
whoever owns the repository.

1. In the client's GitHub account: **Settings → Developer settings → OAuth Apps
   → New OAuth App**.
2. Fill it in:
   - **Application name:** `Transform Fremantle Website Editor`
   - **Homepage URL:** `https://transformfreo.com`
   - **Authorization callback URL:** `https://transformfreo.com/api/callback`
3. Register it, then **Generate a new client secret**. The secret is shown once.
4. Put the Client ID and secret into Vercel as `GITHUB_OAUTH_CLIENT_ID` and
   `GITHUB_OAUTH_CLIENT_SECRET`. Redeploy.

**On scope.** By default the editor asks GitHub for `repo` access, which covers
public and private repositories. While this repository stays public you can
tighten that: set `GITHUB_OAUTH_SCOPE` to `public_repo` in Vercel. That limits
the editor's access to public repositories only, which is less access to an
editor's personal GitHub account. If the repository is ever made private,
change it back to `repo` or the editor will start failing to load content.

**A GitHub OAuth App allows one callback URL.** The one above is the live
domain, so `/admin` works on `transformfreo.com` and not on preview
deployments. If you want the editor working on a preview URL, make a second
OAuth App for it.

### Step 6 — Move the domain, last

Both the registration and the DNS sit in Cloudflare, so this is one move.

1. In the client's Vercel project: **Settings → Domains**, add
   `transformfreo.com` and `www.transformfreo.com`. Vercel will show the DNS
   records it expects.
2. Move the domain into the client's Cloudflare account. Cloudflare's own
   documentation covers moving a domain between Cloudflare accounts — follow
   their current instructions, as the steps change from time to time.
3. Once the zone is in the client's account, point the records at the new Vercel
   project using the values Vercel showed you.
4. Turn **auto-renew on**, with the client's payment details.

DNS changes take up to a few hours to settle. Watch the live site until it is
serving from the new project.

### Step 7 — Close the loop

- Load `https://transformfreo.com` and click through all five pages.
- Sign in at `https://transformfreo.com/admin`, make a small edit, save, and
  confirm it appears on the site a minute or two later.
- Send a test message through the Connect form and confirm it arrives.
- Download one booklet from the Resources page.
- Only then, delete the old Vercel project. Keep the old GitHub access until
  everyone is satisfied.

---

## 5. Giving someone edit access

To let a volunteer edit the site:

1. They need a GitHub account.
2. In the repository: **Settings → Collaborators** → add them with **Write**
   access.
3. Send them `EDITING-GUIDE.md` and the `/admin` address.

To remove someone, remove them as a collaborator. Their access stops
immediately.

---

## 6. Running costs

| Thing | Cost |
| --- | --- |
| Domain | About AU$15–20 a year through Cloudflare, due 6 December. |
| Cloudflare DNS | Free. |
| Vercel | Free on the Hobby plan, which this site sits well inside. |
| GitHub | Free for a public repository. |
| Resend | Free tier covers a few thousand emails a month. |

The only bill with a hard deadline is the domain.

---

## 7. Things already dealt with

Recorded here so nobody goes looking for problems that are already fixed.

- **Base44 is out of the picture.** The site was originally generated on Base44.
  `src/api/base44Client.js` is now a stub that throws if anything calls it, and
  nothing does. No Base44 account is needed.
- **The images are ours now.** The logo and all five banner photos used to be
  hotlinked from a Supabase bucket belonging to Base44. If that bucket had been
  cleared, the site would have lost its logo and every banner. They now live in
  `public/images/` in this repository. They were also re-encoded on the way in,
  which took the image payload from 2.18 MB down to 543 kB.
- **The editor is not loaded from a CDN.** `@sveltia/cms` is pinned in
  `package.json` and copied into `public/admin/` at build time by
  `scripts/sync-cms.mjs`. The editor is served from this site's own domain, so
  no outside service can change it or take it away.

---

## 8. Routine jobs

**Update the editor.** Bump the `@sveltia/cms` version in `package.json`, run
`npm install`, and push. Check `/admin` still loads before you leave it.

**Add a booklet.** Easiest through `/admin` → Resource booklets. By hand: drop
the PDF in `public/files/` and add an entry to
`src/resources/resources.overrides.json`. The build hashes the file and adds a
`?v=` to its URL, so a replaced PDF is never served stale from cache.

**A PDF in `public/files/` that isn't in the booklet list won't show on the
site.** The build prints a note when that happens. This is deliberate, so the
list in the editor matches what visitors see.

**Run it locally.**

```bash
npm install
npm run dev
```

The editor at `/admin` will offer "Work with Local Repository", which edits your
working copy directly without touching GitHub.

---

## 9. When something goes wrong

**`/admin` shows "The editor login isn't configured yet".**
`GITHUB_OAUTH_CLIENT_ID` or `GITHUB_OAUTH_CLIENT_SECRET` is missing in Vercel.
Add it and redeploy.

**Signing in fails, or the popup closes with an error.** Usually the OAuth App's
callback URL doesn't exactly match `https://transformfreo.com/api/callback`.
Check it character for character.

**Signing in works, but no content appears.** The GitHub account probably lacks
write access to the repository, or `repo:` in `public/admin/config.yml` is
pointing at the wrong place.

**An edit saved but the site hasn't changed.** A deploy takes a minute or two.
If it's been longer, check the Deployments tab in Vercel for a failed build.

**The contact form reports it couldn't send.** Check `RESEND_API_KEY` is set,
and that the address in `CONTACT_FROM_EMAIL` is still verified in Resend.

**The site is gone entirely.** Check the domain hasn't expired, then check
Vercel. The site can be redeployed from the repository at any time, so as long
as GitHub and the domain are intact, nothing is lost.
