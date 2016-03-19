/**
 * Created by Sean.Liu on 15/03/2016.
 */

var _ = require('lodash');
var util = require('../lib/util');
var individualTaxRates = require('./individualTaxRates').individualTaxRates;
var superGuaranteeRates = require('./superGuaranteeRates').superGuaranteeRates;

var rateApi = {

    getMinSupportedDate: function () {
        var obj = _.last(individualTaxRates);
        return new Date(obj.StartDate);
    },

    getMaxSupportedDate: function () {
        var obj = _.head(individualTaxRates);
        var upperTime = new Date(obj.StartDate);
        return new Date(upperTime - 1) ; // 1 millisecond before
    },

    getIndividualTaxRate: function (dateStr, salaryAmount) {
        if (!util.isDate(dateStr)) return null;
        if (!util.isAmount(salaryAmount)) return null;

        var date = new Date(dateStr);
        var amount = util.sanitiseAmount(salaryAmount);

        var obj = _.find(individualTaxRates, function (o) {
            var startDate = new Date(o.StartDate);
            return date >= startDate && amount >= o.Threshold;
        });

        return obj;
    },

    getMinSGRate: function () {
        var obj = _.last(superGuaranteeRates);
        return obj.SGRate;
    },

    getSGRate: function (dateStr) {
        if (!util.isDate(dateStr)) return 0;

        var date = new Date(dateStr);

        var obj = _.find(superGuaranteeRates, function (o) {
            var startDate = new Date(o.StartDate);
            return date >= startDate;
        });

        return _.isUndefined(obj) ? 0 : obj.SGRate;
    }
};

module.exports = rateApi;