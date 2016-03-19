/**
 * Created by Sean.Liu on 15/03/2016.
 */

var should = require('chai').should();
var rateApi = require('../api/rateApi');

describe('rate API tests', function () {
    describe('getMinSupportedDate()', function () {
        it('returns a date', function (done) {
            rateApi.getMinSupportedDate().should.be.a('date');
            done();
        });
    });
    describe('getMaxSupportedDate()', function () {
        it('returns a date', function (done) {
            rateApi.getMaxSupportedDate().should.be.a('date');
            done();
        });
    });
    describe('getIndividualTaxRate()', function () {
        it('returns null for an invalid date', function (done) {
            var taxRate = rateApi.getIndividualTaxRate('1 Dec 2013', 50001);
            should.not.exist(taxRate);
            done();
        });
        it('returns expected threshold and rate', function (done) {
            var taxRate = rateApi.getIndividualTaxRate('1 Mar 2016', 180001);
            taxRate.StartDate.should.equal('1 July 2014');
            taxRate.Threshold.should.equal(180001);
            taxRate.BaseTax.should.equal(54547);
            taxRate.ExcessRate.should.equal(47.0);
            done();
        });
    });
    describe('getMinSGRate()', function () {
        it('return a numeric', function (done) {
            var minRate = rateApi.getMinSGRate();
            minRate.should.be.a('number');
            done();
        });
    });
    describe('getSGRate()', function () {
        it('returns 0 for an invalid date', function (done) {
            var sgRate = rateApi.getSGRate('1 Dec 2013');
            sgRate.should.equal(0);
            done();
        });
        it('returns expected rate', function (done) {
            var sgRate = rateApi.getSGRate('1 Mar 2016');
            sgRate.should.equal(9.5);
            done();
        });
    });
});