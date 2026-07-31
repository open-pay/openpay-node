import { BaseResource, NestedCollection } from '../base-resource';
import type { HttpClient } from '../http-client';
import type { Callback, OpenpayConfig, QueryParams } from '../types';

// ── Customer Sub-Resources ─────────────────────────────────────────

class CustomerCards extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`, 'cards');
  }
}

class CustomerCharges extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`, 'charges');
  }

  capture(customerId: string, transactionId: string, data: unknown, callback: Callback): void {
    this.request('POST', this.url(`${customerId}/charges/${transactionId}/capture`), data, callback);
  }

  refund(customerId: string, transactionId: string, data: unknown, callback: Callback): void {
    this.request('POST', this.url(`${customerId}/charges/${transactionId}/refund`), data, callback);
  }
}

class CustomerTransfers extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`, 'transfers');
  }
}

class CustomerPayouts extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`, 'payouts');
  }
}

class CustomerSubscriptions extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`, 'subscriptions');
  }

  update(customerId: string, subscriptionId: string, data: unknown, callback: Callback): void {
    this.request('PUT', this.url(`${customerId}/subscriptions/${subscriptionId}`), data, callback);
  }
}

class CustomerBankAccounts extends NestedCollection {
  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`, 'bankaccounts');
  }
}

// ── Main Customers Resource ────────────────────────────────────────

export class CustomersResource extends BaseResource {
  public readonly cards: CustomerCards;
  public readonly charges: CustomerCharges;
  public readonly transfers: CustomerTransfers;
  public readonly payouts: CustomerPayouts;
  public readonly subscriptions: CustomerSubscriptions;
  public readonly bankaccounts: CustomerBankAccounts;

  constructor(config: OpenpayConfig, httpClient: HttpClient) {
    super(config, httpClient, `${config.merchantId}/customers`);

    // Compose sub-resources (each shares the same config & http client)
    this.cards = new CustomerCards(config, httpClient);
    this.charges = new CustomerCharges(config, httpClient);
    this.transfers = new CustomerTransfers(config, httpClient);
    this.payouts = new CustomerPayouts(config, httpClient);
    this.subscriptions = new CustomerSubscriptions(config, httpClient);
    this.bankaccounts = new CustomerBankAccounts(config, httpClient);
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
