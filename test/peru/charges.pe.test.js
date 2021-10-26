var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m3cji4ughukthjcsglv0', 'sk_f934dfe51645483e82106301d985a4f6', false, 'pe');
openpay.setTimeout(30000);
var enableLogging = true;

const merchantCharge = {
    "source_id": "kdx205scoizh93upqbte",
    "method": "card",
    "amount": 716,
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
}

const customerCharge = {
    "source_id": "kdx205scoizh93upqbte",
    "method": "card",
    "amount": 716,
    "currency": "PEN",
    "description": "Cargo inicial a mi cuenta",
    "order_id": "oid-65584",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
}

const token = {
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

describe('Get charges list', function () {
    this.timeout(0);
    describe('Get charges list with creation[gte] filter', function () {
        it('should return charges list and 200 status code', function (done) {
            var searchParams = {
                'creation[gte]': '2021-01-01',
                'limit': 1
            };
            openpay.charges.list(searchParams, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                done();
            });
        });
    });
    describe('Get charges list with no filter', function () {
        it('should return charges list and 200 status code', function (done) {
            openpay.charges.list({}, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                done();
            });
        });
    });
    describe('Get customer charges list with creation[gte] filter', function () {
        it('should return charges list and 200 status code', function (done) {
            openpay.customers.list({}, function (error, body, response) {
                const customer = response.data[0];
                var searchParams = {
                    'creation[gte]': '2021-01-01',
                    'limit': 1
                };
                openpay.customers.charges.list(customer.id, searchParams, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            })
        });
    });
    describe('Get customer charges list with no filter', function () {
        it('should return charges list and 200 status code', function (done) {
            openpay.customers.list({}, function (error, body, response) {
                const customer = response.data[0];
                openpay.customers.charges.list(customer.id, {}, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            })
        });
    });
});

describe('Create charges', function () {
    this.timeout(0);
    describe('create customer charge', function () {
        it('should return card  200 status code', function (done) {
            openpay.tokens.create(token, function (error, body, response) {
                const token = response.data;
                customerCharge.source_id = token.id;
                customerCharge.order_id = 'oid-65784';
                openpay.customers.list({}, function(error, body, response) {
                    const customer = response.data[0];
                    openpay.customers.charges.create(customer.id, customerCharge, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode, 200, '');
                        done();
                    });
                });
            });
        });
    });

    describe('create merchant charge', function () {
        it('should return charge  200 status code', function (done) {
            openpay.tokens.create(token, function (error, body, response) {
                const token = response.data;
                merchantCharge.source_id = token.id;
                openpay.charges.create(merchantCharge, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
    });

    describe('create merchant store charge', function () {
        it('should return charge  200 status code', function (done) {
            merchantCharge.source_id = '';
            merchantCharge.order_id = 'oid-63384';
            merchantCharge.method = 'store';
            openpay.charges.create(merchantCharge, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                done();
            });
        });
    });
});

describe('Get charges', function () {

    describe('Get charge by id', function () {
        it("should return card and 200 status code", function () {
            openpay.tokens.create(token, function (error, body, response) {
                const token = response.data;
                merchantCharge.source_id = token.id;
                merchantCharge.order_id = 'oid-65539';
                openpay.charges.create(merchantCharge, function (error, body, response) {
                    const charge = response.data;
                    openpay.charges.get(charge.id, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode, 200, '');
                        assert.equal(response.data.id, charge.id, '');
                        done();
                    });
                });
            });
        });
    });

    describe('Get customer charge by id', function () {
        it('should customer card list', function () {
            openpay.tokens.create(token, function (error, body, response) {
                const token = response.data;
                customerCharge.source_id = token.id;
                customerCharge.order_id = 'oid-25784'
                openpay.customers.list({}, function(error, body, response) {
                    const customer = response.data[0];
                    openpay.customers.charges.create(customer.id, customerCharge, function (error, body, response) {
                        const charge = response.data;
                        openpay.customers.charges.get(customer.id, charge.id, function(error, body, response) {
                            printLog(response.statusCode, body, error);
                            assert.equal(response.statusCode, 200, '');
                            assert.equal(response.data.id, charge.id, '');
                            done();
                        });
                    });
                });
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
