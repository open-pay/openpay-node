var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m3cji4ughukthjcsglv0', 'sk_f934dfe51645483e82106301d985a4f6', false, 'pe');
openpay.setTimeout(30000);
var enableLogging = true;
const webhook = {
    "url": "https://webhook.site/dffe8335-b0bb-493f-a38d-3e61b711bd6a", // Cambiar por URL válida
    "user": "juanito",
    "password": "passjuanito",
    "event_types": [
        "charge.failed",
        "charge.cancelled",
        "charge.created",
        "chargeback.accepted"
    ]
}

describe('Create Webhooks', function () {
    this.timeout(0);
    it('should return webhook  201 status code', function (done) {
        openpay.webhooks.create(webhook, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 201, '');
            done();
        });
    });
});

describe('Get webhooks list', function () {
    this.timeout(0);
    it('should return webhooks list and 200 status code', function (done) {
        openpay.webhooks.list(function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
        });
    })
})


describe('Get wehbook by ID', function () {
    it("should return card and 200 status code", function () {
        openpay.webhooks.create(webhook, function (error, body, response) {
            const webhookId = response.data.id;
            openpay.webhooks.get(webhookId, function (error, body, response) {
                assert.equal(response.statusCode, 200, '');
                assert.equal(response.data.id, webhookId, '');
                done();
            });
        });
    });
});

describe('Eliminar Webhook', function () {
    it("should return card and 204 status code", function () {
        openpay.webhooks.list(function (error, body, response) {
            const webhookGet = response.data[0];
            openpay.webhooks.delete(webhookGet.id, function (error, body, response) {
                assert.equal(response.statusCode, 204, '');
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
