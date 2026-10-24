/**
 * Slug for an image path relative to public/img (e.g. "sub/My Pic.PNG" -> "sub-my-pic-png").
 * Shared by the optimize script and the runtime helper so file names always agree.
 */
export function slugOf(relPath) {
  const lower = relPath.toLowerCase();
  const dot = lower.lastIndexOf('.');
  const hasExt = dot > lower.lastIndexOf('/');
  const base = hasExt ? lower.slice(0, dot) : lower;
  const ext = hasExt ? lower.slice(dot + 1) : '';
  const clean = (s) => s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return [clean(base), clean(ext)].filter(Boolean).join('-');
}
