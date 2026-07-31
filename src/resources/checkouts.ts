import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

export class CheckoutsResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/checkouts`);
  }

  create(data: unknown, callback: Callback): void {
    this.request('POST', this.url(), data, callback);
  }

  get(checkoutId: string, callback: Callback): void {
    this.request('GET', this.url(checkoutId), undefined, callback);
  }

  list(callback: Callback): void;
  list(data: QueryParams, callback: Callback): void;
  list(dataOrCb: QueryParams | Callback, cb?: Callback): void {
    const { query, cb: resolvedCb } = this.resolveListParams(dataOrCb, cb);
    this.request('GET', this.url() + query, undefined, resolvedCb!);
  }

  update(checkoutId: string, status: string, data: unknown, callback: Callback): void {
    this.request(
      'PUT',
      this.url(`${checkoutId}?status=${status}`),
      data,
      callback,
    );
  }
}
