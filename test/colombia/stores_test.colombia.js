var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('', '', 'co', false);
openpay.setTimeout(30000);
var enableLogging = true;

const location = {
    "latitud": 4.65589142889691,
    "longitud": -74.11335673251888,
    "kilometers": 10,
    "amount": 1
}

describe('List stores', function () {
    it('List stores by location', function (done) {
        openpay.stores.list(location, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
            done();
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
