import type { QueryParams } from './types';

/**
 * Converts a plain object to a query string with `?` prefix.
 * Returns an empty string when params is undefined, null, or empty.
 */
export function stringifyParams(params: QueryParams | undefined | null): string {
  if (params == null || typeof params !== 'object' || Array.isArray(params)) {
    return '';
  }

  const entries = Object.entries(params);
  if (entries.length === 0) {
    return '';
  }

  const parts = entries.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
  return '?' + parts.join('&');
}

/**
 * Detect whether a value is a plain, non-array, non-null object
 * with at least one key — used by list-method overload resolution.
 */
export function isPlainObjectWithKeys(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value as object).length > 0
  );
}
