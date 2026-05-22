/** URL affichable pour Expo Image (HTTP/S ou data URL renvoyée par l’API). */
export function resolveRemoteImageUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.startsWith('data:image/')) return u;
  return null;
}
