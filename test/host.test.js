'use strict';

const assert = require('assert');
const { hostFor } = require('../lib/http-client');

describe('hostFor', function () {
  it('builds per-country, per-mode hosts', function () {
    const base = { merchantId: 'm', privateKey: 'k', timeout: 1 };
    assert.equal(hostFor({ ...base, isSandbox: true, countryCode: 'mx' }), 'https://sandbox-api.openpay.mx');
    assert.equal(hostFor({ ...base, isSandbox: false, countryCode: 'pe' }), 'https://api.openpay.pe');
    assert.equal(hostFor({ ...base, isSandbox: true, countryCode: 'co' }), 'https://sandbox-api.openpay.co');
  });

  it('constructor falls back to mx on bad country code', function () {
    const Openpay = require('../lib/index');
    const op = new Openpay('m', 'k', 'xx');
    assert.equal(hostFor(op['config']), 'https://sandbox-api.openpay.mx');
  });
});
