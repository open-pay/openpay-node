export namespace IOpenpay {
  export type Countries = 'mx' | 'co' | 'pe';
  export type Currency = 'MXN' | 'USD' | 'COP' | 'PEN';
  export type PaymentMonths = 3 | 6 | 9 | 12 | 18;

  export interface Error {
    category: 'request' | 'internal' | 'gateway';
    error_code: number;
    description: string;
    http_code: number;
    request_id: string;
    fraud_rules?: string[];
  }

  export interface Options {
    merchantId: string;
    privateKey: string;
    isProductionReady: boolean;
    clientIP: string;
    countryCode?: Countries;
  }

  export interface Address {
    line1: string;
    line2: string | null;
    line3: string | null;
    postal_code: string;
    state: string;
    city: string;
    country_code: string;
  }

  export interface BasicListQuery {
    creation?: string;
    'creation[gte]'?: string;
    'creation[lte]'?: string;
    offset?: number;
    limit?: number;
  }

  export interface Customer {
    id: string;
    creation_date: string;
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
    status: 'active' | 'deleted';
    balance: number;
    clabe: string | null;
    address: Address | null;
    external_id: string | null;
    store: {
      reference: string;
      barcode_url: string;
    };
    /** COLOMBIA ONLY */
    customer_address?: {
      department: string;
      city: string;
      additional: string;
    };
  }

  export namespace Customer {
    export interface CreateInput {
      name: string;
      email: string;
      address?: Address;
      last_name?: string;
      phone_number?: string;
      requires_account?: boolean;
      external_id?: string | null;
      /** COLOMBIA ONLY */
      customer_address?: Customer['customer_address'];
    }

    export interface ListQuery extends BasicListQuery {
      external_id?: string;
    }

    export type UpdateInput = Omit<Customer.CreateInput, 'external_id' | 'requires_account'>;
  }

  export interface Card {
    id: string;
    creation_date: string;
    holder_name: string;
    card_number: string;
    cvv2: string;
    expiration_month: string;
    expiration_year: string;
    address: Address | null;
    allows_charges: boolean;
    allows_payouts: boolean;
    brand: string;
    type: string;
    bank_name: string;
    bank_code: string;
    customer_id?: string;
    points_card?: boolean;
  }

  export namespace Card {
    export type CreateInput =
      | {
          holder_name: string;
          card_number: string;
          cvv2: string;
          expiration_month: string;
          expiration_year: string;
          device_session_id?: string;
          address?: Address;
        }
      | {
          token_id: string;
          device_session_id: string;
        };

    export interface UpdateInput {
      holder_name?: string;
      cvv2?: string;
      expiration_month?: string;
      expiration_year?: string;
      merchant_id?: string;
    }

    export type ListQuery = BasicListQuery;
  }

  export namespace Transaction {
    export type Method = 'card' | 'bank' | 'customer' | 'store';
    export type TransactionType = 'fee' | 'charge' | 'payout' | 'transfer';
    export type OperationType = 'in' | 'out';
    export type Status = 'completed' | 'in_progress' | 'failed';
  }

  export interface Transaction {
    id: string;
    authorization: string | null;
    transaction_type: Transaction.TransactionType;
    operation_type: Transaction.OperationType;
    method: Transaction.Method;
    creation_date: string;
    operation_date: string;
    order_id: string | null;
    status: Transaction.Status;
    amount: number;
    description: string;
    conciliated: boolean;
    error_message: string | null;
    customer_id: string | null;
    currency: Currency;
    bank_account?: BankAccount;
    card?: Card;
    card_points?: CardPoints;
    gateway_card_present?: string;
    due_date?: string;
    payment_method?: {
      type: string;
      url?: string;
      reference?: string;
      barcode_url?: string;
      paybin_reference?: string;
      barcode_paybin_url?: string;
    };
    fee?: {
      amount: number;
      tax: number;
      currency: Currency;
    };
    /** COLOMBIA ONLY */
    iva?: string | null;
  }

  export interface Token {
    id: string;
    card: Card;
  }

  export namespace Token {
    export interface CreateInput {
      holder_name: string;
      card_number: string;
      cvv2: string;
      expiration_month: string;
      expiration_year: string;
      address: Address;
    }
  }

  export interface CardPoints {
    used: number;
    remaining: number;
    amount: number;
    caption?: string;
  }

  export namespace Charge {
    export interface CreateBase {
      amount: number;
      description: string;
      order_id?: string;
      customer?: Customer.CreateInput;
      currency?: Currency;
      redirect_url?: string;
      /** COLOMBIA ONLY */
      iva?: string;
    }

    export interface CreateFromCard extends CreateBase {
      method: 'card';
      source_id: string;
      device_session_id?: string;
      capture?: boolean;
      payment_plan?: { payments: PaymentMonths };
      metadata?: Record<string, any>;
      use_card_points?: 'NONE' | 'MIXED' | 'ONLY_POINTS';
      confirm?: boolean;
      send_email?: boolean;
      use_3d_secure?: boolean;
    }

    export interface CreateFromStore extends CreateBase {
      method: 'store';
      due_date?: string;
    }

    export interface CreateFromBank extends CreateBase {
      method: 'bank_account';
      due_date?: string;
    }

    export interface CreateFromAlipay extends CreateBase {
      method: 'alipay';
      due_date?: string;
    }

    export interface CreateFromIVR extends CreateBase {
      method: 'card';
      confirm: 'ivr';
      currency?: Currency;
      metadata?: Record<string, any>;
      send_email?: boolean;
    }

    export type CreateInput =
      | CreateFromCard
      | CreateFromStore
      | CreateFromBank
      | CreateFromAlipay
      | CreateFromIVR;

    export type CaptureInput = {
      amount?: number;
    } | null;

    export interface RefundInput {
      description?: string;
      amount?: number;
    }

    export interface ListQuery extends BasicListQuery {
      order_id?: string;
      amount?: number;
      'amount[gte]'?: number;
      'amount[lte]'?: number;
      status?:
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'REFUNDED'
        | 'CHARGEBACK_PENDING'
        | 'CHARGEBACK_ACCEPTED'
        | 'CHARGEBACK_ADJUSTMENT'
        | 'CHARGE_PENDING'
        | 'CANCELLED'
        | 'FAILED';
    }
  }

  export namespace Payout {
    export interface CreateInput {
      method: 'bank_account' | 'card';
      amount: number;
      description: string;
      order_id?: string;
      destination_id?: string;
      card?: {
        card_number: string;
        holder_name: string;
        bank_code: string;
      };
      bank_account?: {
        clabe: string;
        holder_name: string;
      };
    }

    export interface ListQuery extends BasicListQuery {
      amount?: number;
      'amount[gte]'?: number;
      'amount[lte]'?: number;
      payout_type?: 'ALL' | 'AUTOMATIC' | 'MANUAL';
    }
  }

  export namespace Fee {
    export interface CreateInput {
      customer_id: string;
      amount: number;
      description: string;
      order_id?: string;
    }

    export type ListQuery = BasicListQuery;
  }

  export interface Store {
    id_store: string;
    id: string;
    name: string;
    last_update: string;
    geolocation: { lng: number; lat: number; place_id: string };
    address: Address;
    paynet_chain: {
      name: string;
      logo: string;
      thumb: string;
      max_amount: number;
    };
  }

  export namespace Store {
    export interface ListQuery {
      latitud: number;
      longitud: number;
      kilometers: number;
      amount: number;
    }
  }

  export interface Webhook {
    id: string;
    url: string;
    user?: string;
    password?: string;
    force_host_ssl?: boolean;
    allow_redirects?: boolean;
    event_types: Webhook.EventTypes[];
    status: 'verified' | 'unverified';
  }

  export namespace Webhook {
    export type EventTypes =
      | 'charge.refunded'
      | 'charge.failed'
      | 'charge.cancelled'
      | 'charge.created'
      | 'charge.succeeded'
      | 'charge.rescored.to.decline'
      | 'subscription.charge.failed'
      | 'payout.created'
      | 'payout.succeeded'
      | 'payout.failed'
      | 'transfer.succeeded'
      | 'fee.succeeded'
      | 'fee.refund.succeeded'
      | 'spei.received'
      | 'chargeback.created'
      | 'chargeback.rejected'
      | 'chargeback.accepted'
      | 'order.created'
      | 'order.activated'
      | 'order.payment.received'
      | 'order.completed'
      | 'order.expired'
      | 'order.cancelled'
      | 'order.payment.cancelled';

    export type CreateInput = Pick<Webhook, 'url' | 'user' | 'password' | 'event_types'>;
  }

  export interface Plan {
    id: string;
    creation_date: string;
    name: string;
    amount: number;
    currency: Currency;
    repeat_every: number;
    repeat_unit: 'week' | 'month' | 'year';
    retry_times: number;
    status: 'active' | 'deleted';
    status_after_retry: 'unpaid' | 'cancelled';
    trial_days: number;
    iva?: string | null;
    default_charge_quantity?: any | null;
  }

  export namespace Plan {
    export interface CreateInput {
      name: string;
      amount: number;
      repeat_every: number;
      repeat_unit: 'week' | 'month' | 'year';
      retry_times?: number;
      status_after_retry: 'unpaid' | 'cancelled';
      trial_days: number;
      /** @default MXN */
      currency?: Currency;
    }

    export interface UpdateInput {
      name?: string;
      trial_days?: number;
    }

    export type ListQuery = BasicListQuery;
  }

  export namespace Transfers {
    export interface CreateInput {
      customer_id: string;
      amount: number;
      description: string;
      order_id?: string;
    }

    export type ListQuery = BasicListQuery;
  }

  export interface Subscription {
    id: string;
    creation_date: string;
    cancel_at_period_end: boolean;
    charge_date: string;
    current_period_number: number;
    period_end_date: string;
    trial_end_date: string;
    plan_id: string;
    status: 'active' | 'trial' | 'past_due' | 'unpaid' | 'cancelled';
    customer_id: string;
    card: Card;
    default_charge_quantity?: any | null;
  }

  export namespace Subscription {
    export interface CreateInput {
      plan_id: string;
      trial_end_date?: string;
      source_id?: string;
      card?: Card;
      card_id?: string;
      device_session_id?: string;
    }

    export interface UpdateInput {
      cancel_at_period_end?: boolean;
      trial_end_date?: string;
      source_id?: string;
      card?: Card;
    }

    export type ListQuery = BasicListQuery;
  }

  export interface BankAccount {
    id: string;
    rfc: string | null;
    holder_name: string;
    alias: string | null;
    clabe: string;
    bank_name: string;
    bank_code: string;
    creation_date: string;
  }

  export namespace BankAccount {
    export interface CreateInput {
      holder_name: string;
      alias?: string;
      clabe: string;
    }

    export type ListQuery = BasicListQuery;
  }

  export interface Checkout {
    id: string;
    amount: number;
    description: string;
    order_id: string;
    currency: Currency;
    iva: string;
    status: Checkout.Status;
    checkout_link: string;
    creation_date: string;
    expiration_date: string | null;
    customer: {
      name: string;
      email: string;
      last_name: string;
      phone_number: string;
      external_id?: string | null;
    };
  }

  export namespace Checkout {
    export type Status = 'available' | 'other';

    export interface CreateInput {
      amount: number;
      description: string;
      order_id: string;
      currency: Currency;
      redirect_url: string;
      expiration_date?: string;
      send_email?: boolean;
      customer: Checkout['customer'];
    }
  }

  export namespace SDK {
    export interface Charges {
      create(data: Charge.CreateInput): Promise<Transaction>;
      list(query?: Charge.ListQuery): Promise<Transaction[]>;
      get(transactionId: string): Promise<Transaction>;
      capture(transactionId: string, data: Charge.CaptureInput): Promise<Transaction>;
      refund(transactionId: string, data: Charge.RefundInput): Promise<Transaction>;
    }

    export interface Payouts {
      create(data: Payout.CreateInput): Promise<Transaction>;
      list(query?: Payout.ListQuery): Promise<Transaction[]>;
      get(transactionId: string): Promise<Transaction>;
    }

    export interface Fees {
      create(data: Fee.CreateInput): Promise<Transaction>;
      list(query?: Fee.ListQuery): Promise<Transaction[]>;
    }

    export interface Cards {
      create(data: Card.CreateInput): Promise<Card>;
      list(query?: Card.ListQuery): Promise<Card[]>;
      get(cardId: string): Promise<Card>;
      delete(cardId: string): Promise<void>;
      update(cardId: string, data: Card.UpdateInput): Promise<void>;
    }

    export interface Tokens {
      create(data: Token.CreateInput): Promise<Token>;
      get(tokenId: string): Promise<Token>;
    }

    export interface Stores {
      list(query?: Store.ListQuery): Promise<Store>;
    }

    export interface Pse {
      create(data: Charge.CreateInput): Promise<Transaction>;
    }

    export interface Webhooks {
      create(data: Webhook.CreateInput): Promise<Webhook>;
      list(): Promise<Webhook[]>;
      get(webhookId: string): Promise<Webhook>;
      delete(webhookId: string): Promise<void>;
    }

    export interface Plans {
      create(data: Plan.CreateInput): Promise<Plan>;
      list(query?: Plan.ListQuery): Promise<Plan[]>;
      get(planId: string): Promise<Plan>;
      update(planId: string, data: Plan.UpdateInput): Promise<Plan>;
      delete(planId: string): Promise<void>;
    }

    export interface Customers {
      create(data: Customer.CreateInput): Promise<Customer>;
      list(query?: Customer.ListQuery): Promise<Customer[]>;
      get(customerId: string): Promise<Customer>;
      update(customerId: string, data: Customer.UpdateInput): Promise<Customer>;
      delete(customerId: string): Promise<void>;

      charges: {
        create(customerId: string, data: Charge.CreateInput): Promise<Transaction>;
        list(customerId: string, query?: Charge.ListQuery): Promise<Transaction[]>;
        get(customerId: string, transactionId: string): Promise<Transaction>;
        capture(customerId: string, transactionId: string, data: Charge.CaptureInput): Promise<Transaction>;
        refund(customerId: string, transactionId: string, data: Charge.RefundInput): Promise<Transaction>;
      };

      transfers: {
        create(customerId: string, data: Transfers.CreateInput): Promise<Transaction>;
        list(customerId: string, query?: Transfers.ListQuery): Promise<Transaction[]>;
        get(customerId: string, transactionId: string): Promise<Transaction>;
      };

      payouts: {
        create(customerId: string, data: Payout.CreateInput): Promise<Transaction>;
        list(customerId: string, query?: Payout.ListQuery): Promise<Transaction[]>;
        get(customerId: string, transactionId: string): Promise<Transaction>;
      };

      subscriptions: {
        create(customerId: string, data: Subscription.CreateInput): Promise<Subscription>;
        list(customerId: string, query?: Subscription.ListQuery): Promise<Subscription[]>;
        get(customerId: string, subscriptionId: string): Promise<Subscription>;
        update(
          customerId: string,
          subscriptionId: string,
          data: Subscription.UpdateInput,
        ): Promise<Subscription>;
        delete(customerId: string, subscriptionId: string): Promise<void>;
      };

      cards: {
        create(customerId: string, data: Card.CreateInput): Promise<Card>;
        list(customerId: string, query?: Card.ListQuery): Promise<Card[]>;
        get(customerId: string, cardId: string): Promise<Card>;
        delete(customerId: string, cardId: string): Promise<void>;
        update(customerId: string, cardId: string, data: Card.UpdateInput): Promise<Card>;
      };

      bankaccounts: {
        create(customerId: string, data: BankAccount.CreateInput): Promise<BankAccount>;
        list(customerId: string, query?: BankAccount.ListQuery): Promise<BankAccount[]>;
        get(customerId: string, bankId: string): Promise<BankAccount>;
        delete(customerId: string, bankId: string): Promise<void>;
      };

      pse: {
        create(customerId: string, data: Charge.CreateInput): Promise<Transaction>;
      };

      checkouts: {
        create(customerId: string, data: Checkout.CreateInput): Promise<Checkout>;
      };
    }

    export interface Checkouts {
      create(data: Checkout.CreateInput): Promise<Checkout>;
      list(query?: BasicListQuery): Promise<Checkout[]>;
      get(checkoutId: string): Promise<Checkout>;
      update(checkoutId: string, status: Checkout.Status, data: any): Promise<Checkout>;
    }
  }
}
