import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig } from '../types';

export class WebhooksResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/webhooks`);
  }

  create(data: unknown, callback: Callback): void {
    this.request('POST', this.url(), data, callback);
  }

  verify(webhookId: string, verificationCode: string, callback: Callback): void {
    this.request(
      'POST',
      this.url(`${webhookId}/verify/${verificationCode}`),
      '{}',
      callback,
    );
  }

  get(webhookId: string, callback: Callback): void {
    this.request('GET', this.url(webhookId), undefined, callback);
  }

  delete(webhookId: string, callback: Callback): void {
    this.request('DELETE', this.url(webhookId), undefined, callback);
  }

  list(callback: Callback): void {
    this.request('GET', this.url(), undefined, callback);
  }
}
