const serializeError = require( "serialize-error" );
const isFunction = require( "lodash.isfunction" );
const isString = require( "lodash.isstring" );
const stringify = require( "json-stringify-pretty-compact" );
const toXML = require( "to-xml" ).toXML;

const promisify = require( "util" ).promisify;

/**
 * @public
 * @author  Pedro Miguel P. S. Martins
 * @version 1.0.0
 * @module  logger
 *
 * @desc    Writes errors into files in both JSON and XML.
 */
const logger = ( { fs }, { outputFolder = ".", idFn = Date.now } ) => {

    if ( !isString( outputFolder ) )
        throw new TypeError( "'outputFolder' must be a string!" );

    if ( !isFunction( idFn ) )
        throw new TypeError( "'idFn' must be a function!" );

    if ( outputFolder[ outputFolder.length - 1 ] === "/" )
        outputFolder = outputFolder.substring( 0, outputFolder.length - 1 );

    const writeFile = promisify( fs.writeFile );
    const mkdir = promisify( fs.mkdir );

    const logJSON = error =>
        write(
            `${outputFolder}/${error.name}_${idFn()}.json`,
            stringify( serializeError( error ), { indent: 4 } )
        );

    const logXML = error =>
        write(
            `${outputFolder}/${error.name}_${idFn()}.xml`,
            toXML( { error: serializeError( error ) } )
        );

    const write = ( fileName, fileContent ) => {
        if ( !fs.existsSync( outputFolder ) )
            return mkdir( outputFolder )
                .then( () => writeFile( fileName, fileContent ) );

        return writeFile( fileName, fileContent );
    };

    const setOutputFolder = newFolder => {
        if ( !isString( newFolder ) )
            throw new TypeError( "'outputFolder' must be a string!" );

        outputFolder = newFolder;
    };

    const getOutputFolder = () => outputFolder;

    const setIdFn = newFn => {
        if ( !isFunction( newFn ) )
            throw new TypeError( "'idFn' must be a function!" );
        idFn = newFn;
    };

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

const fs = require( "fs" );

const loggerFactory = opts => {
    if ( opts === undefined || opts === null )
        return logger( { fs }, {} );
    return logger( { fs }, opts );
};

module.exports = loggerFactory;
module.exports.logger = logger;
