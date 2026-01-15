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

function loadOverrides() {
  const overridesPath = path.join(PROJECT_ROOT, 'src', 'resources', 'resources.overrides.json');
  try {
    const raw = fs.readFileSync(overridesPath, 'utf8');
    const parsed = JSON.parse(raw);
    const byFilename = parsed && typeof parsed === 'object' ? parsed.byFilename : null;
    return byFilename && typeof byFilename === 'object' ? byFilename : {};
  } catch {
    return {};
  }
}

const resourcesRoot = findFirstExistingDir(candidateResourcesRoots);
if (!resourcesRoot) {
  console.error(
    `No resources directory found. Checked: ${candidateResourcesRoots.join(', ')}`
  );
  process.exit(1);
}

const pdfPaths = listPdfFilesRecursively(resourcesRoot);

const overridesByFilename = loadOverrides();

const resources = pdfPaths
  .map((absoluteFilePath) => {
    const filename = path.basename(absoluteFilePath);
    const relativePath = computeRelativePath(resourcesRoot, absoluteFilePath);
    const overrides = overridesByFilename[filename] || {};
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
      deprecated: typeof overrides.deprecated === 'boolean' ? overrides.deprecated : false,
    };
  })
  .sort((a, b) => a.filename.localeCompare(b.filename));

const outputDir = path.join(PROJECT_ROOT, 'src', 'resources');
const outputPath = path.join(outputDir, 'resources.manifest.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({
  resourcesRoot: toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot)),
  resources,
}, null, 2) + '\n');

console.log(`Generated ${path.relative(PROJECT_ROOT, outputPath)} with ${resources.length} PDFs from ${toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot))}`);
