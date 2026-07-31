import type { Callback, HttpMethod, OpenpayConfig, QueryParams } from './types';
import type { HttpClient } from './http-client';
import { stringifyParams, isPlainObjectWithKeys } from './stringify-params';

/**
 * Abstract base for every Openpay API resource.
 *
 * Provides:
 * - `request()` helper for HTTP calls
 * - `list()` overload helper (data-or-callback resolution)
 * - Promise + callback support methods
 */
export abstract class BaseResource {
  protected readonly config: OpenpayConfig;
  protected readonly httpClient: HttpClient;
  protected readonly baseUrl: string;

  constructor(config: OpenpayConfig, httpClient: HttpClient, baseUrl: string) {
    this.config = config;
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  /** Issue an HTTP request to the API. */
  protected request(
    method: HttpMethod,
    path: string,
    body: unknown | undefined,
    callback: Callback,
  ): void {
    this.httpClient.request(method, path, body, this.config, callback);
  }

  /**
   * Resolves the common `list(data, callback)` / `list(callback)` overload.
   *
   * Returns:
   * - `query`  — URL query string (with `?` prefix, or `''`)
   * - `cb`     — the resolved callback
   */
  protected resolveListParams(
    dataOrCb: QueryParams | Callback | undefined,
    cb?: Callback,
  ): { query: string; cb: Callback | undefined } {
    if (typeof dataOrCb === 'function') {
      return { query: '', cb: dataOrCb as Callback };
    }
    if (typeof cb === 'function') {
      const q = isPlainObjectWithKeys(dataOrCb) ? stringifyParams(dataOrCb) : '';
      return { query: q, cb };
    }
    return { query: '', cb: undefined };
  }

  /** Build a sub-path under this resource's base URL. */
  protected url(segment = ''): string {
    return segment ? `${this.baseUrl}/${segment}` : this.baseUrl;
  }

  /** Build a URL with a query string appended. */
  protected urlWithQuery(segment: string, query: string): string {
    return query ? `${this.baseUrl}/${segment}${query}` : `${this.baseUrl}/${segment}`;
  }
}

/**
 * A collection nested one level under a parent id, e.g.
 * `{merchantId}/customers/{customerId}/cards`. Covers the common
 * create/list/get/delete shape shared by most customer sub-resources;
 * extend it to add resource-specific methods (capture, refund, update…).
 */
export class NestedCollection extends BaseResource {
  constructor(
    config: OpenpayConfig,
    httpClient: HttpClient,
    parentBaseUrl: string,
    protected readonly collection: string,
  ) {
    super(config, httpClient, parentBaseUrl);
  }

  create(parentId: string, data: unknown, callback: Callback): void {
    this.request('POST', this.url(`${parentId}/${this.collection}`), data, callback);
  }

  list(parentId: string, callback: Callback): void;
  list(parentId: string, data: QueryParams, callback: Callback): void;
  list(parentId: string, dataOrCb: QueryParams | Callback, cb?: Callback): void {
    const { query, cb: resolvedCb } = this.resolveListParams(dataOrCb, cb);
    this.request('GET', this.urlWithQuery(`${parentId}/${this.collection}`, query), undefined, resolvedCb!);
  }

  get(parentId: string, childId: string, callback: Callback): void {
    this.request('GET', this.url(`${parentId}/${this.collection}/${childId}`), undefined, callback);
  }

  delete(parentId: string, childId: string, callback: Callback): void {
    this.request('DELETE', this.url(`${parentId}/${this.collection}/${childId}`), undefined, callback);
  }
}
