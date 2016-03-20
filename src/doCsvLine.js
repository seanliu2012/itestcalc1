/**
 * Created by Sean.Liu on 20/03/2016.
 */
"use strict";

var _ = require('lodash');
var async = require('async');
var chalk = require('chalk');
var csvParser = require('./csvParser');
var inputValidator = require('./inputValidator');
var calculator = require('./calculator');
var resultFormatter = require('./resultFormatter');

var doCsvLine = {
    start: function (csvLine) {
        async.waterfall([
            // parse the csv to json array
            //async.apply(csvParser.parseLine, csvLine),
            function (callback) {
                csvParser.parseLine(csvLine, function (err, inputs) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, inputs);
                    }
                });
            },
            // validate single input object
            function (inputs, callback) {
                // expect only 1 item in array from csvParser.parseLine()
                var input = inputs[0];
                var validationResult = inputValidator.validate(input);

                console.log();
                _.forEach(validationResult.Errors, function (error) {
                    console.error(chalk.red(error));
                    console.log();
                });
                _.forEach(validationResult.Warnings, function (warning) {
                    console.log(chalk.yellow(warning));
                    console.log();
                });

                if (validationResult.IsValid) {
                    callback(null, input);
                } else {
                    var err = new Error('cannot calculate');
                    callback(err);
                }
            }
        ], function (err, input) {
            if (err) {
                console.error(chalk.red(err));
                process.exit(1);
            } else {
                var resultObj = calculator.getResult(input);
                var t = resultFormatter.toTable([resultObj]);
                console.log(t.toString());
                process.exit(0);
            }
        });
    }
};

module.exports = doCsvLine;