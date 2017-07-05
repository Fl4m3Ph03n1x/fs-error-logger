const serializeError = require( "serialize-error" );
const isFunction = require( "lodash.isfunction" );
const isString = require( "lodash.isstring" );
const stringify = require( "json-stringify-pretty-compact" );
const toXML = require( "to-xml" ).toXML;

const promisify = require( "util" ).promisify;

const error = require( "./errors" );
const idFnNotAFunction = error.idFnNotAFunction;
const pathNotAString = error.pathNotAString;

const DEAFULT_OUTPUT_FOLDER = ".";

/**
 * @public
 * @author  Pedro Miguel P. S. Martins
 * @version 1.0.1
 * @module  fs-error-logger
 *
 * @desc    Writes errors into files in both JSON and XML.
 */

/**
 * @typedef   options
 * @type      {Object}
 * @property  {string}    [outputFolder="."] The default output folder.
 * @property  {function}  [idFn=Date.now]    The default id generator
 *                                                function.
 *
 * @desc      Options object determining output folder and id generator function.
 */

/**
 * @alias   module:fs-error-logger.logger
 * @param   {Object}  deps
 * @param   {Object}  deps.fs File system object that allows the logger to
 *                            write the files. Must have an async
 *                            <code>writeFile</code> function and an async
 *                            <code>mkdir</code> function.
 * @param   {module:fs-error-logger~options} [opts]  Options object determining output folder and
 *                            id generator function.
 * @returns {Object}
 *
 * @desc    Returns a logger object, with the API that allows you to write errors to files.
 */
const logger = ( { fs }, { outputFolder = DEAFULT_OUTPUT_FOLDER, idFn = Date.now } ) => {

    if ( !isString( outputFolder ) )
        throw pathNotAString( outputFolder );

    if ( !isFunction( idFn ) )
        throw idFnNotAFunction( idFn );

    if ( outputFolder[ outputFolder.length - 1 ] === "/" )
        outputFolder = outputFolder.substring( 0, outputFolder.length - 1 );

    const writeFile = promisify( fs.writeFile );
    const mkdir = promisify( fs.mkdir );

    /**
     * @public
     * @function  logJSON
     * @param     {Error}   error The error object we want to write.
     * @returns   {Promise}
     *
     * @desc      Resolves if the error was successfully written to a JSON file or rejects otherwise. The format of the file will be: <code>${error.name}_${idFn()}.json</code>.
     */
    const logJSON = error =>
        write(
            `${outputFolder}/${error.name}_${idFn()}.json`,
            stringify( serializeError( error ), { indent: 4 } )
        );

    /**
     * @public
     * @function  logXML
     * @param     {Error}   error   The error object we want to write.
     * @returns   {Promise}
     *
     * @desc      Resolves if the error was successfully written to a XML file or rejects otherwise. The format of the file will be: <code>${error.name}_${idFn()}.xml</code>.
     */
    const logXML = error =>
        write(
            `${outputFolder}/${error.name}_${idFn()}.xml`,
            toXML( { error: serializeError( error ) } )
        );


    /**
     * @private
     * @function write
     * @param   {string}  fileName      The name of the file to be created.
     * @param   {string}  fileContent   The content of the file.
     * @returns {Promise}
     *
     * @desc    If successfull, resolves after creates a file with given name
     *          and content.Otherwise rejects with error.
     */
    const write = ( fileName, fileContent ) => {
        if ( !fs.existsSync( outputFolder ) )
            return mkdir( outputFolder )
                .then( () => writeFile( fileName, fileContent ) );

        return writeFile( fileName, fileContent );
    };

    /**
     * @public
     * @function  setOutputFolder
     * @param     {string}  newFolder The path of the output folder.
     * @throws    {PathNotAString}    If <code>newFolder</code> is not a string.
     *
     * @desc      Sets the output folder path to the one passed.
     */
    const setOutputFolder = newFolder => {
        if ( !isString( newFolder ) )
            throw pathNotAString( newFolder );

        if ( newFolder === "" ) {
            outputFolder = DEAFULT_OUTPUT_FOLDER;
        } else {
            outputFolder = newFolder;
        }
    };

    /**
     * @public
     * @function  getOutputFolder
     * @returns   {string}
     *
     * @desc      Returns the current output folder path.
     */
    const getOutputFolder = () => outputFolder;

    /**
     * @public
     * @function  setIdFn
     * @param     {function}  newFn   A new Id generator function.
     * @throws    {IdFnNotAFunction}  If <code>newFn</code> is not a function.
     *
     * @desc      Sets the current Id generator function to the one given.
     */
    const setIdFn = newFn => {
        if ( !isFunction( newFn ) )
            throw idFnNotAFunction( newFn );
        idFn = newFn;
    };

    /**
     * @public
     * @function  getIdFn
     * @returns   {function}
     *
     * @desc      Returns the current id generator function.
     */
    const getIdFn = () => idFn;

    return {
        logJSON,
        logXML,
        setOutputFolder,
        getOutputFolder,
        setIdFn,
        getIdFn
    };
};

module.exports.logger = logger;

const fs = require( "fs" );

/**
 * @private
 * @param     {module:fs-error-logger~options}    [opts] Options object determining output folder and
 *                                id generator function.
 * @returns   {Object}
 *
 * @desc      Returns a logger object with all the dependencies pre-injected and with the given options, ready to use.
 */
module.exports = opts => {
    if ( opts === undefined || opts === null )
        return logger( { fs }, {} );
    return logger( { fs }, opts );
};
