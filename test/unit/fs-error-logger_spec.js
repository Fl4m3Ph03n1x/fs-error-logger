const sinon = require( "sinon" );
const chai = require( "chai" );
const chaiAsPromised = require( "chai-as-promised" );
chai.use( chaiAsPromised );
const expect = chai.expect;
const fs = require( "fs" );
const rmdir = require( "rmdir" );

const loggerFactory = require( "../../src/fs-error-logger.js" );

describe( "logger", () => {

    const ERROR_DIR = "./errors";

    afterEach( "delete test fodlers", done => {
        if ( fs.existsSync( ERROR_DIR ) ) {
            rmdir( ERROR_DIR, ( err ) => {
                if ( err ) {
                    done( err );
                    return;
                }
                done();
            } );
        } else {
            done();
        }
    } );

    it( "should create a JSON log file", done => {
        const logger = loggerFactory( { outputFolder: ERROR_DIR, idFn: () => "test" } );

        logger.logJSON( new Error() )
            .then( () => {
                expect( fs.existsSync( `${ERROR_DIR}/Error_test.json` ) ).to.be.true;
                done();
            } )
            .catch( done );
    } );

    it( "should throw an error if it there is an error while writing a log", () => {
        const writeStub = sinon.stub( fs, "writeFile" ).callsFake(
            ( file, data, callback ) => {
                callback( new Error() );
            } );
        const logger = loggerFactory();
        expect( logger.logJSON( new Error() ) ).to.be.rejectedWith( Error );
        writeStub.restore();
    } );

    it( "should create a XML log file", done => {
        const logger = loggerFactory( { outputFolder: ERROR_DIR, idFn: () => "test" } );

        logger.logXML( new Error() )
            .then( () => {
                expect( fs.existsSync( `${ERROR_DIR}/Error_test.xml` ) ).to.be.true;
                done();
            } )
            .catch( done );
    } );

    it( "should be able to set outputFolder", () => {
        const outputPath = "./src";
        const logger = loggerFactory();
        logger.setOutputFolder( outputPath );
        expect( logger.getOutputFolder() ).to.eql( outputPath );
    } );

    it( "should be able to get outputFolder ", () => {
        const logger = loggerFactory();
        expect( logger.getOutputFolder() ).to.eql( "." );
    } );

    it( "should be able to set idFn", () => {
        const logger = loggerFactory();
        const myIdFn = () => {};
        logger.setIdFn( myIdFn );
        expect( logger.getIdFn() ).to.eql( myIdFn );
    } );

    it( "should be able to get idFn", () => {
        const logger = loggerFactory();
        expect( logger.getIdFn() ).to.eql( Date.now );
    } );

    it( "should remove '/' from outputFolder name", () => {
        const logger = loggerFactory( { outputFolder: ERROR_DIR + "/" } );
        expect( logger.getOutputFolder() ).to.eql( ERROR_DIR );
    } );

    it( "should throw if we set 'idFn' as not a function", () => {
        const logger = loggerFactory();
        expect( logger.setIdFn.bind( null, "not a fn!" ) ).to.throw( TypeError );
    } );

    it( "should throw if we pass an 'idFn' that is not a function in the constructor parameters", () => {
        expect( loggerFactory.bind( null, { idFn: "Not a fn!" } ) ).to.throw( TypeError );
    } );

    it( "should throw if we call 'setOutputFolder' without a string parameter", () => {
        const logger = loggerFactory();
        expect( logger.setOutputFolder.bind( null, {} ) ).to.throw( TypeError );
    } );

    it( "should throw if we pass an 'outputFolder' that is not a string in the constructor parameters", () => {
        expect( loggerFactory.bind( null, { outputFolder: {} } ) ).to.throw( TypeError );
    } );
} );
