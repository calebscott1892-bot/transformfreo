// Copies the Sveltia CMS bundle out of node_modules and into public/admin/ so
// the editor is served from this site's own domain rather than a public CDN.
//
// The version is pinned in package.json, so the editor only ever changes when
// someone deliberately updates the dependency and redeploys.
//
// Runs automatically before `npm run dev` and `npm run build`.

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const PROJECT_ROOT = process.cwd();
const require = createRequire(import.meta.url);

const DEST_DIR = path.join(PROJECT_ROOT, 'public', 'admin');
const DEST = path.join(DEST_DIR, 'sveltia-cms.js');

function resolveBundle() {
  // The package only exports its ESM entry point, so resolve that and look for
  // the classic-script build sitting beside it. The <script> tag in
  // public/admin/index.html is not a module, so it needs the .js file.
  let entry;
  try {
    entry = require.resolve('@sveltia/cms');
  } catch {
    throw new Error(
      '@sveltia/cms is not installed. Run `npm install` before building.\n' +
        'Without it the website editor at /admin will not load.'
    );
  }

  const candidate = path.join(path.dirname(entry), 'sveltia-cms.js');
  if (!fs.existsSync(candidate)) {
    throw new Error(
      `Found @sveltia/cms but not its browser bundle at ${candidate}.\n` +
        'The package layout may have changed in a newer version.'
    );
  }

  return candidate;
}

const source = resolveBundle();

fs.mkdirSync(DEST_DIR, { recursive: true });

// Skip the copy when the file is already identical, so repeat builds are quiet.
const sourceStat = fs.statSync(source);
if (fs.existsSync(DEST) && fs.statSync(DEST).size === sourceStat.size) {
  console.log(`CMS bundle already current at public/admin/sveltia-cms.js (${Math.round(sourceStat.size / 1024)} kB)`);
} else {
  fs.copyFileSync(source, DEST);
  console.log(`Copied CMS bundle to public/admin/sveltia-cms.js (${Math.round(sourceStat.size / 1024)} kB)`);
}
