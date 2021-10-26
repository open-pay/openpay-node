var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', false, 'co');
openpay.setTimeout(30000);
var enableLogging = true;


var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com",
    "requires_account": false
};

var newCard = {
    "holder_name": "DinnersClub",
    "card_number": 4111111111111111,
    "cvv2": "651",
    "expiration_month": 11,
    "expiration_year": 28
}

var chargeCreated;
var cardCreated;
var testCard = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez",
    "expiration_year": 28,
    "expiration_month": "12",
    "cvv2": "111"
};

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

var testCreateCharge = {
    "method": "card",
    "source_id": "",
    "amount": 20,
    "description": "Test Charge",
    "currency": "COP",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"

}

describe('Testing charges', function () {
    this.timeout(0);
    describe('Merchant charges', function () {
        describe('Create charge with existing card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.cards.create(newCard, function (error, body, response) {
                    cardCreated = body;
                    newCharge.source_id = body.id;
                    openpay.charges.create(newCharge, function (error, body, response) {
                        chargeCreated = body;
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode === 200 || response.statusCode === 201, true, 'Status code == 200');
                        done();
                    });
                });


            });
        });
        describe('Refund merchant charge', function () {
            it('should return statusCode 200', function (done) {
                openpay.charges.create(newCharge, function (error, body, response) {
                    openpay.charges.refund(body.id, {
                        description: "testing refound",
                        amount: 200
                    }, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode, 200, '');
                        done();
                    });
                });

            });
        });
        describe('Create store charge', function () {
            it('should return statusCode 200||201', function (done) {
                newCharge.method = "store";
                newCharge.source_id = null;
                openpay.charges.create(newCharge, function (error, body, response) {
                    chargeCreated = newCharge;
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            })
        });

        describe('Get charge', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.charges.get(chargeCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    done();
                })
            })
        });

        describe('Get All charges', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.charges.list({}, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    done();
                })
            })
        });
    });

    describe('customer charges', function () {
        var customer;
        var cardCreated;
        var chargeCreated;
        describe('Create customer charge with existing card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.create(testCreateCustomer, function (error, body, response) {
                    customer = body;
                    openpay.customers.cards.create(customer.id, testCard, function (error, body, response) {
                        testCreateCharge.source_id = body.id;
                        cardCreated = body;
                        openpay.customers.charges.create(customer.id, testCreateCharge, function (error, body, response) {
                            chargeCreated = body;
                            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
                            done();
                        })
                    });

                });
            });
        });
        describe('Refund customer charge', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.charges.refund(customer.id, chargeCreated.id, {
                    description: "testing refound",
                    amount: 20
                }, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            })
        });

        describe('Create store charge', function () {
            it('should return statusCode 200||201', function (done) {
                newCharge.method = "store";
                newCharge.source_id = null;
                newCharge.customer = null;
                openpay.customers.charges.create(customer.id, newCharge, function (error, body, response) {
                    chargeCreated = body;
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            })
        });

        describe('Get charge', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.charges.get(customer.id, chargeCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    done();
                })
            })
        });
        describe('Get All charges', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.charges.list(customer.id, {}, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    done();
                })
            })
        });
    })


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
