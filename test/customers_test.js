var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('gdntnaxvkcdviesgaxem', 'sk_b97e606487d34b44ab66e03d5bd14747');
openpay.setTimeout(10000);
var enableLogging = true;

describe('Get customers list with creation[gte] filter', function()  {
    this.timeout(0);
    it('should return customer list and 200 status code', function(done) {
        var searchParams = {
            'creation[gte]': '2021-01-01',
            'limit':1
        };
        openpay.groups.customers.list(searchParams, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
        });
    })
})

function printLog(code, body, error){
    if(enableLogging){
        console.log(code, _.isUndefined(body) || _.isNull(body) ? '' : _.isArray(body) ? _.pluck(body, 'id') : body.id);
    }
    if(code>=300){
        console.log(' ');
        console.log(error);
        console.log(' ');
    }
}
