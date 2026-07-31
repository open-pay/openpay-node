import type { HttpMethod, OpenpayConfig, Callback } from './types';
import { OpenpayError, NetworkError } from './errors';
import { escapeBrackets } from './url-utils';

// ── HTTP Client Interface (DIP: resources depend on this, not on fetch) ─

export interface HttpClient {
  request(
    method: HttpMethod,
    url: string,
    body: unknown | undefined,
    config: OpenpayConfig,
    callback: Callback,
  ): void;
}

/** Per-instance API host derived from country + sandbox flag. */
export function hostFor(config: OpenpayConfig): string {
  return `https://${config.isSandbox ? 'sandbox-api' : 'api'}.openpay.${config.countryCode}`;
}

async function performRequest(
  method: HttpMethod,
  fullUrl: string,
  body: unknown | undefined,
  config: OpenpayConfig,
  callback: Callback,
): Promise<void> {
  const auth = Buffer.from(config.privateKey + ':').toString('base64');

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      method,
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(config.timeout),
    });
  } catch (err) {
    callback(new NetworkError(err as Error), null, null);
    return;
  }

  const headers = Object.fromEntries(res.headers.entries());
  const respBody = await res.json().catch(() => null);

  if (res.ok) {
    callback(null, respBody, { statusCode: res.status, headers });
  } else {
    callback(new OpenpayError(`HTTP ${res.status}`, res.status, respBody), null, {
      statusCode: res.status,
      headers,
    });
  }
}

// ── fetch-based Implementation ──────────────────────────────────────

export class UrllibHttpClient implements HttpClient {
  request(
    method: HttpMethod,
    url: string,
    body: unknown | undefined,
    config: OpenpayConfig,
    callback: Callback,
  ): void {
    void performRequest(method, hostFor(config) + '/v1/' + escapeBrackets(url), body, config, callback);
  }
}

// ── Store HTTP Client (no /v1 prefix) ───────────────────────────────

export class StoreHttpClient implements HttpClient {
  request(
    method: HttpMethod,
    url: string,
    body: unknown | undefined,
    config: OpenpayConfig,
    callback: Callback,
  ): void {
    void performRequest(method, hostFor(config) + '/' + escapeBrackets(url), body, config, callback);
  }
}
