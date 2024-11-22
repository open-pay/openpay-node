![Logo Openpay](https://public.openpay.mx/images/logos/openpay/logo_login.png)

# Openpay Node.js

The official SDK for integrating Openpay into your Node.js apps.

## API Documentation

Full API documentation available at:

- México: https://documents.openpay.mx/docs/api/
- Colombia: https://documents.openpay.co/api/
- Perú: https://documents.openpay.pe/api-v2/

## 🚀 Quick Start

Install:

```bash
# npm
npm i openpay

# pnpm
pnpm i openpay

# yarn
yarn add openpay
```

Instantiate:

```ts
// ESM / Typescript
import { Openpay } from "openpay";

// CommonJS
const { Openpay } = require("openpay");

const openpay = new Openpay({
  merchantId: process.env.OPENPAY_MERCHANT_ID ?? '',
  privateKey: process.env.OPENPAY_PRIVATE_KEY ?? '',
  isProductionReady: false,
  clientIP: '127.0.0.1', // Public IP address of the client
  countryCode: 'mx',
});

// Use the API
await openpay.<resource>.<method>();
```

## ✔️ Features

- ESM and Typescript support
- Async/await support
- Production/Sandbox environments
- Only 1 dependency. Uses [`ofetch`](https://github.com/unjs/ofetch) for simple data fetching
- API errors are thrown by `ofetch`. Use try/catch to handle them gracefully

> [!IMPORTANT]
> Make sure to review the [official documentation for your country](#api-documentation) to know exactly which API methods are available and country-specific fields that might be required.

## ✔️ Compatibility

This SDK is built for Node.js v14.0.0 and above, but might be compatible with older versions.

## ⚙️ Configuration

To instantiate the Openpay SDK, yo need to pass the following configurations:

```ts
import { Openpay } from "openpay";

const openpay = new Openpay({
  // Options
});
```

| Option            | Type                       | Description                                                                                                           |
| ----------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| merchantId        | `string`                   | Your unique merchant ID from the Openpay dashboard                                                                    |
| privateKey        | `string`                   | Your unique private key from the Openpay dashboard                                                                    |
| isProductionReady | `boolean`                  | If `false`, all methods will call the Sandbox API. Otherwise, the Production API will be used.                        |
| countryCode?      | `"mx"` \| `"co"` \| `"pe"` | The country to use the API from. Only México (`mx`), Colombia (`co`) and Perú (`pe`) are supported. Defaults to `mx`. |
| clientIP          | `string`                   | The IP address of the client making the request. Required for charges anti-fraud system.                              |

If your application supports multiple countries, or you have multiple merchant accounts, we recommend creating an `Openpay` instance for each country/merchant to avoid accidentally using the wrong API.

However, if you need to change any of these configurations after instantiation, you can do so with the following methods:

```ts
openpay.setMerchantId("new-merchant-id");
openpay.setPrivateKey("new-private-key");
openpay.setClientIP("127.0.0.1");
openpay.setProductionReady(true);
openpay.setCountryCode("co");
```

## ✔️ Error Handling

Whenever the API returns an error or the SDK is unable to communicate with the API, `Openpay` will throw a `FetchError` from `ofetch`. You can handle any error by wrapping the API call inside of a `try`/`catch` block:

```ts
import { FetchError } from "ofetch";

try {
  const customer = await openpay.customers.create(input);
} catch (error) {
  if (error instanceof FetchError) {
    console.error("Openpay API error:", error.data);
  }
}
```

If the `FetchError` was created by the Openpay API, `error.data` will have this shape:

| Property                | Type                                       |
| ----------------------- | ------------------------------------------ |
| error.data.category     | `"request"` \| `"internal"` \| `"gateway"` |
| error.data.error_code   | `number`                                   |
| error.data.description  | `boolean`                                  |
| error.data.http_code    | `number`                                   |
| error.data.request_id   | `string`                                   |
| error.data.fraud_rules? | `string[]` \| `undefined`                  |

Any other error that was not caused by the Openpay API, such as connection errors, won't have the same `error.data` shape and must be handled as an `ofetch` `FetchError`.

For detailed descriptions and possible error codes, check out [the official documentation](#api-documentation).

## ✔️ Examples

### Creating a customer

```ts
// Optional. Use type safety
import type { IOpenpay } from "openpay";

const input: IOpenpay.Customers.CreateInput = {
  name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone_number: "1234567890",
};

try {
  const customer = await openpay.customers.create(input);
  console.log("The newly created customer:", customer);
} catch (error) {
  console.error("Openpay API error:", error);
}
```

### Creating a charge

```ts
// Optional. Use type safety
import type { IOpenpay } from "openpay";

const input: IOpenpay.Charge.CreateFromCard = {
  amount: 50,
  method: "card",
  description: "Test existing card charges",
  device_session_id: "fraud-protection-token", // Token from client used for fraud prevention
  customer: {
    name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone_number: "1234567890",
  },
  card: {
    card_number: "4111111111111111",
    holder_name: "John Doe",
    expiration_year: "29",
    expiration_month: "1",
    cvv2: "110",
  },
};

try {
  const transaction = await openpay.charges.create(input);
  console.log("The newly created transaction:", transaction);
} catch (error) {
  console.error("Openpay API error:", error);
}
```

> [!TIP]
> For more detailed examples, take a look at the [tests folder](/tests/) and the [API documentation for your country](#api-documentation).

## 🔧 Contributions

To contribute to this project, fork this repository and install the dependencies with pnpm:

```bash
pnpm i
```

The project uses [Biome](https://biomejs.dev/) for linting and formatting. If you are using VS Code, we recommend installing the `biomejs.biome` extension and to disable Prettier (`esbenp.prettier-vscode`) if enabled.

### 🧪 Tests

This project runs tests using [Vitest](https://vitest.dev/) with Typescript.

There are 3 test files available:

- [`tests/colombia.spec.ts`](/tests/colombia.spec.ts)
- [`tests/mexico.spec.ts`](/tests/mexico.spec.ts)
- [`tests/peru.spec.ts`](/tests/peru.spec.ts)

Each one of them tests specific methods that are available to their specific country. However, the one with most of the SDK functionality is [`tests/mexico.spec.ts`](/tests/mexico.spec.ts) since it supports most of the API features.

To run the tests, you must create a `.env.testing` file. Use [`.env.example`](/.env.example) as reference. It must contain the following:

| Variable                  | Description                                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| OPENPAY_MERCHANT_ID       | Your own unique `merchantId` from the Openpay Sandbox Dashboard                                                                                      |
| OPENPAY_PRIVATE_KEY       | Your own unique `privateKey` from the Openpay Sandbox Dashboard                                                                                      |
| OPENPAY_DEVICE_SESSION_ID | A session ID generated by the Openpay.js client for fraud protection                                                                                 |
| OPENPAY_WEBHOOK_TEST_URL  | To test webhooks, you must pass a valid endpoint that would reply with status `200`. We recommend creating a free test url from https://webhook.site |

> [!NOTE]
> Please make sure you use your merchant ID and private key for a **SANDBOX** environment. All tests will run on sandbox mode, so passing production values will cause every test to fail.

Before running the tests, you must build the package:

```bash
pnpm build
```

Now, you can run the tests for a specific country with their own script:

```bash
# For México
pnpm test:mx

# For Colombia
pnpm test:co

# For Perú
pnpm test:pe
```

> [!IMPORTANT]
> The tests depend on having `OPENPAY_MERCHANT_ID` and `OPENPAY_PRIVATE_KEY` from an account created in the country you're running the tests on. For example: if you want to run `pnpm test:co`, you must use a merchant ID and private key from an account created in Openpay Colombia. Otherwise the tests will fail.

> [!NOTE]
> For México tests, the transfers and fees API's might fail since they require the customer to have funds, but the account created during the test won't have any. If you get a different error, please check your implementation.
