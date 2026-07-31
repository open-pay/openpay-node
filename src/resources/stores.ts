import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

export class StoresResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    // Stores uses a different base URL (no merchant prefix, no /v1/)
    super(config, httpClient, 'stores');
  }

  list(callback: Callback): void;
  list(data: QueryParams, callback: Callback): void;
  list(dataOrCb: QueryParams | Callback, cb?: Callback): void {
    const { query, cb: resolvedCb } = this.resolveListParams(dataOrCb, cb);
    // Stores uses the StoreHttpClient which has different BASE_URL logic
    this.httpClient.request('GET', this.url() + query, undefined, this.config, resolvedCb!);
  }
}
