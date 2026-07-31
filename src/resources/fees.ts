import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

export class FeesResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/fees`);
  }

  create(data: unknown, callback: Callback): void {
    this.request('POST', this.url(), data, callback);
  }

  list(callback: Callback): void;
  list(data: QueryParams, callback: Callback): void;
  list(dataOrCb: QueryParams | Callback, cb?: Callback): void {
    const { query, cb: resolvedCb } = this.resolveListParams(dataOrCb, cb);
    this.request('GET', this.url() + query, undefined, resolvedCb!);
  }
}
