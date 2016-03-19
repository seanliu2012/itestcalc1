/**
 * Created by Sean.Liu on 18/03/2016.
 */

"use strict";

var _ = require('lodash');
var rateApi = require('../api/rateApi');
var util = require('../lib/util');

var _getStartDateFromPeriod = function (period) {
    var trimmed = period.trim();
    var dates = trimmed.split('-');
    return dates[0].trim();
};

/**
 * single monthly pay calculation
 * @param inputObj: one input object
 * @returns resultObj: one result object
 */
var _getResult = function (inputObj) {
    if (!_.isObject(inputObj)) return null;
    if (!inputObj.hasOwnProperty('FirstName')) return null;
    if (!inputObj.hasOwnProperty('LastName')) return null;
    if (!inputObj.hasOwnProperty('Salary')) return null;
    if (!inputObj.hasOwnProperty('SuperRate')) return null;
    if (!inputObj.hasOwnProperty('Period')) return null;

    // sanitised rate is ending with % sign
    var superRate = parseFloat(inputObj.SuperRate);

    // use start date to retrieve tax threshold etc
    var startDate = _getStartDateFromPeriod(inputObj.Period);
    var annualSalary = inputObj.Salary;
    var taxRate = rateApi.getIndividualTaxRate(startDate, annualSalary);

    // year based calc
    var excess = annualSalary - taxRate.Threshold;
    var annualWithheld = taxRate.BaseTax + (excess * taxRate.ExcessRate / 100);

    // for the month period
    var taxWithheld = Math.round(annualWithheld / 12);
    var monthlyGrossIncome = Math.floor(annualSalary / 12);
    var monthlyPay = monthlyGrossIncome - taxWithheld;
    var monthlySuper = Math.floor(monthlyGrossIncome * superRate / 100);

    var resultObj = {
        Name: inputObj.FirstName + ' ' + inputObj.LastName,
        Period: inputObj.Period,
        Gross: monthlyGrossIncome,
        TaxWithheld: taxWithheld,
        NetPay: monthlyPay,
        Super: monthlySuper
    };

    return resultObj;
};

var calculator = {
    getResult: _getResult
};

module.exports = calculator;