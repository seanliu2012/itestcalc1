/**
 * Created by Sean.Liu on 15/03/2016.
 */

"use strict";
var moment = require('moment');
require('moment-range');
var numeral = require('numeral');
var validator = require('validator');
var fs = require('fs');

var _isAmount = function (arg) {
    if (typeof arg === 'undefined' || arg === null) return false;

    if (typeof arg === 'string') {
        // remove leading and trailing spaces and brackets
        // validator.isCurrency() not recognising negative amount in brackets
        arg = arg.trim().replace(/^\(/, '').replace(/\)$/, '');
    } else {
        arg = arg.toString();
    }

    return validator.isNumeric(arg) || validator.isFloat(arg) || validator.isCurrency(arg);
};

var _isDate = function (arg) {
    if (typeof arg === 'undefined' || arg == null) return false;

    if (typeof arg !== 'string') arg = arg.toString();

    return validator.isDate(arg);
};

var _isNullOrWhitespace = function (arg) {
    if (typeof arg === 'undefined' || arg === null) return true;

    if (typeof arg !== 'string') arg = arg.toString();

    return arg.trim().length < 1;
};

var _sanitiseAmount = function (arg) {
    // deal with string
    if (typeof arg === 'string') {
        if (_isNullOrWhitespace(arg)) return 0;

        return numeral().unformat(arg);
    }

    // deal with types other than string
    return arg - 0;
};

var _sanitiseDate = function(arg) {
    if (typeof arg === 'undefined' || arg === null) return '';

    if (typeof arg !== 'string') arg = arg.toString();

    moment.locale('en-au'); // result will obey our locale
    var trimmed = arg.trim();

    var likelyDate = new Date(Date.parse(trimmed));
    if (isNaN(likelyDate)) return '';

    // if year is not specified, it will be parsed as 2001 by default.
    var year = likelyDate.getFullYear();
    if (year == 2001 && trimmed.indexOf('2001') == -1)
    {
        // we want to use current year as the default year
        var y = (new Date()).getFullYear();
        var m = likelyDate.getMonth();
        var d = likelyDate.getDate();
        likelyDate = new Date(y, m, d);
    }

    var time = moment(likelyDate);
    // format as 'dd MMM YYYY'
    return time.format('ll');
};

var _sanitisePeriod = function(arg) {
    // use current month period as the default
    if (_isNullOrWhitespace(arg)) return _getCurrentMonthPeriod();

    if (typeof arg !== 'string') arg = arg.toString();

    if (!_isPeriod(arg)) return arg;

    var trimmed = arg.trim();
    var dates = trimmed.split('-');
    var startDate = _sanitiseDate(dates[0]);
    var endDate = _sanitiseDate(dates[1]);
    return startDate + ' - ' + endDate;
};

var _sanitisePercentage = function(arg) {
    if (typeof arg === 'undefined' || arg === null) return '';

    if (typeof arg !== 'string') arg = arg.toString();

    var trimmed = arg.trim();
    var lastChar = trimmed.substr(-1);
    return (lastChar === '%') ? trimmed : trimmed + '%';
};

var _isPercentage = function(arg) {
    if (typeof arg === 'undefined' || arg === null) return false;

    if (typeof arg !== 'string') arg = arg.toString();

    // remove possible ending % sign
    arg = arg.trim().replace(/%$/, '').trim();

    var value = arg - 0;
    return !isNaN(value) && value > 0;
};

var _isPeriod = function(arg) {
    if (typeof arg === 'undefined' || arg === null) return false;
    // expect string only
    if (typeof arg !== 'string') return false;

    var trimmed = arg.trim();
    var dates = trimmed.split('-');
    if (dates.length != 2) return false;

    var startDate = dates[0].trim();
    if (!validator.isDate(startDate)) return false;

    var endDate = dates[1].trim();
    if (!validator.isDate(endDate)) return false;

    var startTime = new Date(_sanitiseDate(startDate));
    var endTime = new Date(_sanitiseDate(endDate));
    return endTime > startTime;
};

var _getCurrentMonthPeriod = function() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    return _sanitiseDate(firstDay) + ' - ' + _sanitiseDate(lastDay);
};

var _toMonthIndex = function(month) {
    if (typeof month === 'undefined' || month === null) return -1;

    if (typeof month !== 'string') month = month.toString();

    // for a number, expect 1 to 12
    if (validator.isInt(month)) {
        var num = month - 0;
        if (num < 1 || num > 12) return -1;

        return num - 1;
    }

    // for a string, expect Jan, feb, March, etc.
    var testStr = '1 ' + month;
    if (!validator.isDate(testStr)) return -1;

    return new Date(testStr).getMonth();
};

var _getDaysInMonth = function (year, month) {
    if (typeof year === 'undefined' || year === null) return -1;

    // year must be integer
    if (typeof year !== 'string') year = year.toString();
    if (!validator.isInt(year)) return -1;

    // month could be string or 1 to 12
    var m = _toMonthIndex(month);
    if (m < 0) return -1;

    return (new Date(year, m + 1, 0)).getDate();
};

var _isOneMonthPeriod = function (arg) {
    if (!_isPeriod(arg)) return false;

    var dates = arg.trim().split('-');
    var startDate = dates[0].trim();
    var endDate = dates[1].trim();

    var start = new Date(_sanitiseDate(startDate));
    var end = new Date(_sanitiseDate(endDate));
    var range = moment.range(start, end);
    var daysDiff = range.diff('days');

    var y = start.getFullYear();
    var m = start.getMonth();
    var daysInMonth = _getDaysInMonth(y, m + 1);

    return daysInMonth === daysDiff + 1;
};

var util = {
    isNullOrWhitespace: _isNullOrWhitespace,
    isAmount: _isAmount,
    isDate: _isDate,
    sanitiseAmount: _sanitiseAmount,
    sanitiseDate: _sanitiseDate,
    sanitisePeriod: _sanitisePeriod,
    sanitisePercentage: _sanitisePercentage,
    isPercentage: _isPercentage,
    isPeriod: _isPeriod,
    getCurrentMonthPeriod: _getCurrentMonthPeriod,
    toMonthIndex: _toMonthIndex,
    getDaysInMonth: _getDaysInMonth,
    isOneMonthPeriod: _isOneMonthPeriod
};

module.exports = util;