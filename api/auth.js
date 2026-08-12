import crypto from 'crypto';

// Step 1 of the website editor login.
//
// The editor at /admin opens this in a popup. We hand the visitor off to GitHub
// to approve access, carrying a one-time `state` value that api/callback.js
// checks on the way back. That check is what stops a third-party page from
// walking someone through a login it started itself.
//
// Required environment variables (set in Vercel → Settings → Environment Variables):
//   GITHUB_OAUTH_CLIENT_ID
//   GITHUB_OAUTH_CLIENT_SECRET   (used by api/callback.js)
// Optional:
//   GITHUB_OAUTH_SCOPE           (defaults to "repo")

const STATE_COOKIE = 'cms_oauth_state';

export function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export function sendSetupError(res, message) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Editor login not configured</title>` +
      `<style>body{font:16px/1.6 ui-sans-serif,system-ui,sans-serif;max-width:34rem;margin:12vh auto;padding:0 1.5rem;color:#1e3a5f}` +
      `code{background:#f1f5f9;padding:.15em .4em;border-radius:4px;font-size:.9em}</style></head><body>` +
      `<h1>The editor login isn't configured yet</h1><p>${message}</p>` +
      `<p>Setting this up is a one-off job. The steps are in <code>HANDOVER.md</code> in the website's code repository.</p>` +
      `</body></html>`
  );
}

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return sendSetupError(
      res,
      'The site is missing its GitHub login details, so the editor cannot sign anyone in.'
    );
  }

  const origin = getOrigin(req);
  const state = crypto.randomBytes(24).toString('hex');
  const scope = process.env.GITHUB_OAUTH_SCOPE || 'repo';

  // Short-lived, HttpOnly so page scripts can't read it. Lax still arrives on
  // GitHub's top-level redirect back to /api/callback.
  res.setHeader(
    'Set-Cookie',
    `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', `${origin}/api/callback`);
  authorizeUrl.searchParams.set('scope', scope);
  authorizeUrl.searchParams.set('state', state);

  res.statusCode = 302;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Location', authorizeUrl.toString());
  res.end();
}
