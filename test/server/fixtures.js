'use strict';

var mongoose = require( 'mongoose' );
var express = require( 'express' );
var baucis = require( 'baucis' );
var path = require( 'path' );
var config = require( '../../server/config' ).configs;
var mongoURL = require( '../../server/config' ).mongoURL;
var helpers = require( './helpers' );

module.exports = {
	init: function( module, fn ) {
		var request = require( 'supertest' );
		var agent;
		try {
			mongoose.connect( mongoURL( config.mongodb ) );

			require( path.resolve( helpers.controller_path, module + 'Controller' ) )( baucis );

			var app = express();
			app.use( express.json() );
			app.use( express.cookieParser() );
			app.use( express.session( {
				'secret': 'macbook_dog'
			} ) );

			app.use( config.rest, baucis() );
			agent = request.agent( app );

			fn( null, agent );
		} catch ( error ) {
			fn( error, null );
		}
	},

	deinit: function( module, fn ) {
		var model = require( path.resolve( helpers.schema_path, module + 'Schema' ) );
		model.find().remove( function() {
			mongoose.disconnect();
			fn();
		} );
	}
};