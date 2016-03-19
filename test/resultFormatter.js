/**
 * Created by Sean.Liu on 19/03/2016.
 */

var should = require('chai').should();
var resultFormatter = require('../src/resultFormatter');

describe('result formatting', function () {
    describe('toTable()', function () {
        it('returns table object', function (done) {
            var resultObj = {
                Name: 'Abc Testing',
                Period: '1 Feb 2016 - 29 Feb 2016',
                Gross: 10000,
                TaxWithheld: 2696,
                NetPay: 7304,
                Super: 1000
            };
            var t = resultFormatter.toTable([resultObj]);
            should.exist(t);
            t.rows.length.should.least(1);
            done();
        });
    });
});