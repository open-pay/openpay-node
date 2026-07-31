import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig } from '../types';

export class MerchantResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, config.merchantId);
  }

  /**
   * Get merchant information.
   */
  get(callback: Callback): void {
    this.request('GET', this.url(), undefined, callback);
  }
}
