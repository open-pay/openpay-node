var assert = require('assert');
var _ = require('underscore');
var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', 'sk_ed05f1de65fa4a67a3d3056a4efa2905');
openpay.setTimeout(20000);
var enableLogging = true;
var customerId = '';
var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com"
};

describe('Get all bank_account with creation filter', function () {
    it('should return statusCode 200', function (done) {
        var searchParams = {
            'creation[lte]': '2021-01-01',
        };
        openpay.customers.create(testCreateCustomer, function (error, body) {
            openpay.customers.bankaccounts.list(body.id, searchParams, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, 'Status code != 400');
                done();
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
