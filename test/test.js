var assert = require('assert');
var _ = require('underscore');
var request = require('request');

var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', 'sk_ed05f1de65fa4a67a3d3056a4efa2905');
openpay.setTimeout(10000);

var enableLogging = true;
var testCreateCharges = true;
var testCreatePayouts = true;
var testBankAccountId = 'bmopptj5st1hx8ddouha';

describe('Testing whole API', function(){
  this.timeout(0);

  var testCreateCustomer = {
    "name":"Juan",
    "email":"juan@nonexistantdomain.com"
  };
  var testUpdateCustomer = {
    "name":"Juan",
    "email":"juan@nonexistantdomain.com",
    "phone_number":"123456789"
  };

  describe('Testing Webhook', function() {
	  var webhook;
	  var webhook_params = {                                            
			  'url' : 'http://requestb.in/qozy7dqp',
			  'event_types' : [
			    'charge.refunded',
			    'charge.failed',
			    'charge.cancelled',
			    'charge.created',
			    'chargeback.accepted'
			  ]
	  };
	  
	  describe('Create Webhook', function() {
		  it('Should return statusCode 201', function(done) {
			  openpay.webhooks.create(webhook_params, function (error, body, response){
		          printLog(response.statusCode, body, error);
		          assert.equal(response.statusCode, 201, '');
		          webhook = body;
		          done();
		      });  
		  });
	  });
	  
	  describe('Get webhook by id and status unverified', function() {
		  it('Should return status code 200', function(done) {
			  openpay.webhooks.get(webhook.id, function(error, body, response) {
				  printLog(response.statusCode, body, error);
		          assert.equal(response.statusCode, 200, '');
		          assert.equal(body.status, 'unverified', '');
		          done();
			  });
		  });
	  });
	  
	  describe('Verify webhook code', function() {
		  it('Should return statusCode 204', function(done) {
			  console.info(webhook.url + '?inspect');
			  getVerificationCode(webhook.url + '?inspect', function(error, verification_code) {
				  console.info('webhook.id = ' + webhook.id);
				  console.info('verification_code = ' + verification_code);
				  openpay.webhooks.verify(webhook.id, verification_code, function(error, body, response) {
					  printLog(response.statusCode, body, error);
			          assert.equal(response.statusCode, 204, '');
			          done();  
				  });  
			  })
		  });
	  });
	 
	  
	  describe('Get webhook by id and status verified', function() {
		  it('Should return status code 200', function(done) {
			  openpay.webhooks.get(webhook.id, function(error, body, response) {
				  printLog(response.statusCode, body, error);
		          assert.equal(response.statusCode, 200, '');
		          assert.equal(body.status, 'verified', '');
		          done();
			  });
		  });
	  });
	  
	  describe('List webhooks by id merchant', function() {
		  it('Should return status code 200', function(done) {
			  openpay.webhooks.list(function(error, body, response) {
				  printLog(response.statusCode, body, error);
		          assert.equal(response.statusCode, 200, '');
		          assert.equal(body.length, 1, '');
		          done();
			  });
		  });
	  });
	  
	  describe('Delete webhook by id', function() {
		  it('Should return statusCode 204', function(done) {
			  openpay.webhooks.delete(webhook.id, function(error, body, response) {
				  printLog(response.statusCode, body, error);
		          assert.equal(response.statusCode, 204, '');
		          done();
			  });
		  });
	  });
	  
  });
  
  
  describe('Testing merchant', function() {
    describe('Get merchant', function(){
      it('should return statusCode 200', function (done){
        openpay.merchant.get(function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
  });

  var newlyCreatedCustomerId = '';
  describe('Testing customers', function(){
    describe('Create customer', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.create(testCreateCustomer, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
          newlyCreatedCustomerId = body.id;
          done();
        });
      });
    });
    describe('Get all customers without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.list({}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get customer', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.get(newlyCreatedCustomerId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Update customer', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.update(newlyCreatedCustomerId, testUpdateCustomer, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get all customers with constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.list({'creation':'2013-12-10'}, function (error, body, response){
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
    describe('Add card', function(){
      it('should return statusCode 200||201', function (done){
        openpay.cards.create(testCard, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
          newlyCreatedCardId = body.id;
          done();
        });
      });
    });
    describe('Get all cards without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.cards.list({}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get card', function(){
      it('should return statusCode 200', function (done){
        openpay.cards.get(newlyCreatedCardId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    
    describe('Add customer card', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.cards.create(newlyCreatedCustomerId, testCard, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
          newlyCreatedCustomerCardId = body.id;
          done();
        });
      });
    });
    describe('Get all customer cards without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.cards.list(newlyCreatedCustomerId, {}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get customer card', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.cards.get(newlyCreatedCustomerId, newlyCreatedCustomerCardId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
  });


  var testBankAccount = {
    "clabe":"032180000118359719",
    "holder_name":"Juan H"
  };
  var newlyCreatedBankAccountId = '';

  describe('Testing bankaccounts', function(){
    describe('Create bankaccount', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.bankaccounts.create(newlyCreatedCustomerId, testBankAccount, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
          newlyCreatedBankAccountId = body.id;
          done();
        });
      });
    });
    describe('Get all bank accounts without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.bankaccounts.list(newlyCreatedCustomerId, {}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get bankaccount', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.bankaccounts.get(newlyCreatedCustomerId, newlyCreatedBankAccountId, function (error, body, response){
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

  describe('Testing charges', function(){
    describe('Get all charges without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.charges.list({}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    if(testCreateCharges){
      describe('Create charge with existing card', function(){
        it('should return statusCode 200||201', function (done){
          testExistingCardCharge.source_id = newlyCreatedCardId;
          //console.log(testExistingCardCharge);
          openpay.charges.create(testExistingCardCharge, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            done();
          });
        });
      });
      var newlyCreatedTransactionId = '';
      describe('Create charge with new card', function(){
        it('should return statusCode 200||201', function (done){
          openpay.charges.create(testCreateCharge, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Get charge', function(){
        it('should return statusCode 200', function (done){
          openpay.charges.get(newlyCreatedTransactionId, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
          });
        });
      });
      describe('Refund merchant charge', function(){
        it('should return statusCode 200', function (done){
          openpay.charges.refund(newlyCreatedTransactionId, testRefundData, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
          });
        });
      });
      describe('Create charge without capture', function(){
        it('should return statusCode 200||201', function (done){
          openpay.charges.create(testCreateChargeWithoutCapture, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Capture charge', function(){
        it('should return statusCode 200||201', function (done){
          openpay.charges.capture(newlyCreatedTransactionId, null, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            done();
          });
        });
      });
      describe('Create charge with new bank account', function(){
        it('should return statusCode 200||201', function (done){
          openpay.charges.create(testCreateBankAccountCharge, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Create charge on Store', function(){
        it('should return statusCode 200', function (done){
          openpay.charges.create(testCreateStoreCharge, function (error, body, response){
            assert.equal(response.statusCode, 200, 'Status code != 200');
            assert.notEqual(body.id, null);
            assert.equal(body.method, 'store');
            assert.equal(body.payment_method.type, 'store');
            assert.notEqual(body.payment_method.reference, null);
            assert.notEqual(body.payment_method.barcode_url, null);
            done();
          });
        });
      });
    }

    describe('Create customer charge with existing card', function(){
      it('should return statusCode 200||201', function (done){
        testExistingCardCharge.source_id = newlyCreatedCustomerCardId; //fails if use merchant card
        //console.log(testExistingCardCharge);
        openpay.customers.charges.create(newlyCreatedCustomerId, testExistingCardCharge, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          done();
        });
      });
    });
    var newlyCreatedCustomerTransactionId = '';
    describe('Create customer charge with new card', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.charges.create(newlyCreatedCustomerId, testCreateCharge, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedCustomerTransactionId = body.id;
          done();
        });
      });
    });
    describe('Get all customer charges without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.charges.list(newlyCreatedCustomerId, {}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get customer charge', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.charges.get(newlyCreatedCustomerId, newlyCreatedCustomerTransactionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    /*describe('Refund customer charge', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.charges.refund(newlyCreatedCustomerId, newlyCreatedCustomerTransactionId, testRefundData, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });*/
    describe('Create customer charge with new bank account', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.charges.create(newlyCreatedCustomerId, testCreateBankAccountCharge, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedCustomerTransactionId = body.id;
          done();
        });
      });
    });
  });


  describe('Testing transfers', function(){
    var newlyCreatedTransactionId = '';
    describe('Create transfer', function(){
      it('should return statusCode 200||201', function (done){
        var temporalCustomerId = '';
        openpay.customers.create(testCreateCustomer, function (error, body, response){
          temporalCustomerId = body.id;
          var testTransfer = {
            "customer_id" : temporalCustomerId,
            "amount" : 1.50,
            "description" : "Test transfer"
          };
          openpay.customers.transfers.create(newlyCreatedCustomerId, testTransfer, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            openpay.customers.delete(temporalCustomerId, function(error, response, body){
              done();
            });
          });
        });
      });
    });
    describe('Get all transfers without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.transfers.list(newlyCreatedCustomerId, {}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get transfer', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.transfers.get(newlyCreatedCustomerId, newlyCreatedTransactionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
  });


  var testCardPayout = {
    "method": "card",
    "card": {
      "card_number": "4111111111111111",
      "holder_name": "Juan P",
      "bank_code": "012"
    },
    "amount" : 1.50,
    "description" : "Test card payout"
  };
  var testBankAccountPayout = {
    "method": "bank_account",
    "bank_account":{
      "clabe":"012298026516924616",
      "holder_name": "Juan P"
    },
    "amount" : 1.50,         
    "description" : "Test bank account payout"
  };

  describe('Testing payouts', function(){
    describe('Get all payouts without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.payouts.list({}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    if(testCreatePayouts){
      var newlyCreatedTransactionId = '';
      describe('Create payout with new card', function(){
        it('should return statusCode 200||201', function (done){
          openpay.payouts.create(testCardPayout, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Get payout', function(){
        it('should return statusCode 200', function (done){
          openpay.payouts.get(newlyCreatedTransactionId, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
          });
        });
      });
      describe('Create payout with new bank account', function(){
        it('should return statusCode 200||201', function (done){
          openpay.payouts.create(testBankAccountPayout, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Create payout with existing card', function(){
        it('should return statusCode 200||201', function (done){
          var testExistingCardPayout = {
            "method": "card",
            "destination_id": newlyCreatedCardId,
            "amount": 1.50,
            "description": "Test payout with existing card"
          };
          openpay.payouts.create(testExistingCardPayout, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
      describe('Create payout with existing bank account', function(){
        it('should return statusCode 200||201', function (done){
          var testExistingBankAccountPayout = {
            "method": "bank_account",
            "destination_id": testBankAccountId,
            "amount": 1.50,
            "description": "Test payout with existing bank account"
          };
          openpay.payouts.create(testExistingBankAccountPayout, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
            newlyCreatedTransactionId = body.id;
            done();
          });
        });
      });
    }

    var newlyCreatedCustomerTransactionId = '';
    describe('Create customer payout with new card', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.payouts.create(newlyCreatedCustomerId, testCardPayout, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedCustomerTransactionId = body.id;
          done();
        });
      });
    });
    describe('Get all customer payouts without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.payouts.list(newlyCreatedCustomerId, {}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get customer payout', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.payouts.get(newlyCreatedCustomerId, newlyCreatedCustomerTransactionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Create customer payout with new bank account', function(){
      it('should return statusCode 200||201', function (done){
        openpay.customers.payouts.create(newlyCreatedCustomerId, testBankAccountPayout, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedCustomerTransactionId = body.id;
          done();
        });
      });
    });
    var testExistingItemPayout = {
      "method": "card",
      "destination_id": "",
      "amount": 1.50,
      "description": "Test existing item payout"
    };
    describe('Create customer payout with existing card', function(){
      it('should return statusCode 200||201', function (done){
        testExistingItemPayout.destination_id = newlyCreatedCustomerCardId;
        openpay.customers.payouts.create(newlyCreatedCustomerId, testExistingItemPayout, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          done();
        });
      });
    });
    describe('Create customer payout with existing bank account', function(){
      it('should return statusCode 200||201', function (done){
        testExistingItemPayout.destination_id = newlyCreatedBankAccountId;
        openpay.customers.payouts.create(newlyCreatedCustomerId, testExistingItemPayout, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          done();
        });
      });
    });
  });


  describe('Testing fees', function(){
    describe('Charge fee', function(){
      it('should return statusCode 200||201', function (done){
        var testFee = {
          "customer_id" : newlyCreatedCustomerId,
          "amount" : 1.50,
          "description" : "Test fee"
        };
        openpay.fees.create(testFee, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get all fees without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.fees.list({}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
  });

  var testPlan = {
    "name": "Test plan",
    "amount": 15.00,
    "repeat_every": "1",
    "repeat_unit": "month",
    "retry_times": 2,
    "status_after_retry": "cancelled",
    "trial_days": "30"
  };
  var newlyCreatedPlanId = '';
  describe('Testing plans', function(){
    describe('Create plan', function(){
      it('should return statusCode 200||201', function (done){
        openpay.plans.create(testPlan, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedPlanId = body.id;
          done();
        });
      });
    });
    describe('Get all plans without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.plans.list(function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get plan', function(){
      it('should return statusCode 200', function (done){
        openpay.plans.get(newlyCreatedPlanId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Update plan', function(){
      it('should return statusCode 200', function (done){
        openpay.plans.update(newlyCreatedPlanId, {"name": "Test plan"}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Get plan subscriptions', function(){
      it('should return statusCode 200', function (done){
        openpay.plans.listSubscriptions(newlyCreatedPlanId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
  });

  describe('Testing subscriptions', function(){
    var newlyCreatedSubscriptionId = '';
    describe('Create subscription', function(){
      it('should return statusCode 200||201', function (done){
        var testSubscription = {"plan_id": newlyCreatedPlanId, "card_id": newlyCreatedCustomerCardId, "trial_days": "30"};
        openpay.customers.subscriptions.create(newlyCreatedCustomerId, testSubscription, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
          newlyCreatedSubscriptionId = body.id;
          done();
        });
      });
    });
    describe('Get all subscriptions without constraints', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.subscriptions.list(newlyCreatedCustomerId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, 'Status code == 200');
          done();
        });
      });
    });
    describe('Get subscription', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.subscriptions.get(newlyCreatedCustomerId, newlyCreatedSubscriptionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Update subscription', function(){
      it('should return statusCode 200', function (done){
        openpay.customers.subscriptions.update(newlyCreatedCustomerId, newlyCreatedSubscriptionId, {"trial_end_date": "2020-02-11"}, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 200, '');
          done();
        });
      });
    });
    describe('Delete subscription', function(){
      it('should return statusCode 204', function (done){
        openpay.customers.subscriptions.delete(newlyCreatedCustomerId, newlyCreatedSubscriptionId, function (error, body, response){
          printLog(response.statusCode, body, error);
          assert.equal(response.statusCode, 204, '');
          done();
        });
      });
    });
  });


  describe('Delete plan', function(){
    it('should return statusCode 204', function (done){
      openpay.plans.delete(newlyCreatedPlanId, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode, 204, '');
        done();
      });
    });
  });
  describe('Delete card', function(){
    it('should return statusCode 204', function (done){
      openpay.cards.delete(newlyCreatedCardId, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode, 204, '');
        done();
      });
    });
  });
  describe('Delete customer card', function(){
    it('should return statusCode 204', function (done){
      openpay.customers.cards.delete(newlyCreatedCustomerId, newlyCreatedCustomerCardId, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode, 204, '');
        done();
      });
    });
  });

  describe('Delete bankaccount', function(){
    it('should return statusCode 204', function (done){
      openpay.customers.bankaccounts.delete(newlyCreatedCustomerId, newlyCreatedBankAccountId, function (error, body, response){
        printLog(response.statusCode, body, error);
        assert.equal(response.statusCode, 204, '');
        done();
      });
    });
  });

  describe('Delete customer', function(){
    it('should return statusCode 204', function (done){
      openpay.customers.delete(newlyCreatedCustomerId, function (error, body, response){
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