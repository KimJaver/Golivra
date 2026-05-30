import { getApiOrigin } from '@/lib/config';
import { UX_ERRORS, friendlyErrorMessage } from '@/lib/ux-copy';

export { getApiOrigin };

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath = normalizedPath.startsWith('/api/') ? normalizedPath : `/api${normalizedPath}`;
  return `${getApiOrigin()}${apiPath}`;
}

import { z } from 'zod';

export type ApiFetchOptions<T = unknown> = RequestInit & {
  token?: string | null;
  jsonBody?: unknown;
  schema?: z.ZodSchema<T>;
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

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions<T> = {}): Promise<T> {
  const { token, jsonBody, headers: initHeaders, body, schema, ...rest } = options;
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

  if (schema) {
    const result = schema.safeParse(parsed);
    if (!result.success) {
      console.warn(`[Zod Error] ${path}:`, result.error.format());
      // On loggue mais on ne plante pas l'app pour éviter les crashs inattendus en prod
      return parsed as T;
    }
    return result.data;
  }

  return parsed as T;
}

