const DEFAULT_API_ORIGIN = 'https://golivraback.onrender.com';

/**
 * Base URL du serveur API (sans suffixe /api).
 * Priorité : EXPO_PUBLIC_API_BASE_URL (build-time) → fallback codé en dur.
 */
export function getApiOrigin(): string {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL;
  let origin = (raw || DEFAULT_API_ORIGIN).trim().replace(/\/+$/, '');
  if (origin.toLowerCase().endsWith('/api')) {
    origin = origin.slice(0, -4);
  }
  return origin;
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath = normalizedPath.startsWith('/api/') ? normalizedPath : `/api${normalizedPath}`;
  return `${getApiOrigin()}${apiPath}`;
}

export type ApiFetchOptions = RequestInit & {
  token?: string | null;
  jsonBody?: unknown;
};

function extractErrorMessage(parsed: unknown, text: string, status: number): string {
  if (typeof parsed === 'object' && parsed !== null && 'message' in parsed) {
    return String((parsed as { message: unknown }).message);
  }
  const trimmed = text.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    if (status === 404) {
      return `Route API introuvable (${status}). Vérifiez EXPO_PUBLIC_API_BASE_URL et que le backend Render est à jour.`;
    }
    return `Réponse HTML inattendue du serveur (${status}). Vérifiez l'URL de l'API.`;
  }
  if (trimmed.toLowerCase().includes('cannot post')) {
    return `Endpoint API indisponible : ${trimmed.slice(0, 120)}`;
  }
  return trimmed || `Erreur HTTP ${status}`;
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, jsonBody, headers: initHeaders, body, ...rest } = options;
  const headers = new Headers(initHeaders);

  let finalBody = body;
  if (jsonBody !== undefined) {
    headers.set('content-type', 'application/json');
    finalBody = JSON.stringify(jsonBody);
  }

  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const res = await fetch(apiUrl(path), {
    ...rest,
    headers,
    body: finalBody,
  });

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const msg = extractErrorMessage(parsed, text, res.status);
    if (res.status === 404 && msg.includes('Route API introuvable')) {
      throw new Error(
        `${msg} URL appelée : ${apiUrl(path).replace(/\/\/[^/]+/, '//…')}. Vérifiez EXPO_PUBLIC_API_BASE_URL (sans /api à la fin).`,
      );
    }
    throw new Error(msg);
  }

  return parsed as T;
}
