<p align="center">
    <img src="https://raw.githubusercontent.com/Fl4m3Ph03n1x/fs-error-logger/master/logos/logo_no_wm.png" >
</p>

<div align="center">

[![NPM](https://nodei.co/npm/fs-error-logger.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fs-error-logger/)

[![Build Status](https://travis-ci.org/Fl4m3Ph03n1x/fs-error-logger.svg?branch=master)](https://travis-ci.org/Fl4m3Ph03n1x/fs-error-logger)[![codecov](https://codecov.io/gh/Fl4m3Ph03n1x/fs-error-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/Fl4m3Ph03n1x/fs-error-logger)[![Dependency Status](https://www.versioneye.com/user/projects/595cf6bf0fb24f006c059d56/badge.svg)](https://www.versioneye.com/user/projects/595cf6bf0fb24f006c059d56)[![Code Climate](https://codeclimate.com/github/Fl4m3Ph03n1x/fs-error-logger/badges/gpa.svg)](https://codeclimate.com/github/Fl4m3Ph03n1x/fs-error-logger)[![Inline docs](http://inch-ci.org/github/Fl4m3Ph03n1x/fs-error-logger.svg?branch=master)](http://inch-ci.org/github/Fl4m3Ph03n1x/fs-error-logger)[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

</div>


#   What

`fs-error-logger` is a small module that allows you to write JSON and XML files for errors. It was written for nodejs by using its `fs` library, but if you want you can inject a different dependency in it and use it instead.

#   Why

Most people, when catching an error, use `console.log` to display it and they're done. This however, is commonly seen as a bad practice because:

1. When having several errors, you will get your console spammed until you eventually loose track of errors or are too spammed to see them.
2. It is seen as a [good practice to remove `console.log`](http://eslint.org/docs/rules/no-console) calls from production code.
3. `console.log` calls [will fail in some environments](https://stackoverflow.com/questions/1114187/is-it-a-bad-idea-to-leave-console-log-calls-in-your-producton-javascript-cod), forcing you to use dummy stubs instead.

Instead, of using `console.log` you should:

1. Actually try to fix the error
2. If that is not possible, log it or show it in a consistent, time persistent way.

`fs-error-logger` was made to fulfill the second need. By saving your logs to disk, you are able to later retrieve and evaluate them. Furthermore, you also have access to the logs in two formats: JSON and XML - both human readable.

#   How

Every time you log an error using`fs-error-logger` you decide where to write it, in what format and its ID. This means that your logs will always be unique and that you wont lose a single one.

If you don't want to do any setup, you can use the default options which will server you just as well.

If you have any questions you can ask in the issues page:

 - [fs-error-logger Issues](https://github.com/Fl4m3Ph03n1x/fs-error-logger/issues)

Any ideas/contributions are also welcome in the github page:

 - [fs-error-logger github](https://github.com/Fl4m3Ph03n1x/fs-error-logger)

## Install

    npm install fs-error-logger --save

##  Examples

Files created by the `logJSON` and `logXML` functions have the following format:

 - ErrorType_ID.Format

So for example, an error of type `Error` using the default `Date.now` function as an ID would produce the file `Error_12231413.json` or `Error_12231413.xml`, depending on the format.

An error of type `TypeError` would generate `TypeError_12231413.json` and so on...

The first part of the file is the `error.name` property, while the second is an unique id returned by the `idFn` which you can parametrize. Following are examples on how you can create logs.

Create a logger and log an error in JSON:

```
const loggerFactory = require( "fs-error-logger" );
const logger = loggerFactory();

//creates a file named 'Error_12512451.json' in the current folder
logger.logJSON( new Error() )
    .then( () => console.log("File written successfully!") )
    .catch( console.log );
```

Create a logger that logs an error in XML:

```
const loggerFactory = require( "fs-error-logger" );
const logger = loggerFactory();

//creates a file named 'Error_12512451.xml' in the current folder
logger.logXML( new Error() )
    .then( () => console.log("File written successfully!") )
    .catch( console.log );
```

Create a logger that writes to the 'errors/' folder:

```
const loggerFactory = require( "fs-error-logger" );
const logger = loggerFactory({outputFolder: "./errors/"});

//creates a file named 'Error_12512451.json' in the current folder
logger.logJSON( new Error() )
    .then( () => console.log("File written successfully!") )
    .catch( console.log );
```

Create a logger that uses as uuidv1 as file ID:

```
const loggerFactory = require( "fs-error-logger" );
const uuidv1 = require("uuid/v1");

const logger = loggerFactory({idFn: uuidv1});

//creates a file named 'Error_12512451.json' in the current folder
logger.logJSON( new Error() )
    .then( () => console.log("File written successfully!") )
    .catch( console.log );
```

Create a logger with default options and then change the output folder:

```
const loggerFactory = require( "fs-error-logger" );
const logger = loggerFactory();

logger.setOutputFolder("./errors/");

//creates a file named 'Error_12512451.json' in the "./errors/" folder
logger.logJSON( new Error() )
    .then( () => console.log("File written successfully!") )
    .catch( console.log );
```
