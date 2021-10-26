var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m3cji4ughukthjcsglv0', 'sk_f934dfe51645483e82106301d985a4f6', false, 'pe');
openpay.setTimeout(30000);
var enableLogging = true;

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

describe('Create Token', function () {
    this.timeout(0);
    it('should return token  201 status code', function (done) {
        openpay.tokens.create(token, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 201, '');
            done();
        });
    });
});

describe('Get Token', function () {

    describe('Get Token by ID', function () {
        it("should return token and 200 status code", function () {
            openpay.tokens.create(token, function (error, body, response) {
                const tokenId = response.data.id;
                openpay.tokens.get(tokenId, function (error, body, response) {
                    assert.equal(response.statusCode, 200, '');
                    assert.equal(response.data.id, cardId, '');
                    done();
                });
            });
        });
    });
});

function printLog(code, body, error) {
    if (enableLogging) {
        console.log(code, _.isUndefined(body) || _.isNull(body) ? '' : _.isArray(body) ? _.pluck(body, 'id') : body.id);
        console.log(body)
    }
    if (code >= 300) {
        console.log(' ');
        console.log(error);
        console.log(' ');
    }
}
