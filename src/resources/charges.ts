import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

export class ChargesResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/charges`);
  }

  /** Create a new charge. */
  create(data: unknown, callback: Callback): void {
    this.request('POST', this.url(), data, callback);
  }

  /** List charges with optional filters. */
  list(callback: Callback): void;
  list(data: QueryParams, callback: Callback): void;
  list(dataOrCb: QueryParams | Callback, cb?: Callback): void {
    const { query, cb: resolvedCb } = this.resolveListParams(dataOrCb, cb);
    this.request('GET', this.url() + query, undefined, resolvedCb!);
  }

  /** Get a charge by transaction ID. */
  get(transactionId: string, callback: Callback): void {
    this.request('GET', this.url(transactionId), undefined, callback);
  }

  /** Capture a previously uncaptured charge. */
  capture(transactionId: string, data: unknown, callback: Callback): void {
    this.request('POST', this.url(`${transactionId}/capture`), data, callback);
  }

  /** Refund a charge. */
  refund(transactionId: string, data: unknown, callback: Callback): void {
    this.request('POST', this.url(`${transactionId}/refund`), data, callback);
  }
}
