import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

const PROJECT_ROOT = process.cwd();

const candidateResourcesRoots = [
  path.join(PROJECT_ROOT, 'public', 'files'),
  path.join(PROJECT_ROOT, 'files'),
];

function findFirstExistingDir(paths) {
  for (const p of paths) {
    try {
      if (fs.statSync(p).isDirectory()) return p;
    } catch {
      // ignore
    }
  }
  return null;
}

function titleCase(text) {
  return String(text)
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function deriveDisplayName(filename) {
  const base = filename.replace(/(\.pdf)+$/i, '');
  const normalized = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return titleCase(normalized);
}

function isPdf(fileName) {
  return fileName.toLowerCase().endsWith('.pdf');
}

function listPdfFilesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listPdfFilesRecursively(full));
    } else if (entry.isFile() && isPdf(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

function computePublicUrlPath(resourcesRoot, absoluteFilePath) {
  const rel = path.relative(resourcesRoot, absoluteFilePath);
  const relPosix = toPosixPath(rel);

  const resourcesRootPosix = toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot));

  if (resourcesRootPosix === 'public/files') return `/files/${relPosix}`;
  if (resourcesRootPosix === 'files') return `/files/${relPosix}`;
  if (resourcesRootPosix === 'public/resources') return `/resources/${relPosix}`;

  // Fallback: assume it's under public/
  if (resourcesRootPosix.startsWith('public/')) {
    return `/${resourcesRootPosix.slice('public/'.length)}/${relPosix}`;
  }

  throw new Error(`Unsupported resources root: ${resourcesRoot}`);
}

function computeRelativePath(resourcesRoot, absoluteFilePath) {
  const rel = path.relative(resourcesRoot, absoluteFilePath);
  return toPosixPath(rel);
}

function getLastModifiedMs(absoluteFilePath) {
  return fs.statSync(absoluteFilePath).mtimeMs;
}

function getGitLastModifiedIso(absoluteFilePath) {
  const rel = path.relative(PROJECT_ROOT, absoluteFilePath);
  try {
    const out = childProcess
      .execSync(`git log -1 --format=%cI -- "${rel.replace(/"/g, '\\"')}"`, {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'ignore'],
      })
      .toString()
      .trim();
    return out || null;
  } catch {
    return null;
  }
}

// Resource titles come from src/resources/resources.overrides.json, which the
// website editor writes to.
//
// Two shapes are accepted:
//   { "items": [ { "filename": "/files/x.pdf", "displayName": "..." } ] }  <- current
//   { "byFilename": { "x.pdf": { "displayName": "..." } } }                <- original
//
// The list form also fixes the order booklets appear in on the Resources page,
// so an editor can drag them into the order they want. Any PDF sitting in
// public/files that nobody has listed still gets published, appended after the
// listed ones with a title derived from its filename.
function loadOverrides() {
  const overridesPath = path.join(PROJECT_ROOT, 'src', 'resources', 'resources.overrides.json');

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
  } catch {
    return { byFilename: {}, order: [] };
  }

  if (!parsed || typeof parsed !== 'object') return { byFilename: {}, order: [] };

  if (Array.isArray(parsed.items)) {
    const byFilename = {};
    const order = [];

    for (const item of parsed.items) {
      if (!item || typeof item.filename !== 'string' || item.filename.trim() === '') continue;

      // The editor's file picker stores a public path (/files/x.pdf); the
      // original hand-written form stored a bare filename. Accept either.
      const filename = path.basename(item.filename);
      byFilename[filename] = item;
      order.push(filename);
    }

    return { byFilename, order };
  }

  const byFilename =
    parsed.byFilename && typeof parsed.byFilename === 'object' ? parsed.byFilename : {};
  return { byFilename, order: [] };
}

const resourcesRoot = findFirstExistingDir(candidateResourcesRoots);
if (!resourcesRoot) {
  console.error(
    `No resources directory found. Checked: ${candidateResourcesRoots.join(', ')}`
  );
  process.exit(1);
}

const pdfPaths = listPdfFilesRecursively(resourcesRoot);

const { byFilename: overridesByFilename, order: overrideOrder } = loadOverrides();

// Listed booklets come first, in the order the editor arranged them. Anything
// found in public/files but not listed follows, sorted by filename.
const orderIndex = new Map(overrideOrder.map((filename, index) => [filename, index]));

const filenamesOnDisk = new Set(pdfPaths.map((p) => path.basename(p)));
const listedButMissing = overrideOrder.filter((filename) => !filenamesOnDisk.has(filename));
if (listedButMissing.length) {
  // Not fatal: a stale row should never take the whole site down on deploy.
  console.warn(
    `Warning: ${listedButMissing.length} booklet(s) are listed in resources.overrides.json ` +
      `but have no PDF in public/files, so they will not appear on the site:\n` +
      listedButMissing.map((f) => `  - ${f}`).join('\n')
  );
}

// Once a booklet list exists, that list is what the website publishes. A PDF
// sitting in public/files that nobody listed stays in the manifest (so the
// verify step still accounts for every file on disk) but is marked deprecated,
// which keeps it off the Resources page. Usually it is a superseded edition
// left behind after an upload.
const listIsAuthoritative = overrideOrder.length > 0;
const unlisted = [...filenamesOnDisk].filter((filename) => !orderIndex.has(filename));
if (listIsAuthoritative && unlisted.length) {
  console.warn(
    `Note: ${unlisted.length} PDF(s) in public/files are not in the booklet list, ` +
      `so they are not shown on the Resources page:\n` +
      unlisted.map((f) => `  - ${f}`).join('\n')
  );
}

const resources = pdfPaths
  .map((absoluteFilePath) => {
    const filename = path.basename(absoluteFilePath);
    const relativePath = computeRelativePath(resourcesRoot, absoluteFilePath);
    const overrides = overridesByFilename[filename] || {};
    const isUnlisted = listIsAuthoritative && !orderIndex.has(filename);
    const sizeBytes = fs.statSync(absoluteFilePath).size;
    const sha256 = sha256File(absoluteFilePath);
    const cacheBuster = sha256.slice(0, 10);
    const lastModified =
      getGitLastModifiedIso(absoluteFilePath) ||
      new Date(getLastModifiedMs(absoluteFilePath)).toISOString();
    const publicPath = computePublicUrlPath(resourcesRoot, absoluteFilePath);

    return {
      filename,
      relativePath,
      path: publicPath,
      sizeBytes,
      sha256,
      lastModified,
      cacheBuster,
      displayName: typeof overrides.displayName === 'string' ? overrides.displayName : deriveDisplayName(filename),
      description: typeof overrides.description === 'string' ? overrides.description : undefined,
      edition: typeof overrides.edition === 'string' ? overrides.edition : undefined,
      deprecated: isUnlisted
        ? true
        : typeof overrides.deprecated === 'boolean'
          ? overrides.deprecated
          : false,
    };
  })
  .sort((a, b) => {
    const aIndex = orderIndex.has(a.filename) ? orderIndex.get(a.filename) : Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.has(b.filename) ? orderIndex.get(b.filename) : Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.filename.localeCompare(b.filename);
  });

const outputDir = path.join(PROJECT_ROOT, 'src', 'resources');
const outputPath = path.join(outputDir, 'resources.manifest.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({
  resourcesRoot: toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot)),
  resources,
}, null, 2) + '\n');

console.log(`Generated ${path.relative(PROJECT_ROOT, outputPath)} with ${resources.length} PDFs from ${toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot))}`);
