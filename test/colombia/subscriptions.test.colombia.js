var assert = require('assert');
var _ = require('underscore');
var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', 'co', false);
openpay.setTimeout(30000);
var enableLogging = true;


var newPlan = {
    "amount": 150,
    "status_after_retry": "cancelled",
    "retry_times": 2,
    "name": "Curso de ingles",
    "repeat_unit": "month",
    "trial_days": "30",
    "repeat_every": "1"
}

var subscription = {
    "card": {
        "card_number": "4111111111111111",
        "holder_name": "Juan Perez Ramirez",
        "expiration_year": "20",
        "expiration_month": "12",
        "cvv2": "110",
        "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
    },
    "plan_id": "pbi4kb8hpb64x0uud2eb"
}

var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com",
    "requires_account": false
};

describe('Plans testing', function () {
    var plan;
    var customer;
    var subscription;

    describe('Create plan', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.plans.create(newPlan, function (error, body, response) {
                plan = body;
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Create customer', function () {
        it('create customer for test', function (done) {
            openpay.customers.create(testCreateCustomer, function (error, body, response) {
                customer = body;
                done();
            });
        });
    });


    describe('Create subscription', function () {
        subscription.plan_id = plan?.id;
        it('should return statusCode 200||201', function (done) {
            openpay.customers.subscriptions.create(customer.id, subscription, function (error, body, response) {
                subscription = body;
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Update subscription', function () {
        it('should return statusCode 200||201', function (done) {
            const updateSubscription = {trial_end_date: "2021-12-12"}
            openpay.customers.subscriptions.update(subscription.id, updateSubscription, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            })
        });
    });

    describe('Get subscription', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.customers.subscriptions.get(customer.id, subscription.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });


    describe('subscription List', function () {
        it('should return statusCode 200||201', function (done) {
            var searchParams = {
                'limit': 10
            };
            openpay.customers.subscriptions.list(searchParams, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Cancell subscription', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.customers.subscriptions.delete(subscription.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204, true, '');
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
