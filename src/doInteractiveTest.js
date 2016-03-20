/**
 * Created by Sean.Liu on 18/03/2016.
 */
"use strict";

var _ = require('lodash');
var co = require('co');
var prompt = require('co-prompt');
var chalk = require('chalk');
var rateApi = require('../api/rateApi');
var util = require('../lib/util');
var inputValidator = require('./inputValidator');
var calculator = require('./calculator');
var resultFormatter = require('./resultFormatter');

var doInteractiveTest = {
    start: function () {

        co(function *() {
            // new JSON object to hold user inputs
            var inputObj = {};
            inputObj.FirstName = yield prompt('First name: ');
            inputObj.LastName = yield prompt('Last name: ');

            var salary = yield prompt('Annual salary: ');
            // get numeric amount by removing currency formatting
            inputObj.Salary = util.sanitiseAmount(salary);
            console.log(chalk.cyan('Annual salary read as ' + inputObj.Salary));

            var rate = yield prompt('Super rate: ');
            // get string rate with % sign
            inputObj.SuperRate = util.sanitisePercentage(rate);
            console.log(chalk.cyan('Super rate read as ' + inputObj.SuperRate));

            var period = yield prompt('Monthly period: ');
            // get formatted period
            inputObj.Period = util.sanitisePeriod(period);
            console.log(chalk.cyan('Monthly period read as ' + inputObj.Period));

            var validateObj = inputValidator.validate(inputObj);

            console.log();
            _.forEach(validateObj.Errors, function (error) {
                console.error(chalk.red(error));
                console.log();
            });
            _.forEach(validateObj.Warnings, function (warning) {
                console.log(chalk.yellow(warning));
                console.log();
            });
            if (validateObj.IsValid) {
                var resultObj = calculator.getResult(inputObj);
                var t = resultFormatter.toTable([resultObj]);
                console.log(t.toString());
                process.exit(0);
            } else {
                process.exit(1);
            }
        });

    }
};

module.exports = doInteractiveTest;