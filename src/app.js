#! /usr/bin/env node

var pkg = require('../package.json');
var program = require('commander');
var chalk = require('chalk');
var doInteractiveTest = require('./doInteractiveTest');
var doCsvFile = require('./doCsvFile');

program
    .version(pkg.version)
    .usage('[options] [csv line or file]')
    .description('Monthly payment calculator using current ATO rates')
    .option('-t, --test', 'interactive test by following prompts')
    .option('-l, --csvLine <line>', 'test csv line in format of: ' + chalk.yellow('FirstName,LastName,Salary,SuperRate,Period'))
    .option('-f, --csvFile <file>', 'bulk calculation for a given csv file')
    .parse(process.argv);

if (program.test) {

    doInteractiveTest.start();

} else if (program.csvLine) {

    console.log(program.csvLine);

} else if (program.csvFile) {

    doCsvFile.start(program.csvFile);

} else {
    // fall back to show syntax
    program.help();
}