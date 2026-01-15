import fs from 'fs';
import path from 'path';

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

function getRelativePosixPath(root, absoluteFilePath) {
  return toPosixPath(path.relative(root, absoluteFilePath));
}

function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

function normalizePath(p) {
  return toPosixPath(p).replace(/\/+/, '/');
}

function loadManifest(manifestPath) {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  return JSON.parse(raw);
}

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function verify() {
  const resourcesRoot = findFirstExistingDir(candidateResourcesRoots);
  if (!resourcesRoot) {
    throw new Error(`No resources directory found. Checked: ${candidateResourcesRoots.join(', ')}`);
  }

  const manifestPath = path.join(PROJECT_ROOT, 'src', 'resources', 'resources.manifest.json');
  if (!exists(manifestPath)) {
    throw new Error(`Missing manifest at ${path.relative(PROJECT_ROOT, manifestPath)}. Run: npm run resources:generate`);
  }

  const manifest = loadManifest(manifestPath);
  const manifestResources = Array.isArray(manifest.resources) ? manifest.resources : [];

  const diskPdfPaths = listPdfFilesRecursively(resourcesRoot);
  const diskPdfRelativePaths = new Set(diskPdfPaths.map((p) => getRelativePosixPath(resourcesRoot, p)));

  const errors = [];

  const manifestRelativePaths = new Set(
    manifestResources.map((r) => (typeof r.relativePath === 'string' ? normalizePath(r.relativePath) : r.filename))
  );
  const manifestPaths = new Set(
    manifestResources.map((r) => (typeof r.path === 'string' ? normalizePath(r.path) : null)).filter(Boolean)
  );

  // (1) every manifest entry exists on disk
  for (const entry of manifestResources) {
    const diskPath = path.join(
      resourcesRoot,
      typeof entry.relativePath === 'string' ? entry.relativePath : entry.filename
    );
    if (!exists(diskPath)) {
      errors.push(
        `Manifest entry missing on disk: ${entry.path || entry.filename} (expected at ${toPosixPath(path.relative(PROJECT_ROOT, diskPath))})`
      );
    }
  }

  // (2) no PDFs exist on disk absent from manifest
  for (const relPath of diskPdfRelativePaths) {
    if (!manifestRelativePaths.has(normalizePath(relPath))) {
      errors.push(`PDF exists on disk but is missing from manifest: ${relPath}`);
    }
  }

  // (3) no source UI link points to a pdf not in manifest
  // We only check source files because build output may be unavailable in CI.
  const srcRoot = path.join(PROJECT_ROOT, 'src');
  const sourceFiles = walkFiles(srcRoot).filter((p) =>
    /\.(js|jsx|ts|tsx)$/.test(p) && !p.includes(`${path.sep}node_modules${path.sep}`)
  );

  const pdfLiteralRegex = /(['"`])([^'"`]*?\.pdf)\1/gi;

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    while ((match = pdfLiteralRegex.exec(content))) {
      const literal = match[2];

      // allow test strings or non-url usage; only enforce on web-ish paths.
      const looksLikeUrl = literal.startsWith('/') || literal.startsWith('http://') || literal.startsWith('https://');
      if (!looksLikeUrl) continue;

      const filename = path.basename(literal);
      const normalized = normalizePath(literal);

      // external PDFs are allowed; they are not governed by local manifest
      if (normalized.startsWith('http://') || normalized.startsWith('https://')) continue;

      // local PDF URLs must match an exact manifest path (e.g. /files/x.pdf)
      if (!manifestPaths.has(normalized)) {
        errors.push(
          `Source references PDF not in manifest: ${path.relative(PROJECT_ROOT, filePath)} -> ${literal}`
        );
      }
    }
  }

  if (errors.length) {
    console.error('Resource verification failed:\n');
    for (const e of errors) console.error(`- ${e}`);
    console.error(`\nResources root: ${toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot))}`);
    console.error(`Manifest: ${path.relative(PROJECT_ROOT, manifestPath)}`);
    process.exit(1);
  }

  console.log('Resource verification passed.');
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

try {
  verify();
} catch (err) {
  console.error(String(err?.stack || err));
  process.exit(1);
}
