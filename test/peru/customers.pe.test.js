var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m3cji4ughukthjcsglv0', 'sk_f934dfe51645483e82106301d985a4f6', 'pe',false);
openpay.setTimeout(10000);
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
describe('Get customers list with creation[gte] filter', function () {
    this.timeout(0);
    it('should return customer list and 200 status code', function (done) {
        var searchParams = {
            'creation[gte]': '2021-01-01',
            'limit': 1
        };
        openpay.customers.list(searchParams, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
        });
    })
})

describe('Create customer ', function () {
    this.timeout(0);
    it('should return customer  201 status code', function (done) {
        openpay.customers.create(customer, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 201, '');
            done();
        });
    })
});


describe('Actualizar customer ', function () {
    this.timeout(0);
    const customerUpdateRequest = {
        "name": "Marco Update",
        "last_name": "Morales Perez",
        "email": "marco.mp.update@qrsof.com",
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
    }
    it('should return customer  200 status code', function (done) {
        openpay.customers.create(customer, function (error, body, response) {
            console.log('response: ', response);
            openpay.customers.update(response.data.id, customerUpdateRequest, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, '');
                done();
            });
        });
    })
});


describe("get client", function () {
    it("should return a customer", function (done) {
        openpay.customers.create(customer, function (error, body, response) {
            const customerId = response.data.id;
            openpay.customers.get(customerId, function (error, body, respose) {
                assert.equal(respose.data.id, customerId, '');
                assert.equal(respose.data.name, 'Marco', '');
                done()
            });
        });
    });

});


describe("delete customer", function () {
    it("should return a 200", function (done) {
        openpay.customers.create(customer, function (error, body, response) {
            const customerId = response.data.id;
            openpay.customers.delete(customerId, function (error, body, respose) {
                assert.equal(respose.statusCode, 204, '');
                done()
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
