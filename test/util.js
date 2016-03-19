/**
 * Created by Sean.Liu on 15/03/2016.
 */

var should = require('chai').should();
var util = require('../lib/util');

describe('Util functions', function () {
    describe('isAmount()', function () {
        it('returns true', function (done) {
            util.isAmount(12345).should.equal(true);
            util.isAmount(12345.50).should.equal(true);
            util.isAmount('12345').should.equal(true);
            util.isAmount('-$12,345.00').should.equal(true);
            util.isAmount('(12,345.00)').should.equal(true);
            util.isAmount(023).should.equal(true); // octal
            util.isAmount(0xFF).should.equal(true); // hex
            done();
        });
        it('returns false', function (done) {
            util.isAmount().should.equal(false);
            util.isAmount(null).should.equal(false);
            util.isAmount('123.txt').should.equal(false);
            util.isAmount('abc').should.equal(false);
            done();
        });
    });
    describe('isDate()', function () {
        it('returns true', function (done) {
            util.isDate(new Date()).should.equal(true);
            util.isDate('1 march ').should.equal(true);
            util.isDate('28 Feb 2015').should.equal(true);
            done();
        });
        it('returns false', function (done) {
            util.isDate(null).should.equal(false);
            util.isDate('  ').should.equal(false);
            util.isDate('2015-2-29').should.equal(false);
            done();
        });
    });
    describe('isNullOrWhitespace()', function () {
        it('returns true', function (done) {
            util.isNullOrWhitespace().should.equal(true);
            util.isNullOrWhitespace(null).should.equal(true);
            util.isNullOrWhitespace('  ').should.equal(true);
            done();
        });
        it('returns false', function (done) {
            util.isNullOrWhitespace(123).should.equal(false);
            util.isNullOrWhitespace('!@#').should.equal(false);
            util.isNullOrWhitespace('123').should.equal(false);
            util.isNullOrWhitespace('abc').should.equal(false);
            done();
        });
    });
    describe('sanitiseAmount()', function () {
        it('removes currency symbols and signs', function (done) {
            util.sanitiseAmount(1.2345).should.equal(1.2345);
            util.sanitiseAmount('$12,345.00').should.equal(12345);
            util.sanitiseAmount('+$12,345.00').should.equal(12345);
            util.sanitiseAmount('-$12,345.00').should.equal(-12345);
            util.sanitiseAmount('(12,345.00)').should.equal(-12345);
            done();
        });
    });
    describe('sanitiseDate()', function () {
        it('format date as "dd MMM YYYY"', function (done) {
            var currentYear = (new Date()).getFullYear();
            util.sanitiseDate(' 1 march 2001').should.equal('1 Mar 2001');
            util.sanitiseDate('01 march').should.equal('1 Mar ' + currentYear);
            util.sanitiseDate('1999-03-01').should.equal('1 Mar 1999');
            util.sanitiseDate(' 3/1/1999 ').should.equal('1 Mar 1999');
            done();
        });
    });
    describe('sanitisePeriod()', function () {
        it('do nothing for invalid period', function (done) {
            util.sanitisePeriod('1 may - 1 mar').should.equal('1 may - 1 mar');
            done();
        });
        it('add current year if not present', function (done) {
            var currentYear = (new Date()).getFullYear();
            util.sanitisePeriod('01 mar - 20 mar').should.equal('1 Mar ' + currentYear + ' - 20 Mar ' + currentYear);
            done();
        });
    });
    describe('sanitisePercentage()', function () {
        it('append % sign if not exists', function (done) {
            util.sanitisePercentage(' 9 ').should.equal('9%');
            done();
        });
    });
    describe('isPercentage()', function () {
        it('returns true with both digits and % sign', function (done) {
            util.isPercentage(9).should.equal(true);
            util.isPercentage('9').should.equal(true);
            util.isPercentage('9%').should.equal(true);
            util.isPercentage('900%').should.equal(true);
            util.isPercentage(' 900 % ').should.equal(true);
            done();
        });
        it('returns false without digits or % sign', function (done) {
            util.isPercentage(null).should.equal(false);
            util.isPercentage('  ').should.equal(false);
            util.isPercentage('%').should.equal(false);
            util.isPercentage('x%').should.equal(false);
            done();
        });
    });
    describe('isPeriod()', function () {
        it('returns true with valid range string', function (done) {
            util.isPeriod(' 1 june - 2 jun ').should.equal(true);
            util.isPeriod(' 1 march - 2 mar ').should.equal(true);
            util.isPeriod(' 1 mar 2016 - 2 march 2016').should.equal(true);
            done();
        });
        it('returns false with invalid range string', function (done) {
            util.isPeriod('  ').should.equal(false);
            util.isPeriod('1 - 2 - 3').should.equal(false);
            util.isPeriod('1 max - 2 mar').should.equal(false);
            util.isPeriod('1 may - 2 march').should.equal(false);
            done();
        });
    });
    describe('toMonthIndex()', function () {
        it('return -1 for invalid value', function (done) {
            util.toMonthIndex().should.equal(-1);
            util.toMonthIndex(0).should.equal(-1);
            util.toMonthIndex('13').should.equal(-1);
            util.toMonthIndex('mas').should.equal(-1);
            done();
        });
        it('accepts integer or string', function (done) {
            util.toMonthIndex(1).should.equal(0);
            util.toMonthIndex('6').should.equal(5);
            util.toMonthIndex('january').should.equal(0);
            util.toMonthIndex('Dec').should.equal(11);
            done();
        });
    });
    describe('getDaysInMonth()', function () {
        it('return -1 for invalid year and month', function (done) {
            util.getDaysInMonth(2010, 13).should.equal(-1);
            done();
        });
        it('return expected days', function (done) {
            util.getDaysInMonth(2016, 2).should.equal(29);
            done();
        });
    });
    describe('isOneMonthPeriod()', function () {
        it('returns true for valid period', function (done) {
            util.isOneMonthPeriod('1 mar - 31 mar').should.equal(true);
            done();
        });
        it('return false for invalid period', function (done) {
            util.isOneMonthPeriod('29 Feb 2016 - 31 mar 2016').should.equal(false);
            done();
        });
    });
    describe('getCurrentMonthPeriod()', function () {
        it('returns one month period', function (done) {
            util.isOneMonthPeriod(util.getCurrentMonthPeriod()).should.equal(true);
            done();
        });
    });
});
