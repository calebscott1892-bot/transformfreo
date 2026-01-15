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

function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

function normalizePath(p) {
  return toPosixPath(p).replace(/\/+/, '/');
}

function isPdf(fileName) {
  return fileName.toLowerCase().endsWith('.pdf');
}

function listPdfFilesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...listPdfFilesRecursively(full));
    else if (entry.isFile() && isPdf(entry.name)) results.push(full);
  }
  return results;
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

function loadManifest() {
  const manifestPath = path.join(PROJECT_ROOT, 'src', 'resources', 'resources.manifest.json');
  const raw = fs.readFileSync(manifestPath, 'utf8');
  return { manifestPath, manifest: JSON.parse(raw) };
}

function main() {
  const resourcesRoot = findFirstExistingDir(candidateResourcesRoots);
  if (!resourcesRoot) {
    console.error(`No resources directory found. Checked: ${candidateResourcesRoots.join(', ')}`);
    process.exit(1);
  }

  const { manifestPath, manifest } = loadManifest();
  const entries = Array.isArray(manifest.resources) ? manifest.resources : [];

  const diskPdfPaths = listPdfFilesRecursively(resourcesRoot);
  const disk = diskPdfPaths
    .map((abs) => {
      const rel = normalizePath(toPosixPath(path.relative(resourcesRoot, abs)));
      const stat = fs.statSync(abs);
      return {
        relativePath: rel,
        filename: path.basename(abs),
        sizeBytes: stat.size,
      };
    })
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const rendered = entries
    .filter((r) => !r.deprecated)
    .map((r) => ({
      filename: r.filename,
      path: r.path,
      url: `${r.path}?v=${encodeURIComponent(r.cacheBuster)}`,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  const diskSet = new Set(disk.map((d) => d.relativePath));
  const manifestRelSet = new Set(
    entries.map((r) => normalizePath(typeof r.relativePath === 'string' ? r.relativePath : r.filename))
  );

  const missingInManifest = disk
    .filter((d) => !manifestRelSet.has(d.relativePath))
    .map((d) => d.relativePath);

  const missingOnDisk = entries
    .filter((r) => {
      const rel = normalizePath(typeof r.relativePath === 'string' ? r.relativePath : r.filename);
      return !diskSet.has(rel);
    })
    .map((r) => r.path || r.filename);

  // Source literal scan
  const srcRoot = path.join(PROJECT_ROOT, 'src');
  const sourceFiles = walkFiles(srcRoot).filter((p) => /\.(js|jsx|ts|tsx)$/.test(p));
  const pdfLiteralRegex = /(['"`])([^'"`]*?\.pdf)\1/gi;
  const literals = [];
  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    while ((match = pdfLiteralRegex.exec(content))) {
      const literal = match[2];
      const looksLikeUrl = literal.startsWith('/') || literal.startsWith('http://') || literal.startsWith('https://');
      if (!looksLikeUrl) continue;
      literals.push({
        file: path.relative(PROJECT_ROOT, filePath),
        literal,
      });
    }
  }

  const manifestPathSet = new Set(entries.map((r) => normalizePath(r.path)));
  const badLocalLiterals = literals.filter((l) => {
    const lit = normalizePath(l.literal);
    if (lit.startsWith('http://') || lit.startsWith('https://')) return false;
    return !manifestPathSet.has(lit);
  });

  const report = {
    projectType: 'Vite + React (static assets from public/) ',
    resourcesRoot: normalizePath(toPosixPath(path.relative(PROJECT_ROOT, resourcesRoot))),
    manifestPath: normalizePath(toPosixPath(path.relative(PROJECT_ROOT, manifestPath))),
    pdfsOnDisk: disk,
    renderedResourceLinks: rendered,
    mismatches: {
      pdfOnDiskMissingFromManifest: missingInManifest,
      manifestEntryMissingOnDisk: missingOnDisk,
      sourcePdfLiterals: literals,
      sourceLocalPdfLiteralsNotInManifest: badLocalLiterals,
    },
    remediationApplied: [
      'Canonical source-of-truth directory is public/files (served at /files/* via Vite).',
      'Resources UI renders from src/resources/resources.manifest.json via src/resources/getResources.js.',
      'All resource URLs are cache-busted with ?v=<sha256prefix> derived from file contents.',
      'Build runs prebuild => resources:generate + resources:verify to fail CI on mismatches.',
      'Legacy *.pdf.pdf files kept but marked deprecated so they do not render.',
    ],
  };

  console.log(JSON.stringify(report, null, 2));
}

main();
