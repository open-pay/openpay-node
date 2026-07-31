var assert = require('assert');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', 'co', false);
openpay.setTimeout(20000);
var enableLogging = true;

const tokenNew = {
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
}
describe('Token testing', function () {
    var token;
    describe('Create Token', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.tokens.create(tokenNew, function (error, body, response) {
                token = body;
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });
    describe('Get Token', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.tokens.get(token.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });
})

function printLog(code, body, error) {
    if (enableLogging) {
        console.log(code, body == null ? '' : Array.isArray(body) ? body.map(x => x.id) : body.id);
    }
    if (code >= 300) {
        console.log(' ');
        console.log(error);
        console.log(' ');
    }
}
