/**
 * @typedef   {TypeError} IdFnNotAFunction
 *
 * @desc      Error thrown when one tries ot set the id generator function to something that is not a function.
 *
 * @example
 * const loggerFactory = require( "fs-error-logger" );
 * //"Not a function!" is not a function
 * const logger = loggerFactory( { idFn: "Not a function!" } );
 *
 * @example
 * const loggerFactory = require( "fs-error-logger" );
 * const logger = loggerFactory( );
 * logger.setIdFn(0); //0 is not a function
 */

/**
 * @typedef   {TypeError} PathNotAString
 *
 * @desc      Error thrown when one tries ot set the output folder path with something that is not a string.
 *
 * @example
 * const loggerFactory = require( "fs-error-logger" );
 * //{} is not a string
 * const logger = loggerFactory( { outputFolder: {} } );
 *
 * @example
 * const loggerFactory = require( "fs-error-logger" );
 * const logger = loggerFactory( );
 * logger.setOutputFolder(2); //2 is not a string
 */

/**
 * @private
 * @func    errorFactory
 * @param   {string}        name    The name of the error to be created.
 * @param   {string}        message The message the error will contain.
 * @param   {Error}         [errorType = new Error()] The error type that will be created and returned.
 * @returns {Error}
 *
 * @description Creates an error and returns it.
 */
const errorFactory = ( name, message, errorType ) => {
    const error = errorType;
    error.message = message + ` See https://fl4m3ph03n1x.github.io/fs-error-logger/global.html#${name} for more info on errors.`;
    error.name = name;
    return error;
};

/**
 *  @private
 *  @func       idFnNotAFunction
 *  @param      {*}         idFn  The object that should be a function and isn't.
 *  @returns    {TypeError}
 *
 *  @description    Returns an "IdFnNotAFunction" TypeError with an information message on how to fix the issue.
 */
const idFnNotAFunction = idFn =>
    errorFactory( "IdFnNotAFunction", `'idFn': ${idFn} must be a function!.`, new TypeError() );

/**
 *  @private
 *  @func       pathNotAString
 *  @param      {*}         outputFolderPath  The object that should be a
 *                                            string and isn't.
 *  @returns    {TypeError}
 *
 *  @description    Returns an "PathNotAString" TypeError with an information message on how to fix the issue.
 */
const pathNotAString = outputFolderPath =>
    errorFactory( "PathNotAString", `'outputFolder': ${outputFolderPath} must be a string!`, new TypeError() );

module.exports.idFnNotAFunction = idFnNotAFunction;
module.exports.pathNotAString = pathNotAString;
