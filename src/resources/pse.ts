import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig } from '../types';

export class PseResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/charges`);
  }

  /** Create a PSE charge (Colombia). */
  create(data: unknown, callback: Callback): void {
    this.request('POST', this.url(), data, callback);
  }
}
