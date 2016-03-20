/**
 * Created by Sean.Liu on 16/03/2016.
 */

"use strict";

var _ = require('lodash');
var numeral = require('numeral');
var validator = require('validator');
var util = require('../lib/util');
var rateApi = require('../api/rateApi');

var _validateName = function (name) {
    if (typeof name !== 'string') return false;
    if (!validator.isAlpha(name)) return false;

    return !util.isNullOrWhitespace(name);
};

var _validatePeriod = function (period) {
    if (!util.isOneMonthPeriod(period)) return false;

    // period should fall between min and max supported date
    var minDate = rateApi.getMinSupportedDate();
    var maxDate = rateApi.getMaxSupportedDate();

    var dates = period.split('-');
    var start = new Date(dates[0].trim());
    var end = new Date(dates[1].trim());

    return start >= minDate && end <= maxDate;
};

var _validateSalary = function (salary) {
    if (!util.isAmount(salary)) return false;

    if (typeof salary === 'string') {
        salary = numeral().unformat(salary);
    }

    return salary > 0;
};

var inputValidator = {
    /**
     * validate all values in one input object
     * @param inputObj: one input object
     * @returns result object that holds errors and warnings
     */
    validate: function (inputObj) {
        if (!_.isObject(inputObj)) return null;
        if (!inputObj.hasOwnProperty('FirstName')) return null;
        if (!inputObj.hasOwnProperty('LastName')) return null;
        if (!inputObj.hasOwnProperty('Salary')) return null;
        if (!inputObj.hasOwnProperty('SuperRate')) return null;
        if (!inputObj.hasOwnProperty('Period')) return null;

        var validateResult = {'IsValid': true, 'Errors': [], 'Warnings': []};

        var firstName = inputObj['FirstName'];
        if (!_validateName(firstName)) {
            validateResult.IsValid = false;
            validateResult.Errors.push('ERROR: invalid first name');
        }

        var lastName = inputObj['LastName'];
        if (!_validateName(lastName)) {
            validateResult.IsValid = false;
            validateResult.Errors.push('ERROR: invalid last name');
        }

        var salary = inputObj['Salary'];
        if (!_validateSalary(salary)) {
            validateResult.IsValid = false;
            validateResult.Errors.push('ERROR: ' + salary + ' is not an valid salary amount');
        }

        var rate = inputObj['SuperRate'];
        if (!util.isPercentage(rate) || parseFloat(rate) > 50) {
            validateResult.IsValid = false;
            validateResult.Errors.push('ERROR: invalid super rate');
        }
        // extra check for rates lower than government guaranteed rate
        if (validateResult.IsValid) {
            var minRate = rateApi.getMinSGRate();
            if (minRate > parseFloat(rate)) {
                validateResult.Warnings.push('WARNING: ' + rate + ' is below minimum superannuation guarantee rate ' + minRate + '%')
            }
        }

        var period = inputObj['Period'];
        if (!_validatePeriod(period)) {
            validateResult.IsValid = false;
            validateResult.Errors.push('ERROR: ' + period + ' is not a valid monthly period');
        }

        return validateResult;
    }
};

module.exports = inputValidator;