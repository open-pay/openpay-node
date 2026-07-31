// ── HTTP & Request Types ───────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestSpec {
  apiUrl: string;
  requestData: {
    method: HttpMethod;
    json?: unknown;
  };
}

// ── Configuration ──────────────────────────────────────────────────

export interface OpenpayConfig {
  merchantId: string;
  privateKey: string;
  isSandbox: boolean;
  timeout: number;
  countryCode: CountryCode;
}

// ── Callback ───────────────────────────────────────────────────────

export type Callback<T = unknown> = (
  error: Error | null,
  body: T | null,
  response: HttpResponse | null,
) => void;

// ── HTTP Response ──────────────────────────────────────────────────

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
}

// ── Country Code ───────────────────────────────────────────────────

export type CountryCode = 'mx' | 'pe' | 'co';

// ── Query Params ───────────────────────────────────────────────────

export type QueryParams = Record<string, string | number>;

// ── API Response (generic resource) ────────────────────────────────

export interface OpenpayResource {
  id: string;
  [key: string]: unknown;
}

// ── Charge ─────────────────────────────────────────────────────────

export interface ChargeRequest {
  method: 'card' | 'bank_account' | 'store';
  amount: number;
  description: string;
  card?: CardRequest;
  source_id?: string;
  capture?: boolean;
  currency?: string;
  device_session_id?: string;
  customer?: CustomerRef;
  confirm?: boolean;
  send_email?: boolean;
  redirect_url?: string;
  use_3d_secure?: boolean;
  metadata?: Record<string, string>;
}

export interface CardRequest {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;
}

export interface CustomerRef {
  id?: string;
  name: string;
  email?: string;
  phone_number?: string;
  requires_account?: boolean;
  address?: Address;
}

export interface Address {
  city?: string;
  country_code?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  postal_code?: string;
  state?: string;
}

export interface CaptureRequest {
  amount?: number;
}

export interface RefundRequest {
  description?: string;
  amount?: number;
}

// ── Payout ─────────────────────────────────────────────────────────

export interface PayoutRequest {
  method: 'card' | 'bank_account';
  destination_id?: string;
  amount: number;
  description: string;
  card?: CardRequest;
  bank_account?: BankAccountRequest;
}

export interface BankAccountRequest {
  clabe: string;
  holder_name: string;
  bank_code?: string;
  bank_name?: string;
}

// ── Customer ───────────────────────────────────────────────────────

export interface CustomerRequest {
  name: string;
  email?: string;
  phone_number?: string;
  requires_account?: boolean;
  address?: Address;
  external_id?: string;
  status?: string;
}

// ── Card ───────────────────────────────────────────────────────────

export interface CardCreateRequest {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;
}

// ── Bank Account ───────────────────────────────────────────────────

export interface BankAccountCreateRequest {
  clabe: string;
  holder_name: string;
  bank_code?: string;
  bank_name?: string;
  alias?: string;
}

// ── Plan ───────────────────────────────────────────────────────────

export interface PlanRequest {
  name: string;
  amount: number;
  repeat_every: number;
  repeat_unit: 'day' | 'week' | 'month' | 'year';
  retry_times?: number;
  status_after_retry?: 'cancelled' | 'unpaid';
  trial_days?: number;
  currency?: string;
}

// ── Subscription ───────────────────────────────────────────────────

export interface SubscriptionRequest {
  plan_id: string;
  card_id?: string;
  token_id?: string;
  trial_days?: number;
  trial_end_date?: string;
  coupon_id?: string;
}

// ── Webhook ────────────────────────────────────────────────────────

export interface WebhookRequest {
  url: string;
  event_types: string[];
}

// ── Token ──────────────────────────────────────────────────────────

export interface TokenRequest {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;
  address?: Address;
}

// ── Checkout ───────────────────────────────────────────────────────

export interface CheckoutRequest {
  amount: number;
  description: string;
  order_id?: string;
  currency?: string;
  customer?: CustomerRef;
  send_email?: boolean;
  redirect_url?: string;
  confirm?: boolean;
  iva?: number;
  metadata?: Record<string, string>;
  expires_at?: string;
  needs_shipping_contact?: boolean;
  type?: 'redirect' | 'modal' | 'integration';
}

// ── PSE ────────────────────────────────────────────────────────────

export interface PseRequest {
  method: ' bank_account';
  amount: number;
  description: string;
  customer?: CustomerRef;
  bank_code: string;
  redirect_url?: string;
}

// ── Store ──────────────────────────────────────────────────────────

export interface StoreListParams {
  lte?: string;
  gte?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | undefined;
}
