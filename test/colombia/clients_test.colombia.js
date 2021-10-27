var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', 'co', false);
openpay.setTimeout(10000);
var enableLogging = true;

var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com",
    "requires_account": false
};

describe('Customer testing', function () {
    var customer;
    describe('Create customer', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.customers.create(testCreateCustomer, function (error, body, response) {
                customer = body;
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Update customer', function () {
        it('should return statusCode 200||201', function (done) {
            testCreateCustomer.name = "Client update";
            openpay.customers.update(customer.id, testCreateCustomer, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            })
        });
    });

    describe('Get customer', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.customers.get(customer.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Customer List', function () {
        it('should return statusCode 200||201', function (done) {
            var searchParams = {
                'limit': 10
            };
            openpay.customers.list(searchParams, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Delete customer', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.customers.delete(customer.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204, true, '');
                done();
            });
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
