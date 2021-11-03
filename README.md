![Openpay nodejs](http://www.openpay.mx/img/github/nodejs.jpg)

## Installation

`npm install openpay`

## Documentation

Full API documentation available at http://docs.openpay.mx/.

## Overview

```js
//class
var Openpay = require('openpay');
//instantiation
var openpay = new Openpay(' your merchant id ', ' your private key ', [ isProduction ]);
//use the api
openpay.< resource_name >.< method_name >( ... )
```

All methods accept an optional callback as last argument. 

The callback function should follow the format: function(error, body, response) {...}.
* error: null if the response status code is 200, 201, 204
* body: null if the response status code is different from 200, 201, 204

## Examples

### Creating a customer
```js
var newCustomer = {
  "name":"John",
  "email":"johndoe@example.com",
  "last_name":"Doe",
  "address":{
    "city":"Queretaro",
    "state":"Queretaro",
    "line1":"Calle Morelos no 10",
    "line2":"col. san pablo",
    "postal_code":"76000",
    "country_code":"MX"
  },
  "phone_number":"44209087654"
};

openpay.customers.create(newCustomer, function(error, body, response) {
    error;    // null if no error occurred (status code != 200||201||204)
    body;     // contains the object returned if no error occurred (status code == 200||201||204)
    response; // contains the complete response including the status, statusCode, statusMessage, and more information
});
```

### Charging
```js
var newCharge = {
  "method": "card",
  "card": {
    "card_number": "4111111111111111",
    "holder_name": "John Doe",
    "expiration_year": "20",
    "expiration_month": "12",
    "cvv2": "110",
  },
  "amount" : 200.00,
  "description" : "Service Charge",
  "order_id" : "oid-00721"
};
openpay.charges.create(testCreateCharge, function (error, body, response){
  // ...
});
```

### Payout
```js
var payout = {
  "method": "bank_account",
  "bank_account":{
    "clabe":"012298026516924616",
    "holder_name": "John Doe"
  },
  "amount" : 10.50,
  "description" : "Monthly payment"
};
openpay.payouts.create(payout, function (error, body, response){
  // ...
});
```

## Configuration
Before use the library will be necessary to set up your Merchant ID and Private key.

```js
var Openpay = require('openpay');
var openpay = new Openpay('your merchant id', 'your private key', 'mx', false);
openpay.setTimeout(30000);
```

In addition, you can set the merchant id, private key, and the mode like this

```js
openpay.setMerchantId(' your merchant id ');
openpay.setPrivateKey(' your private key ');
openpay.setProductionReady(true)
```

Once configured the library, you can use it to interact with Openpay API services.

## Development

To run the tests you'll need your sandbox credentials: merchant id and private key from your [Dashboard](https://sandbox-dashboard.openpay.mx/):

```bash
$ npm install -g mocha
$ npm test
```

# Implementation

## Usage for Mexico

### Bank accounts

#### Creating a bank account
```js
var customerId = 'customer ID';
var newBankAccount = {
    "clabe": "111111111111111111",
    "holder_name": "Juan H",
    "alias": "Alias"
};
openpay.customers.bankaccounts.create(
    customerId,
    newBankAccount,
    function (error, body, response) {
        // ...
    });
```

#### Get bank account:

```js
var customerId = 'Customer ID';
var bankAccountId = 'Bank Account Id';
openpay.customers.bankaccounts.get(
    customerId,
    bankAccountId,
    function (error, body, response) {
        // ...
    });
```

#### Delete bank account:
```js
var customerId = 'Customer ID';
var bankAccountId = 'Bank Account Id';
openpay.customers.bankaccounts.delete(
    customerId,
    bankAccountId,
    function (error, body, response) {
        // ...
    });
```

#### List bank accounts:
```js
var customerId = 'Customer ID';
var data = {
    "creation": "2021-10-22", // Format yyyy-mm-dd
    "offset": "",
    "limit": ""
}
openpay.customers.bankaccounts.list(
    customerId,
    data,
    function (error, body, response) {
        // ...
    });
```

Instead of the 'creation' field in the 'data' object, you can use:
* "creation[gte]" : "2021-10-22" to find bank accounts created after the given date
* "creation[lte]" : "2021-10-22" to find bank accounts created before the given date

### Cards

#### Create a card

```js
var newCard = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez",
    "expiration_year": 2021,
    "expiration_month": "12",
    "cvv2": "111"
};
openpay.cards.create(
    newCard,
    function (error, body, response) {
        // ...
    });
```
Other way to create a card is through a customer

```js
var customerId = 'Customer ID';
var newCard = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez",
    "expiration_year": 2021,
    "expiration_month": "12",
    "cvv2": "111"
};
openpay.customers.cards.create(
    customerId, newCard,
    function (error, body, response) {
        // ...
    });
```

#### Get a card

```js
var cardId = 'Card ID';
openpay.cards.get(
    cardId,
    function (error, body, response) {
        // ...
    });
```

Just as the method to create a new card, you can get a card through a customer, as is shown below:

```js
var cardId = 'Card ID';
var customerId = 'Customer ID';
openpay.customers.cards.get(
    cardId,
    customerId,
    function (error, body, response) {
        // ...
    });
```

### Charges

### Customers

### Fees

### Groups

### Payouts

### Plans

### Subscriptions

### Tests

### Transfers

## Usage for Colombia

### Cards
#### Create a card
There are three ways to create a card, the first one is with a token.
```js
var data = {
    "token_id": "Token ID",
    "device_session_id": "Device session ID"
};
openpay.cards.create(
    data,
    function (error, body, response) {
        // ...
    });
```
The second one is with the card information only.
```js
var newCard = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez",
    "expiration_year": '28',
    "expiration_month": "12",
    "cvv2": "111"
};
openpay.cards.create(newCard,
    function (error, body, response) {
        // ...
    });
```
And the last one is through a customer.
```js
var customerId = 'Customer ID';
var newCard = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez",
    "expiration_year": '28',
    "expiration_month": "12",
    "cvv2": "111"
};
openpay.customers.cards.create(
    customerId,
    newCard,
    function (error, body, response) {
        // ...
    });
```
#### Get a card
###### Without customer
```js
var cardId = 'Card ID';
openpay.cards.get(
    cardId,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var cardId = 'Card ID';
openpay.customers.cards.get(
    customerId,
    cardId,
    function (error, body, response) {
        // ...
    });
```
#### Delete a card
###### Without customer
```js
var cardId = 'Card ID';
openpay.cards.delete(
    cardId,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var cardId = 'Card ID';
openpay.customers.cards.delete(
    customerId,
    cardId,
    function (error, body, response) {
        // ...
    });
```

#### List cards
###### Without customer
```js
var searchParams = {
    "creation": "2021-10-22", // Format yyyy-mm-dd
    "offset": "",
    "limit": ""
}
openpay.cards.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var searchParams = {
    "creation": "2021-10-22", // Format yyyy-mm-dd
    "offset": "",
    "limit": ""
}
openpay.customers.cards.list(
    customerId,
    searchParams,
    function (error, body, response) {
        // ...
    });
```
Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find bank accounts created after the given date
* "creation[lte]" : "2021-10-22" to find bank accounts created before the given date

### Charges
#### Create a charge
###### With customer
```js
var customerId = 'Customer ID';
var newCharge = {
    "method": "card",
    "source_id": "",
    "amount": 20,
    "description": "Test Charge",
    "currency": "COP",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
}
openpay.customers.charges.create(
    customerId,
    newCharge,
    function (error, body, response) {
        // ...
    });
```

###### Without customer
```js
var newCharge = {
    "source_id": "kdx205scoizh93upqbte",
    "method": "card",
    "amount": 200,
    "currency": "COP",
    "iva": "10",
    "description": "Cargo inicial a mi cuenta",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f",
    "customer": {
        "name": "Cliente Colombia",
        "last_name": "Vazquez Juarez",
        "phone_number": "4448936475",
        "email": "juan.vazquez@empresa.co"
    }
}

penpay.charges.create(
    newCharge,
    function (error, body, response) {
        // ...
    });
```
#### Create a store charge
###### With customer
```js
var customerId = 'Customer ID';
var newCharge = {
    "method": "store",
    "source_id": "",
    "amount": 20,
    "description": "Test Charge",
    "currency": "COP",
    "device_session_id": null
}
openpay.customers.charges.create(
    customerId,
    newCharge,
    function (error, body, response) {
        // ...
    });
```
###### Without customer
```js
var newCharge = {
    "source_id": null,
    "method": "store",
    "amount": 200,
    "currency": "COP",
    "iva": "10",
    "description": "Cargo inicial a mi cuenta",
    "device_session_id": null,
    "customer": {
        "name": "Cliente Colombia",
        "last_name": "Vazquez Juarez",
        "phone_number": "4448936475",
        "email": "juan.vazquez@empresa.co"
    }
}

penpay.charges.create(
    newCharge,
    function (error, body, response) {
        // ...
    });
```

#### Refund a charge
Only card charges can be refunded.

```js
var chargeId = 'Charge ID';
var data = {
    "description": "testing refound",
    "amount": 200
}
openpay.charges.refund(
    chargeId,
    data,
    function (error, body, response) {
        // ...
    });
```
#### Get a charge

###### Without customer
```js
var chargeId = 'Charge ID';
openpay.charges.get(
    chargeId,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var chargeId = 'Charge ID';
openpay.customers.charges.get(
    customerId,
    chargeId,
    function (error, body, response) {
        // ...
    });
```
#### List charges
###### Without customer
```js
var searchParams = {
    'order_id': 'Order ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1,
    'amount': 100,
    'status': 'IN_PROGRESS'
}
openpay.charges.list(searchParams,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var searchParams = {
    'order_id': 'Order ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1,
    'amount': 100,
    'status': 'IN_PROGRESS'
}
openpay.customers.charges.list(
    customerId,
    searchParams,
    function (error, body, response) {
        // ...
    });
```

Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find charges created after the given date
* "creation[lte]" : "2021-10-22" to find charges created before the given date

Instead of the 'amount' field in the 'searchParams' object, you can use:
* "amount[gte]" : 100 to find charges with amount bigger than the amount given
* "amount[lte]" : 100 to find charges with amount smaller than the amount given

Allowed statuses:
* IN_PROGRESS
* COMPLETED
* REFUNDED
* CHARGEBACK_PENDING
* CHARGEBACK_ACCEPTED
* CHARGEBACK_ADJUSTMENT
* CHARGE_PENDING
* CANCELLED
* FAILED
### Customers

####Create a customer
```js
var newCustomer = {
    'external_id' : '',
    "name": "Pedro Diego",
    "last_name": "Alatorre Martínez",
    "email": "pedro.alatorre@comercio.com",
    "phone_number" : "5744484951",
    "customer_address": {
        "department":"Medellín",
        "city":"Antioquía",
        "additional":"Avenida 7f bis # 138-58 Apartamento 942"
    }
};
openpay.customers.create(
    newCustomer,
    function (error, body, response) {
        // ...
    });
```
#### Update a customer
```js
var customerId = 'Customer ID';
var newData = {
    "name": "Pedro Diego",
    "last_name": "Alatorre Martínez",
    "email": "pedro.alatorre@comercio.com",
    "phone_number": "5744484951",
    "customer_address": {
        "department": "Medellín",
        "city": "Antioquía",
        "additional": "Avenida 7f bis # 138-58 Apartamento 942"
    }
};
openpay.customers.update(
    customerId,
    newData,
    function (error, body, response) {
        // ...
    });
```
#### Get a customer
```js
var customerId = 'Customer ID';
openpay.customers.get(
    customerId,
    function (error, body, response) {
        // ...
    });
```
#### Delete a customer
```js
var customerId = 'Customer ID';
openpay.customers.delete(
    customerId,
    function (error, body, response) {
        // ...
    });
```

#### List clients
```js
const searchParams = {
    'external_id': 'External ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1
}
openpay.customers.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```
Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find customers created after the given date
* "creation[lte]" : "2021-10-22" to find customers created before the given date

### Plans
#### Create a plan
```js
var newPlan = {
    "amount": 150,
    "status_after_retry": "CANCELLED",
    "retry_times": 2,
    "name": "Curso de ingles",
    "repeat_unit": "month",
    "trial_days": "30",
    "repeat_every": "1"
};
openpay.plans.create(
    newPlan,
    function (error, body, response) {
        // ...
    });
```
Allowed values for 'status_after_retry':
* UNPAID
* CANCELLED


#### Update a plan
```js
var planId = 'Plan ID';
var newData = {
    "name": "New name",
    "trial_days": 1
}
openpay.plans.update(
    planId,
    newData,
    function (error, body, response) {
        // ...
    });
```
#### Get a plan
```js
var planId = 'Plan ID';
openpay.plans.get(
    planId,
    function (error, body, response) {
        // ...
    });
```
#### Delete a plan
```js
var planId = 'Plan ID';
openpay.plans.delete(
    planId,
    function (error, body, response) {
        // ...
    });
```

#### List plans
```js
var searchParams = {
    'creation': 'yyyy-mm-dd',
    'limit': 10,
    'offset': 1
};
openpay.plans.list(searchParams, function (error, body, response) {
    // ...
});
```
Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find plans created after the given date
* "creation[lte]" : "2021-10-22" to find plans created before the given date

### PSE
#### Create PSE
###### Without a client
```js
var newPse = {
    "method": "bank_account",
    "amount": 10000,
    "currency": "COP",
    "description": "Cargo inicial a mi cuenta",
    "iva": "1900",
    "redirect_url": "/",
    "customer": {
        "name": "Cliente Colombia",
        "last_name": "Vazquez Juarez",
        "email": "juan.vazquez@empresa.co",
        "phone_number": "4448936475",
        "requires_account": false,
        "customer_address": {
            "department": "Medellín",
            "city": "Antioquía",
            "additional": "Avenida 7m bis #174-25 Apartamento 637"
        }
    }
}
openpay.pse.create(
    newPse,
    function (error, body, response) {
        // ...
    });
```
###### With existing client
```js
var customerId = 'Customer ID';
var newPse = {
    "method": "bank_account",
    "amount": 10000,
    "currency": "COP",
    "description": "Cargo inicial a mi cuenta",
    "iva": "1900",
    "redirect_url": "/"
}
openpay.customers.pse.create(
    customerId,
    newPse,
    function (error, body, response) {
        // ...
    });
```
### Subscriptions
#### Create a subscription
```js
var customerId = 'Customer ID';
var newSubscription = {
    "card": {
        "card_number": "4111111111111111",
        "holder_name": "Juan Perez Ramirez",
        "expiration_year": "20",
        "expiration_month": "12",
        "cvv2": "110",
        "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
    },
    "plan_id": "pbi4kb8hpb64x0uud2eb",
    "trial_end_date": "yyyy-mm-dd",
    "source_id": "pbiskbfhps64f0uudgeb"
}
openpay.customers.subscriptions.create(
    customerId,
    newSubscription,
    function (error, body, response) {
        // ...
    });
```
#### Update subscription
```js
var subscriptionId = 'Subscription ID';
const newData = {
    "trial_end_date": "2021-12-12",
    "cancel_at_period_end": true,
    "source_id": "pbiskbfhps64f0uudgeb",
    "card": {
        "card_number": "4111111111111111",
        "holder_name": "Juan Perez Ramirez",
        "expiration_year": "20",
        "expiration_month": "12",
        "cvv2": "110",
        "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
    }
}
openpay.customers.subscriptions.update(
    subscriptionId,
    newData,
    function (error, body, response) {
        // ...
    });
```
#### Get a subscription
```js
var customerId = 'Customer ID';
var subscriptionId = 'Subscription ID';
openpay.customers.subscriptions.get(
    customerId,
    subscriptionId,
    function (error, body, response) {
        // ...
    });
```
#### Cancel a subscription
```js
var subscriptionId = 'Subscription ID';
openpay.customers.subscriptions.delete(
    subscriptionId,
    function (error, body, response) {
        // ...
    });
```
#### List subscriptions
```js
var searchParams = {
    'creation': 'yyyy-mm-dd',
    'limit': 10,
    'offset': 1
};
openpay.customers.subscriptions.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```
Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find subscriptions created after the given date
* "creation[lte]" : "2021-10-22" to find subscriptions created before the given date

### Webhooks
#### Create a webhook
```js
var newWebhook = {
    "url": "https://my-site.com/my-webhook",
    "user": "juanito",
    "password": "passjuanito",
    "event_types": [
        "charge.refunded",
        "charge.failed",
        "charge.cancelled",
        "charge.created",
        "chargeback.accepted"
    ]
}
openpay.webhooks.create(
    newWebhook,
    function (error, body, response) {
        // ...
    });
```
#### Get a webhook
```js
var webhookId = 'Webhook ID';
openpay.webhooks.get(
    webhookId,
    function (error, body, response) {
        // ...
    });
```

#### Delete a webhook
```js
var webhookId = 'Webhook ID';
openpay.webhooks.delete(
    webhookId,
    function (error, body, response) {
        // ...
    });
```
#### List webhooks
```js
openpay.webhooks.list(
    function (error, body, response) {
        // ...
    });
```

### Tokens
#### Create a token
```js
var newToken = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez Ramirez",
    "expiration_year": "29",
    "expiration_month": "12",
    "cvv2": "110",
    "address": {
        "city": "Bogotá",
        "country_code": "CO",
        "postal_code": "110511",
        "line1": "Av 5 de Febrero",
        "line2": "Roble 207",
        "line3": "col carrillo",
        "state": "Bogota"
    }
};
openpay.tokens.create(
    tokenNew,
    function (error, body, response) {
        // ...
    });
```
#### Get a token
```js
var tokenId = 'Token ID';
openpay.tokens.get(
    tokenId,
    function (error, body, response) {
        // ...
    });
```
### Stores
#### List stores
```js
var location = {
    "latitud": 4.65589142889691,
    "longitud": -74.11335673251888,
    "kilometers": 10,
    "amount": 1
}
openpay.stores.list(
    location,
    function (error, body, response) {
        // ...
    });
```

## Usage for Peru
### Charges
####Create a charge
###### With customer
```js
var customerId = 'Customer ID';
const newCharge = {
    "source_id": "kdx205scoizh93upqbte",
    "method": "card",
    "amount": 716,
    "currency": "PEN",
    "description": "Cargo inicial a mi cuenta",
    "order_id": "oid-65584",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
}
openpay.customers.charges.create(
    customerId,
    newCharge,
    function (error, body, response) {
        // ...
    });
```
###### Without customer
```js
var newCharge = {
    "source_id": "kdx205scoizh93upqbte",
    "method": "card",
    "amount": 100,
    "currency": "PEN",
    "description": "Cargo inicial a mi cuenta",
    "order_id": "oid-65584",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f",
    "customer": {
        "name": "Cliente Perú",
        "last_name": "Vazquez Juarez",
        "phone_number": "4448936475",
        "email": "juan.vazquez@empresa.pe"
    }
};
openpay.charges.create(
    newCharge,
    function (error, body, response) {
        // ...
    });
```
###### Store charge
```js
var newCharge = {
    "source_id": null,
    "method": "store",
    "amount": 100,
    "currency": "PEN",
    "description": "Cargo inicial a mi cuenta",
    "order_id": "oid-65584",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f",
    "customer": {
        "name": "Cliente Perú",
        "last_name": "Vazquez Juarez",
        "phone_number": "4448936475",
        "email": "juan.vazquez@empresa.pe"
    }
};
openpay.charges.create(
    newCharge,
    function (error, body, response) {
        // ...
    });
```
#### Get a charge
###### Without customer
```js
var chargeId = 'Charge ID';
openpay.charges.get(
    chargeId,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var chargeId = 'Charge ID';
openpay.customers.charges.get(
    customerId,
    chargeId,
    function (error, body, response) {
        // ...
    });
```
#### List charges
###### Without customer
```js
var searchParams = {
    'order_id': 'Order ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1,
    'amount': 100,
    'status': 'IN_PROGRESS'
}
openpay.charges.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```
######With customer
```js
var customerId = 'Customer ID';
var searchParams = {
    'order_id': 'Order ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1,
    'amount': 100,
    'status': 'IN_PROGRESS'
};

openpay.customers.charges.list(
    customerId,
    searchParams,
    function (error, body, response) {
        // ...
    });
```
Instead of the 'creation' field in the 'searchParams' object, you can use:

* "creation[gte]" : "2021-10-22" to find charges created after the given date
* "creation[lte]" : "2021-10-22" to find charges created before the given date

Instead of the 'amount' field in the 'searchParams' object, you can use:

* "amount[gte]" : 100 to find charges with amount bigger than the amount given
* "amount[lte]" : 100 to find charges with amount smaller than the amount given

Allowed statuses:
* IN_PROGRESS
* COMPLETED
* REFUNDED
* CHARGEBACK_PENDING
* CHARGEBACK_ACCEPTED
* CHARGEBACK_ADJUSTMENT
* CHARGE_PENDING
* CANCELLED
* FAILED


### Checkouts
#### Create a checkout
###### Without customer
```js
var newCheckout = {
    "amount": 250,
    "currency": "PEN",
    "description": "Cargo cobro con link",
    "redirect_url": "https://misitioempresa.pe",
    "order_id": "oid-66393",
    "expiration_date": "2021-08-31 12:50",
    "send_email": "true",
    "customer": {
        "name": "Cliente Perú",
        "last_name": "Vazquez Juarez",
        "phone_number": "4448936475",
        "email": "juan.vazquez@empresa.pe"
    }
}
openpay.checkouts.create(
    newCheckout,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var newCheckout = {
    "amount": 250,
    "currency": "PEN",
    "description": "Cargo cobro con link cliente",
    "redirect_url": "https://misitioempresa.pe",
    "order_id": "oid-87491",
    "send_email": "true"
}
openpay.customers.checkouts.create(
    customerId,
    newCheckout,
    function (error, body, response) {
        // ...
    });
```
#### List checkouts
```js
var searchParams = {
    "limit": 2,
    "startDate": "20211001", // Format: yyyymmdd
    "endDate": "20211011" // Format: yyyymmdd
};
openpay.checkouts.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```

#### Update checkout
```js
var checkoutId = 'Checkout ID';
var newStatus = "available";
var newData = {
    "expiration_date": "2021-10-26 13:43" //Format: yyyy-mm-dd HH:mm
}

openpay.checkouts.update(
    checkoutId,
    newStatus,
    newData,
    function (error, body, response) {
        // ...
    });
```
Allowed statuses:
* available
* other
* other

#### Get checkout
```js
var checkoutId = 'Checkout ID';
openpay.checkouts.get(
    checkoutId,
    function (error, body, response) {
        // ...
    });
```
### Customers
#### Create a customer
```js
var newCustomer = {
    "name": "Juan",
    "last_name": "Perez",
    "email": "juan.perez.@email.com",
    "phone_number": "1234567890",
    "address": {
        "country_code": "PE",
        "postal_code": "12345",
        "city": "Lima",
        "state": "Lima",
        "line1": "Perú",
        "line2": "Perú",
        "line3": "Perú"
    }
};
openpay.customers.create(
    newCustomer,
    function (error, body, response) {
        // ...
    });
```
#### Update a customer
```js
var customerId = 'Customer ID';
var newData = {
    "name": "Juan",
    "last_name": "Perez",
    "email": "juan.perez.@email.com",
    "phone_number": "1234567890",
    "address": {
        "country_code": "PE",
        "postal_code": "12345",
        "city": "Lima",
        "state": "Lima",
        "line1": "Perú",
        "line2": "Perú",
        "line3": "Perú"
    }
}
openpay.customers.update(
    customerId,
    newData,
    function (error, body, response) {
        // ...
    });
```
#### Get a customer
```js
var customerId = 'Customer ID';
openpay.customers.get(
    customerId,
    function (error, body, respose) {
        // ...
    });
```
#### Delete a customer
```js
var customerId = 'Customer ID';
openpay.customers.delete(
    customerId,
    function (error, body, respose) {
        // ...
    });
```
#### List clients
```js
var searchParams = {
    'external_id': 'External ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1
};
openpay.customers.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```
Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find customers created after the given date
* "creation[lte]" : "2021-10-22" to find customers created before the given date
### Cards
#### Create a card
###### With customer

```js
var customerId = 'Customer ID';
var newCard = {
    "holder_name": "Juan Perez",
    "card_number": "4111111111111111",
    "cvv2": "651",
    "expiration_month": "09",
    "expiration_year": "25"
};
openpay.customers.cards.create(
    customerId,
    newCard,
    function (error, body, response) {
        // ...
    });
```
###### Without customer
```js
var newCard = {
    "holder_name": "Juan Perez",
    "card_number": "4111111111111111",
    "cvv2": "651",
    "expiration_month": "09",
    "expiration_year": "25"
};
openpay.cards.create(
    newCard,
    function (error, body, response) {
        // ...
    });
```
###### With Token
```js
var data = {
    "token_id": "Token ID",
    "device_session_id": "Device session ID"
};
openpay.customers.cards.create(
    data,
    function (error, body, response) {
        // ...
    });
```
###### With Token and customer
```js
var data = {
    "token_id": "Token ID",
    "device_session_id": "Device session ID"
};
var customerId = 'Customer ID';
openpay.customers.cards.create(
    customerId,
    data,
    function (error, body, response) {
        // ...
    });
```
#### Get a card
###### Without customer
```js
var cardId = 'Card ID';
openpay.cards.get(
    cardId,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var cardId = 'Card ID';
openpay.customers.cards.get(
    customerId,
    cardId,
    function (error, body, response) {
        // ...
    });
```
#### Delete a card
###### With customer
```js
var customerId = 'Customer ID';
var cardId = 'Card ID';
openpay.customers.cards.delete(
    customerId,
    cardId,
    function (error, body, response) {
        // ...
    });
```
###### Without customer
```js
var cardId = 'Card ID';
openpay.cards.delete(
    cardId,
    function (error, body, response) {
        // ...
    });
```
#### List cards
###### With customer
```js
var customerId = 'Customer ID';
var searchParams = {
    'creation': '2021-01-01', // Format yyyy-mm-dd
    'offset': 10,
    'limit': 1
};
openpay.customers.cards.list(
    customerId,
    searchParams,
    function (error, body, response) {
        // ...
    });
```
###### Without customer
```js
var searchParams = {
    'creation': '2021-01-01', // Format yyyy-mm-dd
    'offset': 10,
    'limit': 1
};
openpay.cards.list(
    searchParams,
    function (error, body, response) {
        // ...
    });
```
Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find cards created after the given date
* "creation[lte]" : "2021-10-22" to find cards created before the given date
### Webhooks
#### Create a webhook
```js
var webhook = {
    "url": "https://mysite.com/myWebhook",
    "user": "juanito",
    "password": "passjuanito",
    "event_types": [
        "charge.failed",
        "charge.cancelled",
        "charge.created",
        "chargeback.accepted"
    ]
}
openpay.webhooks.create(webhook, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 201, '');
            done();
        });
```
#### Get a webhook
```js
var webhookId = 'Webhook ID';
openpay.webhooks.get(webhookId,
    function (error, body, response) {
        // ...
    });
```
#### Delete a webhook
```js
var webhookId = 'Webhook ID';
openpay.webhooks.delete(
    webhookId,
    function (error, body, response) {
        // ...
    });
```
#### List webhooks
```js
openpay.webhooks.list(
    function (error, body, response) {
        // ...
    });
```
### Tokens
#### Create a token
```js
const newToken = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez Ramirez",
    "expiration_year": "21",
    "expiration_month": "12",
    "cvv2": "110",
    "address": {
        "city": "Lima",
        "country_code": "PE",
        "postal_code": "110511",
        "line1": "Av 5 de Febrero",
        "line2": "Roble 207",
        "line3": "col carrillo",
        "state": "Lima"
    }
}
openpay.tokens.create(
    newToken,
    function (error, body, response) {
        // ...
    });
```
#### Get a token
```js
var tokenId = 'Token ID';
openpay.tokens.get(
    tokenId,
    function (error, body, response) {
        // ...
    });
```
