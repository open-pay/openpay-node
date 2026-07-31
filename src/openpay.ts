import type { OpenpayConfig, CountryCode } from './types';
import { UrllibHttpClient, StoreHttpClient } from './http-client';
import { MerchantResource } from './resources/merchant';
import { ChargesResource } from './resources/charges';
import { PayoutsResource } from './resources/payouts';
import { FeesResource } from './resources/fees';
import { PlansResource } from './resources/plans';
import { CardsResource } from './resources/cards';
import { CustomersResource } from './resources/customers';
import { WebhooksResource } from './resources/webhooks';
import { TokensResource } from './resources/tokens';
import { CheckoutsResource } from './resources/checkouts';
import { StoresResource } from './resources/stores';
import { PseResource } from './resources/pse';
import { GroupsResource } from './resources/groups';

/**
 * Openpay API client.
 *
 * Usage (callback style, backward-compatible):
 * ```js
 * const openpay = new Openpay('merchantId', 'sk_xxx', 'mx', false);
 * openpay.charges.create({ amount: 100, ... }, (err, body, res) => { ... });
 * ```
 */
const COUNTRY_CODES: readonly CountryCode[] = ['mx', 'pe', 'co'];

class Openpay {
  // ── Instance State ───────────────────────────────────────────────

  private config: OpenpayConfig;
  private apiHttpClient: UrllibHttpClient;
  private storeHttpClient: StoreHttpClient;

  // ── Resources (public API surface) ───────────────────────────────

  public merchant!: MerchantResource;
  public charges!: ChargesResource;
  public payouts!: PayoutsResource;
  public fees!: FeesResource;
  public plans!: PlansResource;
  public cards!: CardsResource;
  public customers!: CustomersResource;
  public webhooks!: WebhooksResource;
  public tokens!: TokensResource;
  public checkouts!: CheckoutsResource;
  public stores!: StoresResource;
  public pse!: PseResource;
  public groups!: GroupsResource;

  // ── Constructor ──────────────────────────────────────────────────

  constructor(
    merchantId: string,
    privateKey: string,
    countryCode: CountryCode = 'mx',
    isProductionReady?: boolean,
  ) {
    const isSandbox = !isProductionReady;

    this.config = {
      merchantId,
      privateKey,
      isSandbox,
      timeout: 90_000,
      countryCode: COUNTRY_CODES.includes(countryCode) ? countryCode : 'mx',
    };

    // Create HTTP clients (DIP: resources depend on these abstractions)
    this.apiHttpClient = new UrllibHttpClient();
    this.storeHttpClient = new StoreHttpClient();

    this.rebuildResources();
  }

  // ── Configuration Setters ────────────────────────────────────────

  /** Change the merchant ID and rebuild resources. */
  setMerchantId(merchantId: string): void {
    this.config = { ...this.config, merchantId };
    this.rebuildResources();
  }

  /** Change the private key and rebuild resources. */
  setPrivateKey(privateKey: string): void {
    this.config = { ...this.config, privateKey };
    this.rebuildResources();
  }

  /** Toggle sandbox/production mode and rebuild resources. */
  setProductionReady(isProductionReady: boolean): void {
    this.config = { ...this.config, isSandbox: !isProductionReady };
    this.rebuildResources();
  }

  /** Change the HTTP request timeout and rebuild resources. */
  setTimeout(timeout: number): void {
    this.config = { ...this.config, timeout };
    this.rebuildResources();
  }

  /** Change the country (per instance) and rebuild resources. */
  setBaseUrl(countryCode: CountryCode): void {
    this.config = {
      ...this.config,
      countryCode: COUNTRY_CODES.includes(countryCode) ? countryCode : 'mx',
    };
    this.rebuildResources();
  }

  // ── Helpers ──────────────────────────────────────────────────────

  /** Rebuild all resources after a config change. */
  private rebuildResources(): void {
    // Re-assign resource properties (same pattern as original's _reDefine)
    this.merchant = new MerchantResource(this.config, this.apiHttpClient);
    this.charges = new ChargesResource(this.config, this.apiHttpClient);
    this.payouts = new PayoutsResource(this.config, this.apiHttpClient);
    this.fees = new FeesResource(this.config, this.apiHttpClient);
    this.plans = new PlansResource(this.config, this.apiHttpClient);
    this.cards = new CardsResource(this.config, this.apiHttpClient);
    this.customers = new CustomersResource(this.config, this.apiHttpClient);
    this.webhooks = new WebhooksResource(this.config, this.apiHttpClient);
    this.tokens = new TokensResource(this.config, this.apiHttpClient);
    this.checkouts = new CheckoutsResource(this.config, this.apiHttpClient);
    this.pse = new PseResource(this.config, this.apiHttpClient);
    this.groups = new GroupsResource(this.config, this.apiHttpClient);
    this.stores = new StoresResource(this.config, this.storeHttpClient);
  }
}

export = Openpay;
