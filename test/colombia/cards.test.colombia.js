var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', 'co', false);
openpay.setTimeout(30000);
var enableLogging = true;

var testCard = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez",
    "expiration_year": '28',
    "expiration_month": "12",
    "cvv2": "111"
};

var newToken = {
    "card_number": "4111111111111111",
    "holder_name": "Juan Perez Ramirez",
    "expiration_year": "28",
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
}
var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com",
    "requires_account": false
};

var cardCreated;
var tokenCreated;
var customerCreated;

describe('Testing cards', function () {
    this.timeout(0);
    describe('Testing Merchant cards', function () {
        describe('create card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.cards.create(testCard, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });
        describe('create card with token', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.tokens.create(newToken, function (error, body, response) {
                    tokenCreated = body;
                    openpay.cards.create({
                        token_id: tokenCreated.id,
                        device_session_id: tokenCreated.id
                    }, function (error, body, response) {
                        cardCreated = body;
                        assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                        done();
                    });
                });
            });
        });

        describe('get card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.cards.get(cardCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('List cards', function () {
            var searchParams = {
                'limit': 1
            };
            it('should return statusCode 200||201', function (done) {
                openpay.cards.list(searchParams, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('update card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.cards.update(cardCreated.id, {holder_name: 'new holder_name'}, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('delete card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.cards.delete(cardCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });


    });

    describe("Testing Customer cards", function () {
        describe('create customer', function () {
            it('', function (done) {
                openpay.customers.create(testCreateCustomer, function (error, body, response) {
                    customerCreated = body;
                    done();
                });
            });

        });

        describe('create card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.cards.create(customerCreated.id, testCard, function (error, body, response) {
                    cardCreated = body;
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('create card with token', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.tokens.create(newToken, function (error, body, response) {
                    tokenCreated = body;
                    openpay.customers.cards.create(customerCreated.id, {
                        token_id: tokenCreated.id,
                        device_session_id: tokenCreated.id
                    }, function (error, body, response) {
                        cardCreated = body;
                        assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                        done();
                    });
                });
            });
        });

        describe('get card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.cards.get(customerCreated.id, cardCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('List cards', function () {
            var searchParams = {
                'limit': 1
            };
            it('should return statusCode 200||201', function (done) {
                openpay.customers.cards.list(customerCreated.id, searchParams, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('update card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.cards.update(customerCreated.id, cardCreated.id, {holder_name: 'new holder_name'}, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                    done();
                })
            });
        });

        describe('delete card', function () {
            it('should return statusCode 200||201', function (done) {
                openpay.customers.cards.delete(customerCreated.id, cardCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 204, true, '');
                    done();
                })
            });
        });

        describe('delete customer', function () {
            it('delete customer', function (done) {
                openpay.customers.delete(customerCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode === 200 || response.statusCode === 204, true, '');
                    done();
                });
            });

        });
    })

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
