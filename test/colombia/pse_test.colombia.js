var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', 'co', false);
openpay.setTimeout(30000);
var enableLogging = true;

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

var newPseWithCustomer = {
    "method": "bank_account",
    "amount": 10000,
    "currency": "COP",
    "description": "Cargo inicial a mi cuenta",
    "iva": "1900",
    "redirect_url": "/"
}

var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com",
    "requires_account": false
};


describe('Testing pse', function () {
    this.timeout(0);


    describe('create pse with existing client', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.pse.create(newPse, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('create pse with new client', function () {
        var customerCreated;
        it('create customer', function (done) {
            openpay.customers.create(testCreateCustomer, function (error, body, response) {
                customerCreated = body;
                done();
            });
        });

        it('should return statusCode 200||201', function (done) {
            openpay.customers.pse.create(customerCreated.id, newPseWithCustomer, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            })
        });

    });
})

function printLog(code, body, error) {
    if (enableLogging) {
        console.log(code, _.isUndefined(body) || _.isNull(body) ? '' : _.isArray(body) ? _.pluck(body, 'id') : body.id);
    }
    if (code >= 300) {
        console.log(' ');
        console.log(error);
        console.log(' ');
    }
}
