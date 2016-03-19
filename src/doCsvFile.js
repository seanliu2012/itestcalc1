/**
 * Created by Sean.Liu on 18/03/2016.
 */
"use strict";

var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var chalk = require('chalk');
var Table = require('easy-table');
var csvParser = require('./csvParser');
var inputValidator = require('./inputValidator');
var calculator = require('./calculator');
var resultFormatter = require('./resultFormatter');

var doCsvFile = {
    start: function (csvFile) {

        // make sure functions are run in order
        async.waterfall([
            // 1st function checks whether csv file exists or not
            function (callback) {
                // check file exists or not
                fs.stat(csvFile, function (err, stats) {
                    if (err) {
                        callback(err);
                    } else if (!stats.isFile()) {
                        var notFileError = new Error('not a file');
                        callback(chalk.red(notFileError));
                    } else {
                        callback(null, csvFile); // pass file path to next function
                    }
                });
            },
            // 2nd function parses each line as an input object
            function (file, callback) {
                csvParser.parseFile(file, function (err, inputs) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, inputs);
                    }
                });
            },
            // 3rd function validates all input objects
            function (inputs, callback) {
                // validate each input and adhere Errors property to each one
                inputs.forEach(function (input) {
                    var validationResult = inputValidator.validate(input);
                    input.Errors = validationResult.Errors;
                });
                // split into two arrays, first one contains invalid inputs
                var arrays = _.partition(inputs, function (input) {
                    return input.Errors.length > 0;
                });
                var invalidInputs = arrays[0];
                if (invalidInputs.length > 0) {
                    console.log(chalk.red('Found invalid entries in file'));
                    console.log(Table.print(invalidInputs));
                    console.log();
                }
                var validInputs = arrays[1];
                if (validInputs.length > 0) {
                    callback(null, validInputs);
                } else {
                    var err = new Error('all entries are invalid');
                    callback(err);
                }
            }
        ], function (err, validInputs) {
            if (err) {
                console.error(chalk.red(err));
                process.exit(1);
            } else {
                var results = _.map(validInputs, calculator.getResult);
                var t = resultFormatter.toTable(results);
                console.log(t.toString());
                process.exit(0);
            }
        });

    }
};

module.exports = doCsvFile;