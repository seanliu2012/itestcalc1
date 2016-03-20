# A sample calculator app

This sample application provides employee monthly pay calculation by using ATO tax rates.
 * Runs on Node.js version 4 or later.

### Analysis, assumptions and screen shots

 * See [Nodejs coding exercise - Sean Liu.pdf](https://github.com/seanliu2012/itestcalc1/blob/master/doc/Nodejs%20coding%20exercise%20-%20Sean%20Liu.pdf).

### Running the app

Steps of setting up:
```shell
$ git clone https://github.com/seanliu2012/itestcalc1 itestcalc1
$ cd ./itestcalc1
$ npm install
$ node src/app.js        # run application without any command line option
$ npm test               # run all unit tests
```

Alternatively, better create a symbolic link __paycalc__ and run it instead:
```shell
$ npm link
$ paycalc                # run application without any command line option
```

Sample command lines:
```shell
$ paycalc -t                      # run an interactive test by following prompts
$ paycalc -f <path-to-csv-file>   # bulk calculation for a given csv file
$ paycalc --help
```
