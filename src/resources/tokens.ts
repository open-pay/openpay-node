import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig } from '../types';

export class TokensResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/tokens`);
  }

  create(data: unknown, callback: Callback): void {
    this.request('POST', this.url(), data, callback);
  }

  get(tokenId: string, callback: Callback): void {
    this.request('GET', this.url(tokenId), undefined, callback);
  }

  list(callback: Callback): void {
    this.request('GET', this.url(), undefined, callback);
  }
}
