var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('mwf7x79goz7afkdbuyqd', 'sk_94a89308b4d7469cbda762c4b392152a',"138.85.61.94", 'co', false);
openpay.setTimeout(20000);
var enableLogging = true;

const newWebhook = {
    "url": "https://webhook.site/fbabe962-95c5-475c-9925-9f769ac3bc7e",
    "user": "juanito",
    "password": "passjuanito",
    "event_types": [
        "charge.refunded",
        "charge.failed",
        "charge.cancelled",
        "charge.created",
        "chargeback.accepted"
    ]
}
describe('Webhook testing', function () {
    var webhook;
    describe('Create webhook', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.webhooks.create(newWebhook, function (error, body, response) {
                webhook = body;
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });


    describe('Get webhook', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.webhooks.get(webhook.id, function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Webhook List', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.webhooks.list(function (error, body, response) {
                assert.equal(response.statusCode === 200 || response.statusCode === 201, true, '');
                done();
            });
        });
    });

    describe('Delete webhook', function () {
        it('should return statusCode 200||201', function (done) {
            openpay.webhooks.delete(webhook.id, function (error, body, response) {
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
