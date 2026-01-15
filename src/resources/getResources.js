import manifest from './resources.manifest.json';

export function getResources() {
  const resources = Array.isArray(manifest?.resources) ? manifest.resources : [];

  return resources
    .filter((r) => !r.deprecated)
    .map((r) => ({
      ...r,
      url: `${r.path}?v=${encodeURIComponent(r.cacheBuster)}`,
    }));
}
