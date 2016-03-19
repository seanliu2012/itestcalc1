/**
 * Created by Sean.Liu on 15/03/2016.
 */

var async = require('async');
var should = require('chai').should();
var csvParser = require('../src/csvParser');

describe('csv parsing', function () {
    describe('parseLine()', function () {
        it('returns error with invalid csv', function (done) {
            var csv = 'Alex,Tester,5500,"9,1 mar - 31 mar ';
            // call async csv parsing function
            async.series([
                async.apply(csvParser.parseLine, csv)
            ], function (err, seriesResults) {
                should.exist(err);
                should.not.exist(seriesResults[0]);
                done();
            });
        });
        it('returns 1 JSON result successfully', function (done) {
            var csv = 'Alex,Tester,5500,9,1 mar - 31 mar ';
            // call async csv parsing function
            async.series([
                async.apply(csvParser.parseLine, csv)
            ], function (err, seriesResults) {
                should.not.exist(err);
                should.exist(seriesResults[0]);

                seriesResults[0][0].FirstName.should.equal('Alex');
                seriesResults[0][0].LastName.should.equal('Tester');
                seriesResults[0][0].Salary.should.equal(5500);
                seriesResults[0][0].SuperRate.should.equal('9%');
                seriesResults[0][0].Period.should.equal('1 Mar 2016 - 31 Mar 2016');
                done();
            });
        });
        it('returns 2 JSON result successfully', function (done) {
            var csv = 'Alex,Tester,5500,9,1 mar - 31 mar ' +
                '\r\nBob,Thomson,"-$65,000",9,1 jun - 30 jun ';
            // call async csv parsing function
            async.series([
                async.apply(csvParser.parseLine, csv)
            ], function (err, seriesResults) {
                should.not.exist(err);
                should.exist(seriesResults[0]);

                seriesResults[0][0].FirstName.should.equal('Alex');
                seriesResults[0][0].LastName.should.equal('Tester');
                seriesResults[0][0].Salary.should.equal(5500);
                seriesResults[0][0].SuperRate.should.equal('9%');
                seriesResults[0][0].Period.should.equal('1 Mar 2016 - 31 Mar 2016');

                seriesResults[0][1].FirstName.should.equal('Bob');
                seriesResults[0][1].LastName.should.equal('Thomson');
                seriesResults[0][1].Salary.should.equal(-65000);
                seriesResults[0][1].SuperRate.should.equal('9%');
                seriesResults[0][1].Period.should.equal('1 Jun 2016 - 30 Jun 2016');
                done();
            });
        });
    });
    describe('parseFile()', function () {
        it('returns error with invalid csv file', function (done) {
            async.series([
                async.apply(csvParser.parseFile, __dirname + '/sampleBad.csv')
            ], function (err, seriesResults) {
                should.exist(err);
                should.not.exist(seriesResults[0]);
                done();
            });
        });
        it('returns JSON with valid csv file', function (done) {
            async.series([
                async.apply(csvParser.parseFile, __dirname + '/sample.csv')
            ], function (err, seriesResults) {
                should.not.exist(err);
                should.exist(seriesResults[0]);

                seriesResults[0][0].FirstName.should.equal('David');
                seriesResults[0][0].LastName.should.equal('Rudd');
                seriesResults[0][0].Salary.should.equal(60050);
                seriesResults[0][0].SuperRate.should.equal('9%');
                seriesResults[0][0].Period.should.equal('1 Mar 2016 - 31 Mar 2016');
                done();
            });
        });
    });
});