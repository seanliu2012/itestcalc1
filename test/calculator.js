/**
 * Created by Sean.Liu on 18/03/2016.
 */

var should = require('chai').should();
var calculator = require('../src/calculator');

describe('calculator tests', function () {
    describe('getResult()', function () {
        it('returns null for invalid input object', function (done) {
            var testInput = {"DummyProperty":""};
            should.not.exist(calculator.getResult(testInput));
            done();
        });
        it('returns calculated result', function (done) {
            var testInput = {
                'FirstName' : 'Angel',
                'LastName' : 'Bower',
                "Salary" : 120000,
                'SuperRate' : '10%',
                'Period' : '1 Mar 2016 - 31 Mar 2016'
            };
            //var resultString = calculator.getResult(JSON.stringify(testInput));
            //var resultObj = JSON.parse(resultString);
            var resultObj = calculator.getResult(testInput);
            resultObj.Gross.should.equal(10000);
            resultObj.TaxWithheld.should.equal(2696);
            resultObj.NetPay.should.equal(7304);
            resultObj.Super.should.equal(1000);
            done();
        });
    });
});