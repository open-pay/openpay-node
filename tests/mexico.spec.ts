import type { IOpenpay } from '../dist/openpay';

import { assert, describe, expect, it } from 'vitest';
import { Openpay } from '../dist/openpay';

const testPayouts = false;

describe('Test the Openpay México SDK', () => {
  const openpay = new Openpay({
    merchantId: process.env.OPENPAY_MERCHANT_ID ?? '',
    privateKey: process.env.OPENPAY_PRIVATE_KEY ?? '',
    isProductionReady: false,
    countryCode: 'mx',
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
  let testSecondaryCustomerId = '';
  const testCustomer: IOpenpay.Customer.CreateInput = {
    name: 'Juan',
    last_name: 'Pérez',
    email: 'juan@ejemplo.com',
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
  // BANK ACCOUNTS TESTS
  ////////////////////////////////

  let testBankAccountId = '';
  const testBankAccount: IOpenpay.BankAccount.CreateInput = {
    clabe: '021180000118359717',
    holder_name: testCustomer.name,
  };

  describe('Testing bank accounts API', () => {
    it('should create a bank account', async () => {
      const bank = await openpay.customers.bankaccounts.create(testCustomerId, testBankAccount);
      expect(bank).toBeTruthy();
      testBankAccountId = bank.id;

      console.log('The bank account:', bank.id);
    });

    it('should get all bank accounts of the customer', async () => {
      await expect(openpay.customers.bankaccounts.list(testCustomerId)).resolves.toBeTruthy();
    });

    it('should get the test bank account for the customer', async (x) => {
      await expect(
        openpay.customers.bankaccounts.get(testCustomerId, testBankAccountId),
      ).resolves.toBeTruthy();
    });
  });

  ////////////////////////////////
  // CHARGE TESTS
  ////////////////////////////////

  let testTxnId = '';
  let testCustomerTxnId = '';

  const testExistingCardCharge: IOpenpay.Charge.CreateFromCard = {
    amount: 50,
    source_id: '',
    method: 'card',
    device_session_id,
    customer: testCustomer,
    description: 'Test existing card charges',
  };

  const testBankAccountCharge: IOpenpay.Charge.CreateFromBank = {
    amount: 50,
    method: 'bank_account',
    customer: testCustomer,
    description: 'Test bank account charge',
  };

  const testStoreCharge: IOpenpay.Charge.CreateFromStore = {
    amount: 50,
    method: 'store',
    customer: testCustomer,
    description: 'Test store charge',
  };

  const testRefund: IOpenpay.Charge.RefundInput = { description: 'Testing refund' };

  describe('Test charges API', () => {
    it('should get all charges', async () => {
      await expect(openpay.charges.list()).resolves.toBeTruthy();
    });

    it('should create a charge to an existing card', async () => {
      testExistingCardCharge.source_id = testCardId;
      const txn = await openpay.charges.create(testExistingCardCharge);
      expect(txn).toBeTruthy();
      testTxnId = txn.id;

      console.log('The charge to existing card:', txn.id);
    });

    it('should get the created charge', async () => {
      await expect(openpay.charges.get(testTxnId)).resolves.toBeTruthy();
    });

    it('should refund the charge', async () => {
      const txn = await openpay.charges.refund(testTxnId, testRefund);
      expect(txn).toBeTruthy();
    });

    it('should create charge without capture', async () => {
      testExistingCardCharge.source_id = testCardId;
      const txn = await openpay.charges.create({ ...testExistingCardCharge, capture: false });
      expect(txn).toBeTruthy();
      testTxnId = txn.id;

      console.log('The charge without capture:', txn.id);
    });

    it('should capture the charge', async () => {
      await expect(openpay.charges.capture(testTxnId, null)).resolves.toBeTruthy();
    });

    it('should create charge with new bank account', async () => {
      await expect(openpay.charges.create(testBankAccountCharge)).resolves.toBeTruthy();
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

        console.log('The charge to existing customer card:', txn.id);
      });

      it('should get all charges', async () => {
        await expect(openpay.customers.charges.list(testCustomerId)).resolves.toBeTruthy();
      });

      it('should get the created charge', async () => {
        await expect(openpay.customers.charges.get(testCustomerId, testCustomerTxnId)).resolves.toBeTruthy();
      });

      it('should refund the charge', async () => {
        await expect(
          openpay.customers.charges.refund(testCustomerId, testCustomerTxnId, testRefund),
        ).resolves.toBeTruthy();
      });

      it('should create charge with new bank account', async () => {
        const { customer, ...data } = testBankAccountCharge;
        const txn = await openpay.customers.charges.create(testCustomerId, data);
        expect(txn).toBeTruthy();
        console.log('The charge to customer new bank:', txn.id);
      });
    });
  });

  ////////////////////////////////
  // TRANSFERS TESTS
  ////////////////////////////////

  let testTransferTxnId = '';

  describe('Test transfers API', () => {
    it('should create a transfer', async () => {
      const secondaryCustomer = await openpay.customers.create(testCustomer);
      expect(secondaryCustomer).toBeTruthy();
      testSecondaryCustomerId = secondaryCustomer.id;

      const txn = await openpay.customers.transfers.create(testCustomerId, {
        customer_id: testSecondaryCustomerId,
        amount: 1.5,
        description: 'Test transfer',
      });
      expect(txn).toBeTruthy();
      testTransferTxnId = txn.id;

      console.log('The transfer:', txn);
    });

    it('should get all customer transfers', async () => {
      await expect(openpay.customers.transfers.list(testCustomerId)).resolves.toBeTruthy();
    });

    it('should get the transfer', async () => {
      await expect(openpay.customers.transfers.get(testCustomerId, testTransferTxnId)).resolves.toBeTruthy();
    });
  });

  ////////////////////////////////
  // PAYOUT TESTS
  ////////////////////////////////

  let testPayoutTxnId = '';
  let testCustomerPayoutTxnId = '';

  const testCardPayout: IOpenpay.Payout.CreateInput = {
    amount: 1.5,
    method: 'card',
    description: 'Test card payout',
    card: {
      card_number: testCard.card_number,
      holder_name: testCard.holder_name,
      bank_code: '012',
    },
  };

  const testBankPayout: IOpenpay.Payout.CreateInput = {
    amount: 1.5,
    method: 'bank_account',
    description: 'Test bank payout',
    bank_account: {
      clabe: testBankAccount.clabe,
      holder_name: testBankAccount.holder_name,
    },
  };

  if (testPayouts) {
    describe('Test payouts API', () => {
      it('should get all payouts', async () => {
        await expect(openpay.payouts.list()).resolves.toBeTruthy();
      });

      it('should create a payout to a new card', async () => {
        const txn = await openpay.payouts.create(testCardPayout);
        expect(txn).toBeTruthy();
        testPayoutTxnId = txn.id;

        console.log('The payout:', txn.id);
      });

      it('should get the payout', async () => {
        await expect(openpay.payouts.get(testPayoutTxnId)).resolves.toBeTruthy();
      });

      it('should create a payout to a new bank account', async () => {
        await expect(openpay.payouts.create(testBankPayout)).resolves.toBeTruthy();
      });

      it('should create a payout to an existing card', async () => {
        await expect(
          openpay.payouts.create({
            method: 'card',
            destination_id: testCardId,
            amount: 1.5,
            description: 'Test payout to existing card',
          }),
        ).resolves.toBeTruthy();
      });

      it('should create a payout to an existing bank account', async () => {
        await expect(
          openpay.payouts.create({
            method: 'bank_account',
            destination_id: testBankAccountId,
            amount: 1.5,
            description: 'Test payout to existing bank account',
          }),
        ).resolves.toBeTruthy();
      });

      describe('Test customer payouts API', () => {
        it('should create a payout to a new card', async () => {
          const txn = await openpay.customers.payouts.create(testCustomerId, testCardPayout);
          expect(txn).toBeTruthy();
          testCustomerPayoutTxnId = txn.id;

          console.log('The customer payout:', txn.id);
        });

        it('should get all payouts', async () => {
          await expect(openpay.customers.payouts.list(testCustomerId)).resolves.toBeTruthy();
        });

        it('should get the payout', async () => {
          await expect(
            openpay.customers.payouts.get(testCustomerId, testCustomerPayoutTxnId),
          ).resolves.toBeTruthy();
        });

        it('should create a payout to a new bank account', async () => {
          await expect(
            openpay.customers.payouts.create(testCustomerId, testBankPayout),
          ).resolves.toBeTruthy();
        });

        it('should create a payout to an existing card', async () => {
          await expect(
            openpay.customers.payouts.create(testCustomerId, {
              method: 'card',
              destination_id: testCustomerCardId,
              amount: 1.5,
              description: 'Test customer payout to existing card',
            }),
          ).resolves.toBeTruthy();
        });

        it('should create a payout to an existing bank account', async () => {
          await expect(
            openpay.customers.payouts.create(testCustomerId, {
              method: 'bank_account',
              destination_id: testBankAccountId,
              amount: 1.5,
              description: 'Test customer payout to existing bank account',
            }),
          ).resolves.toBeTruthy();
        });
      });
    });
  }

  ////////////////////////////////
  // FEE TESTS
  ////////////////////////////////

  describe('Test fees API', () => {
    it('should charge a fee', async () => {
      const txn = await openpay.fees.create({
        customer_id: testCustomerId,
        amount: 1.5,
        description: 'Test fee',
      });
      expect(txn).toBeTruthy();

      console.log('The fee:', txn.id);
    });

    it('should get all fees', async () => {
      await expect(openpay.fees.list()).resolves.toBeTruthy();
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

    it("should delete the customer's bank account", async () => {
      await expect(
        openpay.customers.bankaccounts.delete(testCustomerId, testBankAccountId),
      ).resolves.toBeUndefined();
    });

    it('should delete the customers', async () => {
      await expect(openpay.customers.delete(testCustomerId)).resolves.toBeUndefined();
      await expect(openpay.customers.delete(testSecondaryCustomerId)).resolves.toBeUndefined();
    });
  });
});

/** Format date as yyyy-mm-dd */
function toFilterDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
