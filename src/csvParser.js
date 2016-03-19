/**
 * Created by Sean.Liu on 16/03/2016.
 */

"use strict";

var fs = require('fs');
var Converter = require("csvtojson").Converter;
var util = require('../lib/util');

var _transform = function(json, row, index) {
    // get numeric amount by removing currency formatting
    json['Salary'] = util.sanitiseAmount(json['Salary']);
    // get string rate with % sign
    json['SuperRate'] = util.sanitisePercentage(json['SuperRate']);
    // get formatted period
    json['Period'] = util.sanitisePeriod(json['Period']);
};

var csvParser = {
    parseLine: function (csvLine, callback) {
        var converter = new Converter({
            noheader: true,
            headers: ['FirstName', 'LastName', 'Salary', 'SuperRate', 'Period']
        });
        converter.transform = _transform;

        converter.fromString(csvLine, function (err, result) {
            callback(err, result);
        });
    },
    parseFile: function (csvFile, callback) {
        var converter = new Converter({
            noheader: true,
            headers: ['FirstName', 'LastName', 'Salary', 'SuperRate', 'Period']
        });
        converter.transform = _transform;

        converter.on("end_parsed", function (jsonObj) {
            callback(null, jsonObj);
        });

        converter.on("error", function (errMsg, errData) {
            var err = new Error(errMsg + '\r\n' + errData);
            callback(err);
        });

        //read from file
        fs.createReadStream(csvFile).pipe(converter);
    }
};

module.exports = csvParser;