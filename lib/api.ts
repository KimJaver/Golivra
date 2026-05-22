import { getApiOrigin } from '@/lib/config';

export { getApiOrigin };

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
      return `Route API introuvable (${status}). Vérifiez que le backend Render est déployé.`;
    }
    return `Réponse HTML inattendue du serveur (${status}). Vérifiez l'URL de l'API.`;
  }
  if (trimmed.toLowerCase().includes('cannot post')) {
    return `Endpoint API indisponible : ${trimmed.slice(0, 120)}`;
  }
  return trimmed || `Erreur HTTP ${status}`;
}

function networkErrorMessage(cause: unknown): string {
  const origin = getApiOrigin();
  const msg = cause instanceof Error ? cause.message : String(cause);
  if (/network request failed|failed to fetch|unable to resolve host|econnrefused|timeout/i.test(msg)) {
    return `Connexion impossible au serveur (${origin}). Vérifiez votre connexion Internet. En build APK, l'URL doit être en HTTPS (production : golivraback.onrender.com).`;
  }
  return msg || 'Erreur réseau.';
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

  const url = apiUrl(path);
  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      headers,
      body: finalBody,
    });
  } catch (cause) {
    throw new Error(networkErrorMessage(cause));
  }

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
        `${msg} URL : ${url.replace(/\/\/[^/]+/, '//…')}. Base API : ${getApiOrigin()}`,
      );
    }
    throw new Error(msg);
  }

  return parsed as T;
}
