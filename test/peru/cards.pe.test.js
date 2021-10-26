var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m3cji4ughukthjcsglv0', 'sk_f934dfe51645483e82106301d985a4f6', false, 'pe');
openpay.setTimeout(30000);
var enableLogging = true;
const card = {
    "holder_name": "DinnersClub",
    "card_number": "4111111111111111",
    "cvv2": "651",
    "expiration_month": "09",
    "expiration_year": "25"
};
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

var cardId = '';

describe('Get cards list with creation[lte] filter', function () {
    this.timeout(0);
    it('should return cards list and 200 status code', function (done) {
        var searchParams = {
            'creation[lte]': '2021-01-01',
            'limit': 1
        };
        openpay.cards.list(searchParams, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
        });
    })
})


describe('Create cards', function () {
    this.timeout(0);
    describe('create customer card', function () {
        it('should return card  201 status code', function (done) {
            openpay.customers.create(customer, function (error, body, response) {
                const customerId = response.data.id;
                openpay.customers.cards.create(customerId, card, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 201, '');
                    done();
                });
            });
        })

    });

    describe('create merchant card', function () {
        it('should return card  201 status code', function (done) {
            openpay.cards.create(card, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 201, '');
                done();
            });
        });

    });

});


describe('get cards', function () {

    describe('get card by id', function () {
        it("should return card and 200 status code", function () {
            openpay.cards.create(card, function (error, body, response) {
                const cardId = response.data.id;
                openpay.cards.get(cardId, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    assert.equal(response.data.id, cardId, '');
                    done();
                });
            });
        });
    });

    describe('get customer cards', function () {
        it('should customer card list', function () {
            var searchParams = {
                'creation[gte]': '2021-01-01',
                'limit': 1
            };
            openpay.customers.list(searchParams, function (error, body, response) {
                const customer = response.data[0];
                console.log('response', response.data[0]);
                openpay.customers.cards.list(customer.id, {}, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    assert(response.data.size >= 1);
                    done();
                });
            });
        });
    });

    describe('get customer card id', function () {
        it("should card response and 200 status code", function () {
            var searchParams = {
                'creation[gte]': '2021-01-01',
                'limit': 1
            };
            openpay.customers.list(searchParams, function (error, body, response) {
                const customer = response.data[0];
                openpay.customers.cards.create(customer.id, card, function (error, body, response) {
                    const cardCreated = response.data;
                    openpay.customers.cards.get(customer.id, cardCreated.id, function (error, body, response) {
                        assert.equal(response.statusCode, 200, '');
                        assert.equal(cardCreated.id, response.data.id, '');
                        done();
                    });
                });
            });
        });
    });

});


describe('delete card', function () {
    it('create customer', function (done) {
        var searchParams = {
            'creation[gte]': '2021-01-01',
            'limit': 1
        };
        openpay.customers.list(searchParams, function (error, body, response) {
            const customerGet = response.data[0];
            openpay.customers.cards.create(customerGet.id, card, function (error, body, response) {
                const cardCreated = response.data;
                openpay.customers.cards.delete(customerGet.id, cardCreated.id, function (error, body, response) {
                    assert.equal(response.statusCode, 204, '');
                    done();
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
