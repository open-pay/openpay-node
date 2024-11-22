import type { IOpenpay } from '../dist/openpay';

import { assert, describe, expect, it } from 'vitest';
import { Openpay } from '../dist/openpay';

describe('Test the Openpay Perú SDK', () => {
  const openpay = new Openpay({
    merchantId: process.env.OPENPAY_MERCHANT_ID ?? '',
    privateKey: process.env.OPENPAY_PRIVATE_KEY ?? '',
    isProductionReady: false,
    countryCode: 'pe',
    clientIP: '127.0.0.1',
  });
  const device_session_id = process.env.OPENPAY_DEVICE_SESSION_ID ?? '';

  // Defining a valid expiration year for cards, adding 5 years to the current one
  const validExpYear = (new Date().getFullYear() + 5).toString().substring(2, 4);

  ////////////////////////////////
  // WEBHOOK TESTS
  ////////////////////////////////

  let testWebhookId = '';

  const testWebhook: IOpenpay.Webhook.CreateInput = {
    url: process.env.OPENPAY_WEBHOOK_TEST_URL ?? '',
    event_types: [
      'charge.refunded',
      'charge.failed',
      'charge.cancelled',
      'charge.created',
      'chargeback.accepted',
    ],
  };

  describe('Test webhooks API', () => {
    it('should create a webhook', async () => {
      const webhook = await openpay.webhooks.create(testWebhook);
      expect(webhook).toBeTruthy();
      testWebhookId = webhook.id;

      console.log('The webhook:', webhook.id);
    });

    it('should get the webhook', async () => {
      await expect(openpay.webhooks.get(testWebhookId)).resolves.toBeTruthy();
    });

    it('should get all the webhooks', async () => {
      await expect(openpay.webhooks.list()).resolves.toBeTruthy();
    });

    it('should delete the webhook', async () => {
      await expect(openpay.webhooks.delete(testWebhookId)).resolves.toBeUndefined();
    });
  });

  ////////////////////////////////
  // CUSTOMER TESTS
  ////////////////////////////////

  let testCustomerId = '';
  const testCustomer: IOpenpay.Customer.CreateInput = {
    name: 'Marco',
    last_name: 'Morales Pérez',
    email: 'marco@ejemplo.com',
    phone_number: '1234567890',
    requires_account: true, // Create account to perform charge/fees/transfer tests
  };

  const today = toFilterDate(new Date());

  describe('Testing customers API', () => {
    it('should create a customer', async () => {
      const customer = await openpay.customers.create(testCustomer);
      expect(customer).toBeTruthy();
      testCustomerId = customer.id;

      console.log('The customer:', customer.id);
    });

    it('should get all customers', async () => {
      await expect(openpay.customers.list()).resolves.toBeTruthy();
    });

    it('should get the test customer', async () => {
      await expect(openpay.customers.get(testCustomerId)).resolves.toBeTruthy();
    });

    it('should update the customer', async () => {
      const customer = await openpay.customers.update(testCustomerId, {
        name: 'Alberto',
        email: 'alberto@ejemplo.com',
      });
      expect(customer).toBeTruthy();

      testCustomer.name = customer.name;
      testCustomer.email = customer.email;
    });

    it('should get customers created today', async () => {
      const customers = await openpay.customers.list({ creation: today });
      expect(customers).toBeTruthy();
      assert(customers.length > 0, 'No customers returned. It should have returned the test one');
    });
  });

  ////////////////////////////////
  // CARDS TESTS
  ////////////////////////////////

  let testCardId = '';
  let testCustomerCardId = '';

  const testCard: IOpenpay.Card.CreateInput = {
    card_number: '4111111111111111',
    holder_name: testCustomer.name,
    expiration_year: validExpYear,
    expiration_month: '1',
    cvv2: '110',
  };

  describe('Testing cards API', () => {
    it('should create a card', async () => {
      const card = await openpay.cards.create(testCard);
      expect(card).toBeTruthy();
      testCardId = card.id;

      console.log('The card:', card.id);
    });

    it('should get all cards', async () => {
      await expect(openpay.cards.list()).resolves.toBeTruthy();
    });

    it('should get the test card', async () => {
      await expect(openpay.cards.get(testCardId)).resolves.toBeTruthy();
    });

    describe('Test customer cards API', () => {
      it('should create a card for the customer', async () => {
        const card = await openpay.customers.cards.create(testCustomerId, testCard);
        expect(card).toBeTruthy();
        testCustomerCardId = card.id;

        console.log('The customer card:', card.id);
      });

      it('should get all cards of the customer', async () => {
        await expect(openpay.customers.cards.list(testCustomerId)).resolves.toBeTruthy();
      });

      it('should get the test card for the customer', async () => {
        await expect(openpay.customers.cards.get(testCustomerId, testCustomerCardId)).resolves.toBeTruthy();
      });
    });
  });

  ////////////////////////////////
  // CHARGE TESTS
  ////////////////////////////////

  let testTxnId = '';
  let testCustomerTxnId = '';

  const testExistingCardCharge: IOpenpay.Charge.CreateFromCard = {
    amount: 716,
    source_id: '',
    method: 'card',
    currency: 'PEN',
    device_session_id,
    customer: testCustomer,
    description: 'Test existing card charges',
  };

  const testStoreCharge: IOpenpay.Charge.CreateFromStore = {
    amount: 716,
    method: 'store',
    currency: 'PEN',
    customer: testCustomer,
    description: 'Test store charge',
  };

  describe('Test charges API', () => {
    it('should get all charges', async () => {
      await expect(openpay.charges.list()).resolves.toBeTruthy();
    });

    it('should create a charge to an existing card', async () => {
      testExistingCardCharge.source_id = testCardId;
      const txn = await openpay.charges.create(testExistingCardCharge);
      expect(txn).toBeTruthy();
      testTxnId = txn.id;

      console.log('The charge to an existing card:', txn.id);
    });

    it('should get the created charge', async () => {
      await expect(openpay.charges.get(testTxnId)).resolves.toBeTruthy();
    });

    it('should create charge on store', async () => {
      const txn = await openpay.charges.create(testStoreCharge);
      expect(txn).toBeTruthy();
      console.log('The charge on store:', txn.id);

      expect(txn.id).toBeTruthy();
      assert.equal(txn.method, 'store');
      assert.equal(txn.payment_method?.type, 'store');
      expect(txn.payment_method?.reference).toBeTruthy();
      expect(txn.payment_method?.barcode_url).toBeTruthy();
    });

    describe('Test customer charges API', () => {
      it('should create a charge to an existing card', async () => {
        const { customer, ...data } = testExistingCardCharge;
        const txn = await openpay.customers.charges.create(testCustomerId, {
          ...data,
          source_id: testCustomerCardId,
        });
        expect(txn).toBeTruthy();
        testCustomerTxnId = txn.id;

        console.log('The customer charge on existing card:', txn.id);
      });

      it('should get all charges', async () => {
        await expect(openpay.customers.charges.list(testCustomerId)).resolves.toBeTruthy();
      });

      it('should get the created charge', async () => {
        await expect(openpay.customers.charges.get(testCustomerId, testCustomerTxnId)).resolves.toBeTruthy();
      });

      it('should create charge on store', async () => {
        const { customer, ...data } = testStoreCharge;
        const txn = await openpay.customers.charges.create(testCustomerId, data);
        expect(txn).toBeTruthy();
        console.log('The customer charge on store:', txn.id);
      });
    });
  });

  ////////////////////////////////
  // PLAN TESTS
  ////////////////////////////////

  let testPlanId = '';
  const testPlan: IOpenpay.Plan.CreateInput = {
    name: 'Test plan',
    amount: 15.0,
    trial_days: 30,
    retry_times: 2,
    currency: 'PEN',
    repeat_every: 1,
    repeat_unit: 'month',
    status_after_retry: 'cancelled',
  };

  describe('Test plans API', () => {
    it('should create a plan', async () => {
      const plan = await openpay.plans.create(testPlan);
      expect(plan).toBeTruthy();
      testPlanId = plan.id;

      console.log('The plan:', plan.id);
    });

    it('should get all plans', async () => {
      await expect(openpay.plans.list()).resolves.toBeTruthy();
    });

    it('should get the plan', async () => {
      await expect(openpay.plans.get(testPlanId)).resolves.toBeTruthy();
    });

    it('should update the plan', async () => {
      await expect(openpay.plans.update(testPlanId, { name: 'Updated test plan' })).resolves.toBeTruthy();
    });
  });

  ////////////////////////////////
  // SUBSCRIPTION TESTS
  ////////////////////////////////

  let testSubscriptionId = '';

  describe('Test subscriptions API', () => {
    it('should create a subscription', async () => {
      const subscription = await openpay.customers.subscriptions.create(testCustomerId, {
        plan_id: testPlanId,
        card_id: testCustomerCardId,
      });
      expect(subscription).toBeTruthy();
      testSubscriptionId = subscription.id;

      console.log('The subscription:', subscription.id);
    });

    it('should get all the subscriptions', async () => {
      await expect(openpay.customers.subscriptions.list(testCustomerId)).resolves.toBeTruthy();
    });

    it('should get the subscription', async () => {
      await expect(
        openpay.customers.subscriptions.get(testCustomerId, testSubscriptionId),
      ).resolves.toBeTruthy();
    });

    it('should update the subscription', async () => {
      await expect(
        openpay.customers.subscriptions.update(testCustomerId, testSubscriptionId, { trial_end_date: today }),
      ).resolves.toBeTruthy();
    });
  });

  ////////////////////////////////
  // TOKEN TESTS
  ////////////////////////////////

  let testTokenId = '';

  const testToken: IOpenpay.Token.CreateInput = {
    card_number: '4111111111111111',
    holder_name: 'Juan Perez Ramirez',
    expiration_year: validExpYear,
    expiration_month: '1',
    cvv2: '110',
    address: {
      city: 'Lima',
      country_code: 'PE',
      postal_code: '110511',
      line1: 'Av 5 de Febrero',
      line2: 'Roble 207',
      line3: 'col carrillo',
      state: 'Lima',
    },
  };

  describe('Test Token API', () => {
    it('should create a token', async () => {
      const token = await openpay.tokens.create(testToken);
      expect(token).toBeTruthy();
      testTokenId = token.id;

      console.log('The token:', token.id);
    });

    it('should get the token', async () => {
      const token = await openpay.tokens.get(testTokenId);
      expect(token).toBeTruthy();
      assert.equal(token.id, testTokenId);
    });
  });

  ////////////////////////////////
  // CHECKOUT TESTS
  ////////////////////////////////

  let testCheckoutId = '';

  const testCheckout: IOpenpay.Checkout.CreateInput = {
    amount: 250,
    currency: 'PEN',
    send_email: false,
    order_id: Date.now().toString(),
    description: 'Link checkout charge',
    redirect_url: 'https://www.openpay.pe',
    customer: {
      email: testCustomer.email,
      last_name: testCustomer.last_name ?? '',
      name: testCustomer.name,
      phone_number: testCustomer.phone_number ?? '',
    },
  };

  describe('Test Checkouts API', () => {
    it('should create a checkout', async () => {
      const checkout = await openpay.checkouts.create(testCheckout);
      expect(checkout).toBeTruthy();
      testCheckoutId = checkout.id;

      console.log('The checkout:', checkout.id);
    });

    it('should get the checkout', async () => {
      const checkout = await openpay.checkouts.get(testCheckoutId);
      expect(checkout).toBeTruthy();
      assert.equal(checkout.id, testCheckoutId);
    });

    it('should update the checkout', async () => {
      const checkout = await openpay.checkouts.update(testCheckoutId, 'available', {
        expiration_date: `${today} 23:59`,
      });
      expect(checkout).toBeTruthy();
      assert.equal(checkout.id, testCheckoutId);
      assert.equal(checkout.status, 'available');
    });

    it('should get all the checkouts', async () => {
      await expect(openpay.checkouts.list()).resolves.toBeTruthy();
    });

    it('should create a customer checkout', async () => {
      const { customer, order_id, ...data } = testCheckout;
      // @ts-expect-error Perú doesn't expect the customer info
      const checkout = await openpay.customers.checkouts.create(testCustomerId, {
        ...data,
        order_id: (Date.now() + 1).toString(),
      });
      expect(checkout).toBeTruthy();

      console.log('The customer checkout:', checkout.id);
    });
  });

  ////////////////////////////////
  //  DELETION TESTS
  ////////////////////////////////

  describe('Test object deletion API', () => {
    it('should delete the subscription', async () => {
      await expect(
        openpay.customers.subscriptions.delete(testCustomerId, testSubscriptionId),
      ).resolves.toBeUndefined();
    });

    it('should delete the plan', async () => {
      await expect(openpay.plans.delete(testPlanId)).resolves.toBeUndefined();
    });

    it('should delete the cards', async () => {
      await expect(openpay.cards.delete(testCardId)).resolves.toBeUndefined();
      await expect(
        openpay.customers.cards.delete(testCustomerId, testCustomerCardId),
      ).resolves.toBeUndefined();
    });

    it('should delete the customers', async () => {
      await expect(openpay.customers.delete(testCustomerId)).resolves.toBeUndefined();
    });
  });
});

/** Format date as yyyy-mm-dd */
function toFilterDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
