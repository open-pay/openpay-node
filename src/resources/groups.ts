import { BaseResource, NestedCollection } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

// ── Group Sub-Resources ────────────────────────────────────────────

class GroupCustomerCards extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `groups/${config.merchantId}/customers`, 'cards');
  }
}

class GroupCustomerCharges extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `groups/${config.merchantId}/merchants`);
  }

  create(merchantId: string, customerId: string, data: unknown, callback: Callback): void {
    this.request(
      'POST',
      this.url(`${merchantId}/customers/${customerId}/charges`),
      data,
      callback,
    );
  }

  capture(
    merchantId: string,
    customerId: string,
    transactionId: string,
    data: unknown,
    callback: Callback,
  ): void {
    this.request(
      'POST',
      this.url(`${merchantId}/customers/${customerId}/charges/${transactionId}/capture`),
      data,
      callback,
    );
  }

  refund(
    merchantId: string,
    customerId: string,
    transactionId: string,
    data: unknown,
    callback: Callback,
  ): void {
    this.request(
      'POST',
      this.url(`${merchantId}/customers/${customerId}/charges/${transactionId}/refund`),
      data,
      callback,
    );
  }
}

class GroupCustomerSubscriptions extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `groups/${config.merchantId}/merchants`);
  }

  create(merchantId: string, customerId: string, data: unknown, callback: Callback): void {
    this.request(
      'POST',
      this.url(`${merchantId}/customers/${customerId}/subscriptions`),
      data,
      callback,
    );
  }

  list(merchantId: string, customerId: string, callback: Callback): void;
  list(merchantId: string, customerId: string, data: QueryParams, callback: Callback): void;
  list(
    merchantId: string,
    customerId: string,
    dataOrCb: QueryParams | Callback,
    cb?: Callback,
  ): void {
    const { query, cb: resolvedCb } = this.resolveListParams(dataOrCb, cb);
    this.request(
      'GET',
      this.urlWithQuery(`${merchantId}/customers/${customerId}/subscriptions`, query),
      undefined,
      resolvedCb!,
    );
  }

  get(
    merchantId: string,
    customerId: string,
    subscriptionId: string,
    callback: Callback,
  ): void {
    this.request(
      'GET',
      this.url(`${merchantId}/customers/${customerId}/subscriptions/${subscriptionId}`),
      undefined,
      callback,
    );
  }

  update(
    merchantId: string,
    customerId: string,
    subscriptionId: string,
    data: unknown,
    callback: Callback,
  ): void {
    this.request(
      'PUT',
      this.url(`${merchantId}/customers/${customerId}/subscriptions/${subscriptionId}`),
      data,
      callback,
    );
  }

  delete(
    merchantId: string,
    customerId: string,
    subscriptionId: string,
    callback: Callback,
  ): void {
    this.request(
      'DELETE',
      this.url(`${merchantId}/customers/${customerId}/subscriptions/${subscriptionId}`),
      undefined,
      callback,
    );
  }
}

// ── Group Customers ─────────────────────────────────────────────────

class GroupCustomers extends BaseResource {
  public readonly cards: GroupCustomerCards;
  public readonly charges: GroupCustomerCharges;
  public readonly subscriptions: GroupCustomerSubscriptions;

  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `groups/${config.merchantId}/customers`);

    this.cards = new GroupCustomerCards(config, httpClient);
    this.charges = new GroupCustomerCharges(config, httpClient);
    this.subscriptions = new GroupCustomerSubscriptions(config, httpClient);
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

  get(customerId: string, callback: Callback): void {
    this.request('GET', this.url(customerId), undefined, callback);
  }

  update(customerId: string, data: unknown, callback: Callback): void {
    this.request('PUT', this.url(customerId), data, callback);
  }

  delete(customerId: string, callback: Callback): void {
    this.request('DELETE', this.url(customerId), undefined, callback);
  }
}

// ── Group Charges ───────────────────────────────────────────────────

class GroupCharges extends BaseResource {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `groups/${config.merchantId}/merchants`);
  }

  create(merchantId: string, data: unknown, callback: Callback): void {
    this.request('POST', this.url(`${merchantId}/charges`), data, callback);
  }

  capture(merchantId: string, transactionId: string, data: unknown, callback: Callback): void {
    this.request(
      'POST',
      this.url(`${merchantId}/charges/${transactionId}/capture`),
      data,
      callback,
    );
  }

  refund(merchantId: string, transactionId: string, data: unknown, callback: Callback): void {
    this.request(
      'POST',
      this.url(`${merchantId}/charges/${transactionId}/refund`),
      data,
      callback,
    );
  }
}

// ── Main Groups Resource ────────────────────────────────────────────

export class GroupsResource extends BaseResource {
  public readonly customers: GroupCustomers;
  public readonly charges: GroupCharges;

  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `groups/${config.merchantId}`);

    this.customers = new GroupCustomers(config, httpClient);
    this.charges = new GroupCharges(config, httpClient);
  }
}
