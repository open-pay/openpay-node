import { BaseResource } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

export class PlansResource extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/plans`);
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

  get(planId: string, callback: Callback): void {
    this.request('GET', this.url(planId), undefined, callback);
  }

  update(planId: string, data: unknown, callback: Callback): void {
    this.request('PUT', this.url(planId), data, callback);
  }

  delete(planId: string, callback: Callback): void {
    this.request('DELETE', this.url(planId), undefined, callback);
  }

  /** List subscriptions under a plan. */
  listSubscriptions(callback: Callback): void;
  listSubscriptions(planId: string, callback: Callback): void;
  listSubscriptions(planId: string, data: QueryParams, callback: Callback): void;
  listSubscriptions(
    planIdOrCb: string | Callback,
    dataOrCb?: QueryParams | Callback | undefined,
    cb?: Callback,
  ): void {
    let planId: string;
    let query = '';
    let resolvedCb: Callback | undefined;

    if (typeof planIdOrCb === 'function') {
      // listSubscriptions(callback)
      planId = '';
      resolvedCb = planIdOrCb;
    } else if (typeof dataOrCb === 'function') {
      // listSubscriptions(planId, callback)
      planId = planIdOrCb;
      resolvedCb = dataOrCb;
    } else if (typeof cb === 'function') {
      // listSubscriptions(planId, data, callback)
      planId = planIdOrCb;
      query = this.resolveListParams(dataOrCb as QueryParams, cb).query;
      resolvedCb = cb;
    } else {
      // listSubscriptions(planId, data)
      planId = planIdOrCb;
      resolvedCb = undefined;
    }

    const urlPath = planId
      ? `${this.url(planId)}/subscriptions${query}`
      : `${this.url()}${query}`;
    this.request('GET', urlPath, undefined, resolvedCb!);
  }
}
