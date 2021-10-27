var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a', 'co', false);
openpay.setTimeout(20000);
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
describe('Plans testing', function () {
    var plan;
    describe('Create plan', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.plans.create(newPlan, function (error, body, response) {
                plan = body;
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Update plan', function () {
        it('should return statusCode 200||201', function (done) {
            const updatePlan = {name:"plan updated"}
            openpay.plans.update(plan.id, updatePlan, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            })
        });
    });

    describe('Get plan', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.plans.get(plan.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Plan List', function () {
        it('should return statusCode 200||201', function (done) {
            var searchParams = {
                'limit': 10
            };
            openpay.plans.list(searchParams, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Delete plan', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.plans.delete(plan.id, function (error, body, response) {
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
