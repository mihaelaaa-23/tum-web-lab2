export function isPreview(env: Record<string, string | boolean | undefined>): boolean {
  const value = env.PUBLIC_PREVIEW;
  return value === true || value === 'true';
}
