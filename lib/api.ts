import { getApiOrigin } from '@/lib/config';
import { UX_ERRORS, friendlyErrorMessage } from '@/lib/ux-copy';

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
    return friendlyErrorMessage(String((parsed as { message: unknown }).message));
  }
  const trimmed = text.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    return UX_ERRORS.generic;
  }
  if (trimmed.toLowerCase().includes('cannot post')) {
    return UX_ERRORS.generic;
  }
  if (status === 401) return UX_ERRORS.session;
  if (status === 403) return UX_ERRORS.forbidden;
  return friendlyErrorMessage(trimmed || UX_ERRORS.generic);
}

function networkErrorMessage(cause: unknown): string {
  return friendlyErrorMessage(cause, UX_ERRORS.network);
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
    throw new Error(extractErrorMessage(parsed, text, res.status));
  }

  return parsed as T;
}
