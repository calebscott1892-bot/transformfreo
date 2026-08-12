import { getOrigin, sendSetupError } from './auth.js';

// Step 2 of the website editor login.
//
// GitHub sends the visitor back here with a short-lived code. We swap that code
// for an access token server-side (so the client secret never reaches the
// browser) and hand the token to the editor window that opened this popup.
//
// The handshake below is the one Decap/Netlify CMS established and Sveltia CMS
// follows: the popup announces itself, the opener replies, and only then is the
// token posted back — to this site's own origin, never to "*".

const STATE_COOKIE = 'cms_oauth_state';

function readCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

function clearStateCookie(res) {
  res.setHeader('Set-Cookie', `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

// Escaped so nothing embedded in the payload can close the <script> element.
function toInlineJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function sendResult(res, origin, status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Signing in…</title>` +
      `<style>body{font:16px/1.6 ui-sans-serif,system-ui,sans-serif;text-align:center;margin:12vh 1.5rem;color:#1e3a5f}</style>` +
      `</head><body><p>Signing you in…</p><script>(function(){` +
      `var message=${toInlineJson(message)};` +
      `var target=${toInlineJson(origin)};` +
      `if(!window.opener){document.body.innerHTML='<p>Please close this window and try signing in again.</p>';return;}` +
      `function onMessage(e){` +
      `if(e.origin!==target)return;` +
      `window.removeEventListener('message',onMessage,false);` +
      `window.opener.postMessage(message,target);` +
      `setTimeout(function(){window.close();},250);` +
      `}` +
      `window.addEventListener('message',onMessage,false);` +
      `window.opener.postMessage('authorizing:github',target);` +
      `})();</script></body></html>`
  );
}

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return sendSetupError(
      res,
      'The site is missing its GitHub login details, so the editor cannot complete a sign in.'
    );
  }

  const origin = getOrigin(req);
  const url = new URL(req.url, origin);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const expectedState = readCookie(req, STATE_COOKIE);

  clearStateCookie(res);

  // The visitor declined on GitHub's approval screen.
  const oauthError = url.searchParams.get('error');
  if (oauthError) {
    return sendResult(res, origin, 'error', {
      message: url.searchParams.get('error_description') || oauthError
    });
  }

  if (!code) {
    return sendResult(res, origin, 'error', { message: 'GitHub did not return a login code.' });
  }

  if (!expectedState || !returnedState || expectedState !== returnedState) {
    return sendResult(res, origin, 'error', {
      message: 'This login could not be verified. Please close the window and sign in again.'
    });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/callback`
      })
    });

    const data = await tokenRes.json().catch(() => ({}));

    if (!tokenRes.ok || data.error || !data.access_token) {
      return sendResult(res, origin, 'error', {
        message: data.error_description || data.error || 'GitHub refused the sign in.'
      });
    }

    return sendResult(res, origin, 'success', {
      token: data.access_token,
      provider: 'github'
    });
  } catch {
    return sendResult(res, origin, 'error', {
      message: 'Could not reach GitHub to complete the sign in. Please try again.'
    });
  }
}
