#   What

`fs-error-logger` is a small module that allows you to write JSON and XML files
for errors. It was written for nodejs by using its `fs` library, but if you want
you can inject a different dependency in it and use it instead.

#   Why

Most people, when catching an error, use `console.log` to display it and they're
done. This however, is commonly seen as a bad practice because:

1. When having several errors, you will get your console spammed until you
eventually loose track of errors or are too spammed to see them.
2. It is seen as a good practice to remove `console.log` calls from production
code
3. `console.log` calls will fail in some environments, forcing you to use dummy
stubs instead

Instead, of using console.log you should:

1. Actually try to fix the error
2. If that is not possible, log it or show it in a consistent, time persistent
way

`fs-error-logger` was made to fulfill the second need. By saving your logs to
disk, you are able to later retrieve and evaluate them. Furthermore, you also
have access to the logs in two formats: JSON and XML - both human readble.

#   How

Every time you log an error using`fs-error-logger` you decide where to write it,
in what format and its ID. This means that your logs will always be unique and
that you wont lose a single one.

If you don't want to do any setup, you can use the default options which will
server you just as well.

If you have any questions you can ask in the issues page:

 - [fs-error-logger Issues](https://github.com/Fl4m3Ph03n1x/heartbeatjs/issues)

Feel free to check the [fs-error-logger project page](https://fl4m3ph03n1x.github.io/heartbeatjs/index.html)
for additional information as well.

## Install

    npm install fs-error-logger --save

## API

 - logXML
 - logJSON
 - setOutputFolder
 - getOutputFolder
 - setIdFn
 - getIdFn

##  Examples

WIP
