/**
 * Created by Sean.Liu on 15/03/2016.
 */

var should = require('chai').should();
var inputValidator = require('../src/inputValidator');

describe('input validations', function () {
    describe('validate()', function () {
        it('is ok with valid names, super rate, and period', function (done) {
            var testObj = {
                'FirstName' : 'Allan',
                'LastName' : 'Tester',
                "Salary" : 65000,
                'SuperRate' : '9.5%',
                'Period' : '1 Mar 2016 - 31 Mar 2016'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(true);
            resultObj.Errors.length.should.equal(0);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
        it('is ok with numeric super rate', function (done) {
            var testObj = {
                'FirstName' : 'Allan',
                'LastName' : 'Tester',
                "Salary" : 65000.50,
                'SuperRate' : 9.5,
                'Period' : '1 Jul 2014 - 31 Jul 2014'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(true);
            resultObj.Errors.length.should.equal(0);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
        it('returns error without names', function (done) {
            var testObj = {
                'FirstName' : '',
                'LastName' : '',
                "Salary" : 45000,
                'SuperRate' : '9.5%',
                'Period' : '1 Jul 2014 - 31 Jul 2014'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(false);
            resultObj.Errors.length.should.be.least(2);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
        it('returns error non-string names', function (done) {
            var testObj = {
                'FirstName' : 123,
                'LastName' : '456',
                "Salary" : 45000,
                'SuperRate' : '9.5%',
                'Period' : '1 Jul 2014 - 31 Jul 2014'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(false);
            resultObj.Errors.length.should.be.least(2);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
        it('returns error with invalid super rate', function (done) {
            var testObj = {
                'FirstName' : 'Allan',
                'LastName' : 'Tester',
                "Salary" : 9999.50,
                'SuperRate' : '-5%',
                'Period' : '1 Jul 2014 - 31 Jul 2014'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(false);
            resultObj.Errors.length.should.equal(1);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
        it('returns warning with super rate lower than guaranteed rate', function (done) {
            var testObj = {
                'FirstName' : 'Allan',
                'LastName' : 'Tester',
                "Salary" : 9999.50,
                'SuperRate' : '9%',
                'Period' : '1 Sep 2015 - 30 Sep 2015'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(true);
            resultObj.Errors.length.should.equal(0);
            resultObj.Warnings.length.should.equal(1);
            done();
        });
        it('returns error with invalid period', function (done) {
            var testObj = {
                'FirstName' : 'Allan',
                'LastName' : 'Tester',
                "Salary" : 10000,
                'SuperRate' : '9.5%',
                'Period' : '1 Mar 2014 - 31 Mar 2014'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(false);
            resultObj.Errors.length.should.equal(1);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
        it('returns error with invalid salary', function (done) {
            var testObj = {
                'FirstName' : 'Allan',
                'LastName' : 'Tester',
                "Salary" : -10000,
                'SuperRate' : '9.5%',
                'Period' : '1 Jul 2014 - 31 Jul 2014'
            };
            var resultObj = inputValidator.validate(testObj);
            resultObj.IsValid.should.equal(false);
            resultObj.Errors.length.should.equal(1);
            resultObj.Warnings.length.should.equal(0);
            done();
        });
    });
});