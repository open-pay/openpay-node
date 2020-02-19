var assert = require('assert');
var _ = require('underscore');
var request = require('request');

var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('gdntnaxvkcdviesgaxem', 'sk_b97e606487d34b44ab66e03d5bd14747');
openpay.setTimeout(10000);

var enableLogging = true;
var testCreateCharges = true;

describe('Testing group API', function(){
  this.timeout(0);

  var testCreateCustomer = {
    "name":"Juan",
    "email":"juan@nonexistantdomain.com",
    "requires_account":false
  };
  var testUpdateCustomer = {
    "name":"Juan",
    "email":"juan@nonexistantdomain.com",
    "phone_number":"123456789"
  };

  var newlyCreatedCustomerId = '';
  describe('Testing customers', function(){
    describe('Create customer', function(){
      it('should return statusCode 200||201', function (done){
        openpay.groups.customers.create(testCreateCustomer, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
          newlyCreatedCustomerId = body.id;
          done();
        });
      });
    });
    describe('Get all customers without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.list({}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get customer', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.get(newlyCreatedCustomerId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Update customer', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.update(newlyCreatedCustomerId, testUpdateCustomer, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get all customers with constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.list({'creation':'2013-12-10'}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
  });

  var testCard ={
    "card_number":"4111111111111111",
    "holder_name":"Juan Perez",
    "expiration_year":"20",
    "expiration_month":"12",
    "cvv2":"111"
  };
  var newlyCreatedCardId = '';
  var newlyCreatedCustomerCardId = '';

  describe('Testing cards API', function(){

    describe('Add customer card', function(){
      it('should return statusCode 200||201', function (done){
        openpay.groups.customers.cards.create(newlyCreatedCustomerId, testCard, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
          newlyCreatedCustomerCardId = body.id;
          newlyCreatedCardId = body.id;
          done();
        });
      });
    });
    describe('Get all customer cards without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.cards.list(newlyCreatedCustomerId, {}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get customer card', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.cards.get(newlyCreatedCustomerId, newlyCreatedCustomerCardId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
  });


  //var testGetCharge = 'tlogyahn68d2qurjqhqt';
  var testExistingCardCharge = {
    "source_id" : '',
    "method" : "card",
    "amount" : 50,
    "description" : "Test existing card charge"
  };
  var testCreateCharge = {
    "method": "card",
    "card": {
      "card_number": "4111111111111111",
      "holder_name": "Aa Bb",
      "expiration_year": "20",
      "expiration_month": "12",
      "cvv2": "110",
    },
    "amount" : 20,
    "description" : "Test Charge"
  };
  var testCreateChargeWithoutCapture = {
    "method": "card",
    "card": {
      "card_number": "4111111111111111",
      "holder_name": "Aa Bb",
      "expiration_year": "20",
      "expiration_month": "12",
      "cvv2": "110",
    },
    "amount" : 20,
    "description" : "Test Charge",
    "capture" : false
  };
  var testCreateBankAccountCharge = {
    "method" : "bank_account",
    "amount" : 50,
    "description" : "Test bank account charge"
  };
  var testCreateStoreCharge = {
    "method" : "store",
    "amount" : 60.01,
    "description" : "Test store charge"
  };
  var testRefundData = {"description":"Testing refund"};

  var merchantId = 'm1qp3av1ymcfufkuuoah';

  describe('Testing charges', function(){
    if(testCreateCharges){
      describe('Create charge with existing card', function(){
        it('should return statusCode 200||201', function (done){
          testExistingCardCharge.source_id = newlyCreatedCardId;
          //console.log(testExistingCardCharge);
          openpay.groups.charges.create(merchantId, testExistingCardCharge, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            done();
          });
        });
      });
      var newlyCreatedTransactionId = '';
      describe('Create charge with new card', function(){
        it('should return statusCode 200||201', function (done){
          openpay.groups.charges.create(merchantId, testCreateCharge, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Refund merchant charge', function(){
        it('should return statusCode 200', function (done){
          openpay.groups.charges.refund(merchantId, newlyCreatedTransactionId, testRefundData, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
          });
        });
      });
      describe('Create charge without capture', function(){
        it('should return statusCode 200||201', function (done){
          openpay.groups.charges.create(merchantId, testCreateChargeWithoutCapture, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Capture charge', function(){
        it('should return statusCode 200||201', function (done){
          openpay.groups.charges.capture(merchantId, newlyCreatedTransactionId, null, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            done();
          });
        });
      });
    }

    describe('Create customer charge with existing card', function(){
      it('should return statusCode 200||201', function (done){
        testExistingCardCharge.source_id = newlyCreatedCustomerCardId; //fails if use merchant card
        //console.log(testExistingCardCharge);
        openpay.groups.customers.charges.create(merchantId, newlyCreatedCustomerId, testExistingCardCharge, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          done();
        });
      });
    });
    var newlyCreatedCustomerTransactionId = '';
    describe('Create customer charge with new card', function(){
      it('should return statusCode 200||201', function (done){
        openpay.groups.customers.charges.create(merchantId, newlyCreatedCustomerId, testCreateCharge, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedCustomerTransactionId = body.id;
          done();
        });
      });
    });
  });

  describe('Testing subscriptions', function(){
    newlyCreatedPlanId = 'pdusfyuqsdze2sejn7qy';
    var newlyCreatedSubscriptionId = '';
    describe('Create subscription', function(){
      it('should return statusCode 200||201', function (done){
        var testSubscription = {"plan_id": newlyCreatedPlanId, "card_id": newlyCreatedCustomerCardId, "trial_days": "30"};
        openpay.groups.customers.subscriptions.create(merchantId, newlyCreatedCustomerId, testSubscription, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedSubscriptionId = body.id;
          done();
        });
      });
    });
    describe('Get all subscriptions without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.subscriptions.list(merchantId, newlyCreatedCustomerId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get subscription', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.subscriptions.get(merchantId, newlyCreatedCustomerId, newlyCreatedSubscriptionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Update subscription', function(){
      it('should return statusCode 200', function (done){
        openpay.groups.customers.subscriptions.update(merchantId, newlyCreatedCustomerId, newlyCreatedSubscriptionId, {"trial_end_date": "2022-02-11"}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Delete subscription', function(){
      it('should return statusCode 204', function (done){
        openpay.groups.customers.subscriptions.delete(merchantId, newlyCreatedCustomerId, newlyCreatedSubscriptionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 204, '');
          done();
        });
      });
    });
  });

  describe('Create and delete customer', function(){
    it('should return statusCode 200||201', function (done){
      openpay.groups.customers.create(testCreateCustomer, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
        newlyCreatedCustomerId = body.id;
        done();
      });
    });

    it('should return statusCode 200||201', function (done){
      openpay.groups.customers.cards.create(newlyCreatedCustomerId, testCard, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
        newlyCreatedCustomerCardId = body.id;
        done();
      });
    });

    it('should return statusCode 204', function (done){
      openpay.groups.customers.cards.delete(newlyCreatedCustomerId, newlyCreatedCustomerCardId, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode, 204, '');
        done();
      });
    });
  });

  describe('Delete customer', function(){
    it('should return statusCode 204', function (done){
      openpay.groups.customers.delete(newlyCreatedCustomerId, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode, 204, '');
        done();
      });
    });
  });

});


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

function getVerificationCode(url, callback) {
	  request(url, function(err, res, body){
		    var resCode = res.statusCode;
		    var error = (resCode!=200 && resCode!=201 && resCode!=204) ? body : null;
		    var verification_code = null;
		    console.info('error: ' + error);
		    if (!error) {
		    	verification_code = body.toString().substring(body.indexOf('verification_code') + 28 , body.indexOf('verification_code') + 28 + 8);
		    	console.info('verification_code: ' + verification_code);
		    }
		    callback(error, verification_code);
	  });
}
