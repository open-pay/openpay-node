var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m3cji4ughukthjcsglv0', 'sk_f934dfe51645483e82106301d985a4f6', 'pe',false);
openpay.setTimeout(30000);
var enableLogging = true;

const customer = {
    "name": "Marco",
    "last_name": "Morales Perez",
    "email": "marco.mp@qrsof.com",
    "phone_number": "5744484951",
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

const customerCheckout = {
    "amount": 250,
    "currency": "PEN",
    "description": "Cargo cobro con link cliente",
    "redirect_url": "https://misitioempresa.pe",
    "order_id": "oid-87491", // Cambiar por un OID nuevo
    "send_email": "true"
}

const merchantCheckout = {
    "amount": 250,
    "currency": "PEN",
    "description": "Cargo cobro con link",
    "redirect_url": "https://misitioempresa.pe",
    "order_id": "oid-66393", // Cambiar por un OID nuevo
    "expiration_date": "2021-08-31 12:50",
    "send_email": "true",
    "customer": {
        "name": "Cliente Perú",
        "last_name": "Vazquez Juarez",
        "phone_number": "4448936475",
        "email": "juan.vazquez@empresa.pe"
    }
}

describe('List checkouts', function () {
    this.timeout(0);
    describe('List merchant checkouts', function () {
        it('should return checkout list and 200 status code', function (done) {
            openpay.checkouts.list(function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                done();
            });
        });
    });
})


describe('Create checkouts', function () {
    this.timeout(0);
    describe('create customer checkout', function () {
        it('should return checkout  200 status code', function (done) {
            openpay.customers.create(customer, function (error, body, response) {
                const customerId = response.data.id;
                openpay.customers.checkouts.create(customerId, customerCheckout, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        })
    });

    describe('create merchant checkout', function () {
        it('should return checkout  200 status code', function (done) {
            openpay.checkouts.create(merchantCheckout, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                done();
            });
        });
    });
});


describe('Get checkouts', function () {
    this.timeout(0);
    describe('get checkout by id', function () {
        it("should return checkout and 200 status code", function () {
            openpay.checkouts.create(merchantCheckout, function (error, body, response) {
                const checkoutId = response.data.id;
                openpay.checkouts.get(checkoutId, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    assert.equal(response.data.id, checkoutId, '');
                    done();
                });
            });
        });
    });

    describe('get customer checkouts', function () {
        it('should return customer checkouts list', function () {
            openpay.customers.list({}, function (error, body, response) {
                const customer = response.data[0];
                console.log('response', response.data[0]);
                openpay.customers.checkouts.create(customer.id, customerCheckout, function (error, body, reponse) {
                    printLog(response.statusCode, body, error);
                    const checkout = response.data;
                    openpay.customers.checkouts.get(customer.id, checkout.id, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode, 200, '');
                        assert.equal(response.data.id, checkout.id, '')
                        done();
                    });
                })
            });
        });
    });
});

describe('Update checkouts', function () {
    this.timeout(0);
    it('should return checkouts status 200', function () {
        openpay.checkouts.create(merchantCheckout, function (error, body, reponse) {
            const checkout = reponse.data;
            const expirationDate = "2021-10-26 13:43"
            const status = "available";
            const data = {"expiration_date": expirationDate}

            openpay.checkouts.update(checkout.id, status, data, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                assert.equal(response.data.id, checkout.id, '');
                assert.equal(response.data.status, status, '');
                assert.equal(response.data.expiration_date, expirationDate.replace(' ','T') + ':00.000-050', '');
            });
        });
    });
});

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
