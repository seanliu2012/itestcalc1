/**
 * Created by Sean.Liu on 19/03/2016.
 */

var _ = require('lodash');
var Table = require('easy-table');

var resultFormatter = {
    toTable: function (calcResults) {
        if (!_.isArray(calcResults)) return null;

        var t = new Table;
        calcResults.forEach(function (calcResult) {
            t.cell('Full Name', calcResult.Name);
            t.cell('Pay Period', calcResult.Period);
            t.cell('Gross Income', calcResult.Gross, Table.number(0));
            t.cell('Tax Withheld', calcResult.TaxWithheld, Table.number(0));
            t.cell('Net Pay', calcResult.NetPay, Table.number(0));
            t.cell('Super', calcResult.Super, Table.number(0));
            t.newRow()
        });
        return t;
    }
};

module.exports = resultFormatter;