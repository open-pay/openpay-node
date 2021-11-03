const urllib = require('urllib');
const _ = require('underscore');
var urlUtils = require('./url-utils')

Openpay.BASE_URL = 'https://api.openpay.mx';
Openpay.API_VERSION = '/v1/';
Openpay.SANDBOX_URL = 'https://sandbox-api.openpay.mx';
Openpay.SANDBOX_API_VERSION = '/v1/';


function Openpay(merchantId, privateKey, countryCode = 'mx', isProductionReady) {
    this.merchantId = merchantId;
    this.privateKey = privateKey;
    this.isSandbox = isProductionReady ? false : true;
    this.timeout = 90000;
    this.define({
        isSandbox: this.isSandbox,
        privateKey: this.privateKey,
        merchantId: this.merchantId,
        timeout: this.timeout
    });
    this.setBaseUrl(countryCode);

    this.setMerchantId = function (merchantId) {
        this.merchantId = merchantId;
        this._reDefine();
    };

    this.setPrivateKey = function (privateKey) {
        this.privateKey = privateKey;
        this._reDefine();
    };

    this.setProductionReady = function (isProductionReady) {
        this.isSandbox = !isProductionReady;
        this._reDefine();
    };

    this.setTimeout = function (timeout) {
        this.timeout = timeout;
        this._reDefine();
    };

    this._reDefine = function () {
        this.define({
            isSandbox: this.isSandbox,
            privateKey: this.privateKey,
            merchantId: this.merchantId,
            timeout: this.timeout
        });
    };
}

Openpay.prototype.define = function (baseData) {
    this.groups = new Groups(baseData);
    this.merchant = new Merchant(baseData);
    this.charges = new Charges(baseData);
    this.payouts = new Payouts(baseData);
    this.fees = new Fees(baseData);
    this.plans = new Plans(baseData);
    this.cards = new Cards(baseData);
    this.customers = new Customers(baseData);
    this.webhooks = new Webhooks(baseData);
    this.tokens = new Tokens(baseData);
    this.checkouts = new Checkouts(baseData);
    this.pse = new Pse(baseData);
    this.stores = new Stores(baseData);
};

Openpay.prototype.setBaseUrl = function (countryCode) {
    console.log('setting base url from country')
    switch (countryCode) {
        case 'pe':
            console.log('Country Peru');
            Openpay.BASE_URL = "https://api.openpay.pe";
            Openpay.SANDBOX_URL = "https://sandbox-api.openpay.pe";
            break;
        case 'co':
            console.log('Country Colombia')
            Openpay.BASE_URL = "https://api.openpay.co";
            Openpay.SANDBOX_URL = "https://sandbox-api.openpay.co";
            break
        case 'mx':
            console.log('Country Mexico');
            console.log('Default value');
            break
        default:
            console.error('Error country code, setting mx default.');
    }
}

function Merchant(baseData) {
    var baseUrl = baseData.merchantId;

    this.get = function (callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };
}

function Charges(baseData) {
    var baseUrl = baseData.merchantId + '/charges';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.get = function (transactionId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + transactionId,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.capture = function (transactionId, data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + transactionId + '/capture',
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.refund = function (transactionId, data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + transactionId + '/refund',
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };
}


function Payouts(baseData) {
    var baseUrl = baseData.merchantId + '/payouts';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.get = function (transactionId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + transactionId,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };
}


function Fees(baseData) {
    var baseUrl = baseData.merchantId + '/fees';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };
}


function Customers(baseData) {
    var baseUrl = baseData.merchantId + '/customers';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.get = function (customerId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + customerId,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.update = function (customerId, data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + customerId,
            requestData: {method: 'PUT', json: data},
            callback: callback
        }));
    };

    this.delete = function (customerId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + customerId,
            requestData: {method: 'DELETE'},
            callback: callback
        }));
    };

    this.charges = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/charges',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (customerId, data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/charges' + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, transactionId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/charges/' + transactionId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        capture: function (customerId, transactionId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/charges/' + transactionId + '/capture',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        refund: function (customerId, transactionId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/charges/' + transactionId + '/refund',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        }
    };

    this.transfers = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/transfers',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (customerId, data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/transfers' + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, transactionId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/transfers/' + transactionId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        }
    };

    this.payouts = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/payouts',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (customerId, data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/payouts' + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, transactionId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/payouts/' + transactionId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        }
    };

    this.subscriptions = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/subscriptions',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (customerId, data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/subscriptions' + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, subscriptionId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/subscriptions/' + subscriptionId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        update: function (customerId, subscriptionId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/subscriptions/' + subscriptionId,
                requestData: {method: 'PUT', json: data},
                callback: callback
            }));
        },

        delete: function (customerId, subscriptionId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/subscriptions/' + subscriptionId,
                requestData: {method: 'DELETE'},
                callback: callback
            }));
        }
    };

    this.cards = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/cards',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (customerId, data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/cards' + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, cardId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/cards/' + cardId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        delete: function (customerId, cardId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/cards/' + cardId,
                requestData: {method: 'DELETE'},
                callback: callback
            }));
        },
        update: function (customerId, cardId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/cards/' + cardId,
                requestData: {method: 'PUT', json: data},
                callback: callback
            }));
        }
    };

    this.bankaccounts = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/bankaccounts',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (customerId, data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/bankaccounts' + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, bankId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/bankaccounts/' + bankId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        delete: function (customerId, bankId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/bankaccounts/' + bankId,
                requestData: {method: 'DELETE'},
                callback: callback
            }));
        }
    };

    this.checkouts = {
        baseUrl: baseData.merchantId + '/customers/',

        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/checkouts',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        }
    };

    this.pse = {
        baseUrl: baseData.merchantId + '/customers/',
        create: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + customerId + '/charges',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        }
    }
}


function Cards(baseData) {
    var baseUrl = baseData.merchantId + '/cards';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.get = function (cardId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + cardId,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.delete = function (cardId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + cardId,
            requestData: {method: 'DELETE'},
            callback: callback
        }));
    };

    this.update = function (cardId, data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + cardId,
            requestData: {method: 'PUT', json: data},
            callback: callback
        }));
    };
}

function Plans(baseData) {
    var baseUrl = baseData.merchantId + '/plans';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.get = function (planId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + planId,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.update = function (planId, data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + planId,
            requestData: {method: 'PUT', json: data},
            callback: callback
        }));
    };

    this.delete = function (planId, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + planId,
            requestData: {method: 'DELETE'},
            callback: callback
        }));
    };

    this.listSubscriptions = function (planId, data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + planId + '/subscriptions' + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };
}


function Webhooks(baseData) {
    var baseUrl = baseData.merchantId + '/webhooks';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.verify = function (webhook_id, verification_code, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + webhook_id + '/verify' + '/' + verification_code,
            requestData: {method: 'POST', json: '{}'},
            callback: callback
        }));
    };

    this.get = function (webhook_id, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + webhook_id,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };


    this.delete = function (webhook_id, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + webhook_id,
            requestData: {method: 'DELETE'},
            callback: callback
        }));
    };

    this.list = function (callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

}

function Tokens(baseData) {
    var baseUrl = baseData.merchantId + '/tokens';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.get = function (token_id, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + token_id,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.list = function (callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

}

function Checkouts(baseData) {
    var baseUrl = baseData.merchantId + '/checkouts';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };

    this.get = function (checkout_id, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + checkout_id,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };

    this.update = function (checkoutId, status, data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl + '/' + checkoutId + "?status=" + status,
            requestData: {method: 'PUT', json: data},
            callback: callback
        }));
    };
}

function Stores(baseData) {
    var baseUrl = 'stores';

    this.list = function (data, callback) {
        var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
        var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
        sendStoreRequest(_.extend(baseData, {
            apiUrl: baseUrl + query,
            requestData: {method: 'GET'},
            callback: callback
        }));
    };
}

function Pse(baseData) {
    var baseUrl = baseData.merchantId + '/charges';

    this.create = function (data, callback) {
        sendRequest(_.extend(baseData, {
            apiUrl: baseUrl,
            requestData: {method: 'POST', json: data},
            callback: callback
        }));
    };
}

function Groups(baseData) {
    baseData.groupId = baseData.merchantId;
    var baseUrl = 'groups'
    this.customers = {
        baseUrl: 'groups/' + baseData.merchantId + '/customers',

        create: function (data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl,
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        list: function (data, callback) {
            var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
            var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + query,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        get: function (customerId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + '/' + customerId,
                requestData: {method: 'GET'},
                callback: callback
            }));
        },

        update: function (customerId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + '/' + customerId,
                requestData: {method: 'PUT', json: data},
                callback: callback
            }));
        },

        delete: function (customerId, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + '/' + customerId,
                requestData: {method: 'DELETE'},
                callback: callback
            }));
        },

        cards: {
            baseUrl: 'groups/' + baseData.merchantId + '/customers/',

            create: function (customerId, data, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + customerId + '/cards',
                    requestData: {method: 'POST', json: data},
                    callback: callback
                }));
            },

            list: function (customerId, data, callback) {
                var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
                var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + customerId + '/cards' + query,
                    requestData: {method: 'GET'},
                    callback: callback
                }));
            },

            get: function (customerId, cardId, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + customerId + '/cards/' + cardId,
                    requestData: {method: 'GET'},
                    callback: callback
                }));
            },

            delete: function (customerId, cardId, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + customerId + '/cards/' + cardId,
                    requestData: {method: 'DELETE'},
                    callback: callback
                }));
            }
        },

        charges: {
            baseUrl: 'groups/' + baseData.merchantId + '/merchants/',

            create: function (merchantId, customerId, data, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/charges',
                    requestData: {method: 'POST', json: data},
                    callback: callback
                }));
            },

            capture: function (merchantId, customerId, transactionId, data, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/charges/' + transactionId + '/capture',
                    requestData: {method: 'POST', json: data},
                    callback: callback
                }));
            },

            refund: function (merchantId, customerId, transactionId, data, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/charges/' + transactionId + '/refund',
                    requestData: {method: 'POST', json: data},
                    callback: callback
                }));
            }
        },

        subscriptions: {
            baseUrl: 'groups/' + baseData.merchantId + '/merchants/',

            create: function (merchantId, customerId, data, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/subscriptions',
                    requestData: {method: 'POST', json: data},
                    callback: callback
                }));
            },

            list: function (merchantId, customerId, data, callback) {
                var query = (data && _.isObject(data) && !_.isArray(data) && !_.isFunction(data) && !_.isEmpty(data)) ? stringifyParams(data) : '';
                var callback = _.isFunction(callback) ? callback : _.isFunction(data) ? data : null;
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/subscriptions' + query,
                    requestData: {method: 'GET'},
                    callback: callback
                }));
            },

            get: function (merchantId, customerId, subscriptionId, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/subscriptions/' + subscriptionId,
                    requestData: {method: 'GET'},
                    callback: callback
                }));
            },

            update: function (merchantId, customerId, subscriptionId, data, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/subscriptions/' + subscriptionId,
                    requestData: {method: 'PUT', json: data},
                    callback: callback
                }));
            },

            delete: function (merchantId, customerId, subscriptionId, callback) {
                sendRequest(_.extend(baseData, {
                    apiUrl: this.baseUrl + merchantId + '/customers/' + customerId + '/subscriptions/' + subscriptionId,
                    requestData: {method: 'DELETE'},
                    callback: callback
                }));
            }
        }
    };

    this.charges = {
        baseUrl: 'groups/' + baseData.merchantId + '/merchants/',

        create: function (merchantId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + merchantId + '/charges',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        capture: function (merchantId, transactionId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + merchantId + '/charges/' + transactionId + '/capture',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        },

        refund: function (merchantId, transactionId, data, callback) {
            sendRequest(_.extend(baseData, {
                apiUrl: this.baseUrl + merchantId + '/charges/' + transactionId + '/refund',
                requestData: {method: 'POST', json: data},
                callback: callback
            }));
        }
    };

}


var stringifyParams = function (params) {
    return '?' + _.map(_.pairs(params), function (arr) {
        return arr.join('=');
    }).join('&');
}

var sendRequest = function (data) {
    var baseUrl = data.isSandbox ? Openpay.SANDBOX_URL + Openpay.SANDBOX_API_VERSION : Openpay.BASE_URL + Openpay.API_VERSION;
    const url = baseUrl + urlUtils.escapeBrackets(data.apiUrl);
    const options = {
        auth: data.privateKey + ':',
        method: data.requestData.method || 'GET',
        contentType: 'json',
        timeout: data.timeout,
        data: data.requestData.json,
        dataType: 'json'
    };

    urllib.request(url, options, function (err, body, res) {
        var resCode = res ? res.statusCode : null;
        var error = resCode && (resCode != 200 && resCode != 201 && resCode != 204) ? body : null;
        data.callback(err ? err : error, err || error ? null : body, res);
    });
}

var sendStoreRequest = function (data) {
    var baseUrl = data.isSandbox ? Openpay.SANDBOX_URL + "/" : Openpay.BASE_URL + "/";
    const url = baseUrl + urlUtils.escapeBrackets(data.apiUrl);
    const options = {
        auth: data.privateKey + ':',
        method: data.requestData.method || 'GET',
        contentType: 'json',
        timeout: data.timeout,
        data: data.requestData.json,
        dataType: 'json'
    };

    urllib.request(url, options, function (err, body, res) {
        var resCode = res ? res.statusCode : null;
        var error = resCode && (resCode != 200 && resCode != 201 && resCode != 204) ? body : null;
        data.callback(err ? err : error, err || error ? null : body, res);
    });
}

module.exports = Openpay;
